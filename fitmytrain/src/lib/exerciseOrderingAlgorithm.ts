import { TrainingGoal, ExperienceLevel, MuscleGroup } from '@/types/training';
import { 
  FatigueLevel, 
  InjuryArea, 
  EquipmentType,
  RISK_LEVEL_SCORE,
  NEUROLOGICAL_DEMAND_SCORE,
  CATEGORY_PRIORITY,
} from '@/types/exercise-metadata';
import { getExerciseMetadata, isExerciseSafeForUser, getSafeAlternatives } from '@/data/exerciseMetadata';
import { getExerciseById } from '@/data/exercises';

export interface OrderingContext {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  priorityMuscles: MuscleGroup[];
  injuries: InjuryArea[];
  equipment: EquipmentType[];
  fatigueLevel: FatigueLevel;
}

export interface OrderedExercise {
  exerciseId: string;
  order: number;
  sets: number;
  reps: string;
  notes?: string;
  isActivation?: boolean;
  isModified?: boolean; // Was replaced due to injury/fatigue
  originalExerciseId?: string;
}

// Main sorting algorithm
export function sortExercises(
  exerciseIds: string[],
  context: OrderingContext
): OrderedExercise[] {
  const { goal, experience, priorityMuscles, injuries, equipment, fatigueLevel } = context;

  // Step 1: Filter out contraindicated exercises and find safe alternatives
  const safeExercises = exerciseIds.map(id => {
    if (isExerciseSafeForUser(id, injuries)) {
      return { id, isModified: false, originalId: undefined };
    }
    
    // Find safe alternative
    const alternatives = getSafeAlternatives(id, injuries);
    if (alternatives.length > 0) {
      return { id: alternatives[0], isModified: true, originalId: id };
    }
    
    // No safe alternative, exclude
    return null;
  }).filter(Boolean) as { id: string; isModified: boolean; originalId?: string }[];

  // Step 2: Filter by available equipment
  const availableExercises = safeExercises.filter(ex => {
    const metadata = getExerciseMetadata(ex.id);
    if (!metadata) return true;
    return metadata.equipment.some(eq => equipment.includes(eq));
  });

  // Step 3: Prepare exercises with metadata for sorting
  const exercisesWithMeta = availableExercises.map(ex => {
    const metadata = getExerciseMetadata(ex.id);
    const exercise = getExerciseById(ex.id);
    
    return {
      ...ex,
      metadata,
      exercise,
      riskScore: metadata ? RISK_LEVEL_SCORE[metadata.riskLevel] : 1,
      demandScore: metadata ? NEUROLOGICAL_DEMAND_SCORE[metadata.neurologicalDemand] : 1,
      categoryScore: metadata ? CATEGORY_PRIORITY[metadata.category] : 2,
      isPriorityMuscle: exercise ? priorityMuscles.includes(exercise.muscleGroup) : false,
    };
  });

  // Step 4: Apply goal-specific and experience modifiers
  const sorted = applySortingRules(exercisesWithMeta, context);

  // Step 5: Apply fatigue modifier
  const fatigueAdjusted = applyFatigueModifier(sorted, fatigueLevel);

  // Step 6: Validate and apply anti-idiot rules
  const validated = applyValidationRules(fatigueAdjusted, context);

  // Step 7: Calculate sets and reps based on position and goal
  return validated.map((ex, index) => ({
    exerciseId: ex.id,
    order: index + 1,
    sets: calculateSets(ex, index, context),
    reps: calculateReps(ex, index, context),
    notes: ex.notes,
    isActivation: ex.metadata?.category === 'activation',
    isModified: ex.isModified,
    originalExerciseId: ex.originalId,
  }));
}

function applySortingRules(
  exercises: Array<{
    id: string;
    isModified: boolean;
    originalId?: string;
    metadata: ReturnType<typeof getExerciseMetadata>;
    exercise: ReturnType<typeof getExerciseById>;
    riskScore: number;
    demandScore: number;
    categoryScore: number;
    isPriorityMuscle: boolean;
    notes?: string;
  }>,
  context: OrderingContext
) {
  const { goal, experience, priorityMuscles } = context;

  // Separate activation exercises for priority muscles
  const activations = exercises.filter(
    ex => ex.metadata?.category === 'activation' && ex.isPriorityMuscle
  );
  const mainExercises = exercises.filter(
    ex => !(ex.metadata?.category === 'activation' && ex.isPriorityMuscle)
  );

  // Sort main exercises
  mainExercises.sort((a, b) => {
    // Goal-specific sorting
    if (goal === 'cutting' && experience !== 'advanced') {
      // Cutting for non-advanced: compound → isolation
      const catDiff = b.categoryScore - a.categoryScore;
      if (catDiff !== 0) return catDiff;
    } else if (goal === 'recomposition') {
      // Recomposition: prioritize compounds, then semi, then isolation
      const catDiff = b.categoryScore - a.categoryScore;
      if (catDiff !== 0) return catDiff;
    } else {
      // Default: neurological demand → risk → category
      const demandDiff = b.demandScore - a.demandScore;
      if (demandDiff !== 0) return demandDiff;
      
      const riskDiff = b.riskScore - a.riskScore;
      if (riskDiff !== 0) return riskDiff;
      
      const catDiff = b.categoryScore - a.categoryScore;
      if (catDiff !== 0) return catDiff;
    }

    // Priority muscles get slight preference
    if (a.isPriorityMuscle !== b.isPriorityMuscle) {
      return a.isPriorityMuscle ? -1 : 1;
    }

    return 0;
  });

  // Experience-level modifications
  if (experience === 'beginner') {
    // Beginners: no pre-fatigue, machines preferred for high-risk
    return [
      ...mainExercises.map(ex => {
        if (ex.riskScore === 3 && ex.metadata?.equipment.includes('barbell')) {
          // Try to find machine alternative
          const machineAlt = exercises.find(
            alt => alt.exercise?.muscleGroup === ex.exercise?.muscleGroup &&
                   alt.metadata?.equipment.includes('machines')
          );
          if (machineAlt) {
            return { ...machineAlt, isModified: true, originalId: ex.id, notes: 'Заменено на тренажёр (новичок)' };
          }
        }
        return ex;
      })
    ];
  }

  if (experience === 'intermediate') {
    // Intermediate: allow 1 activation before compound if priority muscle
    const priorityActivation = activations.slice(0, 1);
    return [...priorityActivation, ...mainExercises];
  }

  if (experience === 'advanced') {
    // Advanced: full pre-fatigue allowed for priority muscles
    return [...activations, ...mainExercises];
  }

  return mainExercises;
}

function applyFatigueModifier(
  exercises: Array<{
    id: string;
    isModified: boolean;
    originalId?: string;
    metadata: ReturnType<typeof getExerciseMetadata>;
    exercise: ReturnType<typeof getExerciseById>;
    riskScore: number;
    demandScore: number;
    categoryScore: number;
    isPriorityMuscle: boolean;
    notes?: string;
  }>,
  fatigueLevel: FatigueLevel
) {
  if (fatigueLevel === 'low') {
    return exercises; // No changes
  }

  if (fatigueLevel === 'medium') {
    // Medium fatigue: reduce volume slightly, no exercise swaps
    return exercises;
  }

  // High fatigue: swap high-risk barbell exercises to machines
  return exercises.map(ex => {
    if (ex.riskScore === 3 && ex.metadata?.equipment.includes('barbell')) {
      // Find safer alternative
      const exercise = ex.exercise;
      if (exercise?.alternatives) {
        const saferAlt = exercise.alternatives.find(altId => {
          const altMeta = getExerciseMetadata(altId);
          return altMeta && (altMeta.riskLevel === 'low' || altMeta.riskLevel === 'medium');
        });
        if (saferAlt) {
          const altExercise = getExerciseById(saferAlt);
          const altMeta = getExerciseMetadata(saferAlt);
          return {
            ...ex,
            id: saferAlt,
            isModified: true,
            originalId: ex.id,
            exercise: altExercise,
            metadata: altMeta,
            riskScore: altMeta ? RISK_LEVEL_SCORE[altMeta.riskLevel] : 1,
            notes: '⚠️ Заменено из-за усталости',
          };
        }
      }
    }
    return ex;
  });
}

function applyValidationRules(
  exercises: Array<{
    id: string;
    isModified: boolean;
    originalId?: string;
    metadata: ReturnType<typeof getExerciseMetadata>;
    exercise: ReturnType<typeof getExerciseById>;
    riskScore: number;
    demandScore: number;
    categoryScore: number;
    isPriorityMuscle: boolean;
    notes?: string;
  }>,
  context: OrderingContext
) {
  const validated = [...exercises];
  const { experience } = context;

  // Rule: Beginners cannot start with isolation
  if (experience === 'beginner' && validated.length > 0) {
    const first = validated[0];
    if (first.metadata?.category === 'isolation') {
      // Find first compound and swap
      const compoundIdx = validated.findIndex(ex => 
        ex.metadata?.category === 'compound' || ex.metadata?.category === 'semi_compound'
      );
      if (compoundIdx > 0) {
        [validated[0], validated[compoundIdx]] = [validated[compoundIdx], validated[0]];
      }
    }
  }

  // Rule: No deadlift after failure squats (CNS overload)
  const squatFailureIdx = validated.findIndex(ex => 
    ex.id.includes('squat') && ex.riskScore === 3
  );
  const deadliftIdx = validated.findIndex(ex => 
    ex.id.includes('deadlift')
  );
  
  if (squatFailureIdx >= 0 && deadliftIdx > squatFailureIdx) {
    // Move deadlift before squat or mark as warning
    validated[deadliftIdx] = {
      ...validated[deadliftIdx],
      notes: '⚠️ Высокая нагрузка на ЦНС - контролируй усталость',
    };
  }

  return validated;
}

/** Лимиты подходов по категориям упражнений */
const SET_LIMITS: Record<string, { min: number; max: number }> = {
  compound: { min: 2, max: 5 },
  semi_compound: { min: 2, max: 4 },
  isolation: { min: 2, max: 4 },
  activation: { min: 1, max: 2 },
};

function calculateSets(
  exercise: { metadata: ReturnType<typeof getExerciseMetadata>; id: string },
  index: number,
  context: OrderingContext
): number {
  const { goal, experience, fatigueLevel } = context;
  const category = exercise.metadata?.category || 'isolation';
  const limits = SET_LIMITS[category] || { min: 2, max: 4 };
  const isCompound = category === 'compound';

  let baseSets = 3;

  // Goal + experience adjustments
  if (goal === 'muscle_gain' || goal === 'recomposition') {
    if (experience === 'advanced') {
      baseSets = isCompound ? 4 : 2;
    } else {
      baseSets = isCompound ? 3 : 2;
    }
  } else if (goal === 'cutting') {
    baseSets = isCompound ? 3 : 2;
  } else if (goal === 'maintenance') {
    baseSets = 2;
  }

  // Position adjustments (later exercises get fewer sets)
  if (index >= 4) baseSets = Math.max(limits.min, baseSets - 1);

  // Fatigue adjustments
  if (fatigueLevel === 'high') {
    baseSets = Math.max(limits.min, baseSets - 1);
  }

  // Activation exercises always use their limits
  if (category === 'activation') {
    baseSets = limits.max;
  }

  // CLAMP: Never exceed category limits
  return Math.min(limits.max, Math.max(limits.min, baseSets));
}

/**
 * @deprecated Используйте getRepRange из trainingParametersEngine
 * Оставлено для обратной совместимости
 */
function calculateReps(
  exercise: { metadata: ReturnType<typeof getExerciseMetadata>; id: string },
  index: number,
  context: OrderingContext
): string {
  // Используем новый движок если доступен
  const { goal } = context;
  const category = exercise.metadata?.category || 'isolation';

  // Goal-based rep ranges (legacy fallback)
  if (goal === 'muscle_gain') {
    if (category === 'compound') return '5–8';
    if (category === 'semi_compound') return '8–10';
    return '10–15';
  }

  if (goal === 'recomposition') {
    if (category === 'compound') return '4–6';
    if (category === 'semi_compound') return '6–10';
    return '10–15';
  }

  if (goal === 'cutting') {
    if (category === 'compound') return '6–10';
    return '12–15';
  }

  if (goal === 'maintenance') {
    if (category === 'compound') return '6–8';
    return '10–12';
  }

  // Default
  if (category === 'compound') return '6–8';
  if (category === 'semi_compound') return '8–10';
  return '10–15';
}

// Calculate fatigue level automatically based on training history
export function calculateAutoFatigue(
  trainingHistory: { date: string; completed: boolean }[],
  today: Date = new Date()
): FatigueLevel {
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentTrainings = trainingHistory.filter(t => {
    const trainingDate = new Date(t.date);
    return trainingDate >= sevenDaysAgo && trainingDate <= today && t.completed;
  });

  const trainingCount = recentTrainings.length;

  // Check for consecutive days
  const sortedDates = recentTrainings
    .map(t => new Date(t.date).toDateString())
    .sort();
  
  let maxConsecutive = 0;
  let currentConsecutive = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      currentConsecutive++;
      maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    } else {
      currentConsecutive = 1;
    }
  }

  // Fatigue rules
  if (trainingCount >= 6 || maxConsecutive >= 4) {
    return 'high';
  }
  if (trainingCount >= 4 || maxConsecutive >= 3) {
    return 'medium';
  }
  return 'low';
}

// Generate user-friendly explanation for the order
export function generateOrderExplanation(
  exercises: OrderedExercise[],
  context: OrderingContext
): string[] {
  const explanations: string[] = [];

  // First exercise explanation
  const first = exercises[0];
  if (first) {
    const metadata = getExerciseMetadata(first.exerciseId);
    if (metadata?.category === 'activation') {
      explanations.push('🔥 Начинаем с активации приоритетных мышц');
    } else if (metadata?.category === 'compound') {
      explanations.push('🧠 Сначала силовой блок — ты полон энергии');
    }
  }

  // Modified exercises explanation
  const modified = exercises.filter(ex => ex.isModified);
  if (modified.length > 0 && context.fatigueLevel === 'high') {
    explanations.push('⚠️ Некоторые упражнения заменены из-за усталости');
  }
  if (modified.length > 0 && context.injuries.length > 0) {
    explanations.push('💪 Подобраны безопасные альтернативы с учётом травм');
  }

  // Ending explanation
  const lastExercises = exercises.slice(-2);
  const hasIsolation = lastExercises.some(ex => {
    const meta = getExerciseMetadata(ex.exerciseId);
    return meta?.category === 'isolation';
  });
  if (hasIsolation) {
    explanations.push('🎯 Изоляция в конце — добиваем мышцы');
  }

  return explanations;
}
