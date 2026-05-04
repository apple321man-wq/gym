/**
 * Smart Plan Generator v3
 * 
 * Улучшения v3:
 * 1. Объём = f(база, уровень, восстановление) через trainingParametersEngine
 * 2. Интенсивность → reps/RIR/%PM через полную матрицу
 * 3. Goal-based модификаторы шаблонов упражнений
 * 4. Повторения = f(цель, интенсивность, тип упражнения)
 * 5. %PM — опциональный слой поверх RIR
 */

import { TrainingGoal, ExperienceLevel, TrainingIntensity, MuscleGroup } from '@/types/training';
import { FatigueLevel, InjuryArea, EquipmentType, ExerciseCategory, MovementPattern, DAILY_PATTERN_LIMITS, MAX_HEAVY_AXIAL_COMPOUNDS_PER_DAY } from '@/types/exercise-metadata';
import { sortExercises, OrderingContext, OrderedExercise } from './exerciseOrderingAlgorithm';
import { getExerciseById } from '@/data/exercises';
import { isExerciseSafeForUser, getSafeAlternatives, getExerciseMetadata } from '@/data/exerciseMetadata';
import { getNormalizedExerciseById } from '@/data/exercisesExtended';
import { SplitType } from '@/data/trainingPrograms';
import {
  calculateTargetVolume,
  getRepRange,
  getIntensityParameters,
  getGoalModifier,
  getWeightRecommendation,
  formatRIR,
  GoalModifier,
  adjustIntensityForBudget,
} from './trainingParametersEngine';

// ============================================================================
// SLOT-BASED DAY ASSEMBLY SYSTEM
// ============================================================================
/**
 * Training day slots define the logical order of exercises.
 * Exercises are assigned to slots in priority order: primary → balance → secondary → isolation
 */
export type TrainingSlot = 'primary' | 'balance' | 'secondary' | 'isolation';

export const SLOT_ORDER: TrainingSlot[] = ['primary', 'balance', 'secondary', 'isolation'];

/** Max exercises per slot */
export const SLOT_LIMITS: Record<TrainingSlot, { min: number; max: number }> = {
  primary: { min: 1, max: 2 },
  balance: { min: 0, max: 2 },
  secondary: { min: 1, max: 3 },
  isolation: { min: 1, max: 3 },
};

// =============================================================================
// WORKOUT VOLUME & CNS LOAD LIMITS
// =============================================================================

/** Per-split session limits */
const WORKOUT_LIMITS: Record<SplitType, { maxExercises: number; maxSets: number; maxHeavy: number }> = {
  full_body:   { maxExercises: 5, maxSets: 18, maxHeavy: 2 },
  upper_lower: { maxExercises: 6, maxSets: 22, maxHeavy: 3 },
  ppl:         { maxExercises: 7, maxSets: 24, maxHeavy: 3 },
};

/** Max exercises per muscle group in a single session */
const PER_MUSCLE_LIMIT: Record<string, number> = {
  chest: 2, back: 2, legs: 2, glutes: 2,
  quadriceps: 2, hamstrings: 2,
  shoulders: 2, biceps: 1, triceps: 1,
  calves: 1, abs: 1, core: 1,
};

const LOWER_BODY_GROUPS = ['legs', 'glutes', 'quadriceps', 'hamstrings', 'calves'];
const LOWER_BODY_LIMIT: Record<SplitType, number> = {
  full_body: 4, upper_lower: 5, ppl: 6,
};

/** Minimum sets per exercise category */
const MIN_SETS: Record<string, number> = {
  compound: 2, semi_compound: 2, isolation: 1, activation: 1,
};
const DEFAULT_MIN_SETS = 1;

/** Minimum exercise types to preserve during pruning */
const MIN_EXERCISE_TYPES = { primary: 1, secondary: 1, isolation: 0 };

/** Muscle groups that must have at least 1 exercise per split */
const MIN_MUSCLE_COVERAGE: Record<SplitType, string[]> = {
  full_body: ['legs', 'chest', 'back', 'shoulders'],
  upper_lower: [],
  ppl: [],
};

/** Precise heavy exercise detection — avoids false positives from assisted/bodyweight variants */
function isHeavyExercise(id: string): boolean {
  return [
    'barbell-squat', 'smith-squat', 'hack-squat',
    'deadlift', 'romanian-deadlift',
    'bench-press', 'incline-bench',
    'overhead-press', 'barbell-row',
    't-bar-row', 'weighted-row',
    'weighted-pullup', 'weighted-dip',
    'leg-press', 'hip-thrust', 'split-squat',
  ].some(pattern => id.includes(pattern));
}

/** Maps exercise category to allowed slots */
function getCategorySlotMapping(category: ExerciseCategory): TrainingSlot[] {
  switch (category) {
    case 'compound':
      return ['primary', 'balance', 'secondary'];
    case 'semi_compound':
      return ['secondary', 'balance'];
    case 'isolation':
      return ['isolation']; // Isolation ONLY in isolation slot
    case 'activation':
      return ['primary', 'secondary']; // Activation can prime primary movements
    default:
      return ['secondary'];
  }
}

export interface SlottedExercise extends OrderedExercise {
  slot: TrainingSlot;
}

export interface TrainingDaySlots {
  primary: SlottedExercise[];
  balance: SlottedExercise[];
  secondary: SlottedExercise[];
  isolation: SlottedExercise[];
}

// =============================================================================
// MOVEMENT PATTERN TRACKING
// =============================================================================

export interface PatternTracker {
  patternCounts: Record<MovementPattern, number>;
  heavyAxialCount: number;
}

/** Create a fresh pattern tracker */
function createPatternTracker(): PatternTracker {
  return {
    patternCounts: {
      press: 0,
      pull: 0,
      squat: 0,
      hinge: 0,
      carry: 0,
      rotation: 0,
    },
    heavyAxialCount: 0,
  };
}

/** Check if exercise can be added based on pattern constraints */
function canAddExerciseByPattern(
  exerciseId: string,
  tracker: PatternTracker,
  getCategoryFn: (id: string) => ExerciseCategory
): boolean {
  const metadata = getExerciseMetadata(exerciseId);
  const normalizedEx = getNormalizedExerciseById(exerciseId);
  const category = getCategoryFn(exerciseId);
  
  // Check pattern limit
  if (metadata?.movementPattern) {
    const limit = DAILY_PATTERN_LIMITS[metadata.movementPattern];
    if (tracker.patternCounts[metadata.movementPattern] >= limit) {
      return false;
    }
  }
  
  // Check heavy axial compound limit
  const isAxialLoad = normalizedEx?.axialLoad ?? false;
  const isCompound = category === 'compound';
  const isHighRisk = metadata?.riskLevel === 'high';
  
  if (isAxialLoad && isCompound && isHighRisk) {
    if (tracker.heavyAxialCount >= MAX_HEAVY_AXIAL_COMPOUNDS_PER_DAY) {
      return false;
    }
  }
  
  return true;
}

/** Update tracker after adding an exercise */
function updatePatternTracker(
  exerciseId: string,
  tracker: PatternTracker,
  getCategoryFn: (id: string) => ExerciseCategory
): void {
  const metadata = getExerciseMetadata(exerciseId);
  const normalizedEx = getNormalizedExerciseById(exerciseId);
  const category = getCategoryFn(exerciseId);
  
  // Update pattern count
  if (metadata?.movementPattern) {
    tracker.patternCounts[metadata.movementPattern]++;
  }
  
  // Update heavy axial count
  const isAxialLoad = normalizedEx?.axialLoad ?? false;
  const isCompound = category === 'compound';
  const isHighRisk = metadata?.riskLevel === 'high';
  
  if (isAxialLoad && isCompound && isHighRisk) {
    tracker.heavyAxialCount++;
  }
}

/**
 * Assigns exercises to slots based on their category, slot limits, and pattern constraints.
 * Fills slots in order: primary → balance → secondary → isolation
 * 
 * Pattern constraints enforced:
 * - Max 2 press-dominant exercises per day
 * - Max 1 heavy axial-load compound per day
 */
function assignExercisesToSlots(
  exercises: OrderedExercise[],
  getCategoryFn: (exerciseId: string) => ExerciseCategory
): TrainingDaySlots {
  const slots: TrainingDaySlots = {
    primary: [],
    balance: [],
    secondary: [],
    isolation: [],
  };

  // Track which exercises have been assigned
  const assigned = new Set<string>();
  
  // Initialize pattern tracker for this day
  const patternTracker = createPatternTracker();

  // First pass: assign each exercise to its best-fit slot
  for (const slot of SLOT_ORDER) {
    const limit = SLOT_LIMITS[slot];
    
    for (const exercise of exercises) {
      if (assigned.has(exercise.exerciseId)) continue;
      if (slots[slot].length >= limit.max) continue;

      const category = getCategoryFn(exercise.exerciseId);
      const allowedSlots = getCategorySlotMapping(category);

      if (!allowedSlots.includes(slot)) continue;
      
      // Check pattern constraints before adding
      if (!canAddExerciseByPattern(exercise.exerciseId, patternTracker, getCategoryFn)) {
        continue; // Skip this exercise due to pattern limit
      }

      slots[slot].push({ ...exercise, slot });
      assigned.add(exercise.exerciseId);
      
      // Update pattern tracker
      updatePatternTracker(exercise.exerciseId, patternTracker, getCategoryFn);
    }
  }

  return slots;
}

/**
 * Flattens slots back to ordered exercise list (slot-by-slot order)
 */
function flattenSlotsToExercises(slots: TrainingDaySlots): SlottedExercise[] {
  const result: SlottedExercise[] = [];
  
  for (const slot of SLOT_ORDER) {
    result.push(...slots[slot]);
  }
  
  // Reassign order indices
  return result.map((ex, index) => ({ ...ex, order: index + 1 }));
}

// ============================================================================
// SET LIMITS PER EXERCISE CATEGORY
// ============================================================================
/** Минимальные и максимальные подходы по категории упражнений */
export const SET_LIMITS: Record<ExerciseCategory, { min: number; max: number }> = {
  compound: { min: 2, max: 5 },
  semi_compound: { min: 2, max: 4 },
  isolation: { min: 2, max: 4 },
  activation: { min: 1, max: 2 },
};

// =============================================================================
// SLOT-BASED EXERCISE TEMPLATES
// =============================================================================
/**
 * Exercise templates organized by slot:
 * - primary: Main compound lifts (max 2 per day)
 * - balance: Opposing movements to primary
 * - secondary: Hypertrophy-focused compounds/machines
 * - isolation: Finisher exercises (only in isolation slot)
 */
export interface SlotBasedTemplate {
  primary: string[];
  balance: string[];
  secondary: string[];
  isolation: string[];
}

const EXERCISE_TEMPLATES: Record<SplitType, Record<string, SlotBasedTemplate>> = {
  full_body: {
    // Rotation A: Legs emphasis — squat is heavy primary
    emphasis_legs: {
      primary: ['squat'],
      balance: ['bench-press'],
      secondary: ['cable-row'],
      isolation: ['lateral-raise', 'dumbbell-curl'],
    },
    // Rotation B: Back emphasis — deadlift is heavy primary
    emphasis_back: {
      primary: ['deadlift'],
      balance: ['pull-ups'],
      secondary: ['dumbbell-bench-press', 'leg-press'],
      isolation: ['tricep-pushdown'],
    },
    // Rotation C: Chest emphasis — bench press is heavy primary
    emphasis_chest: {
      primary: ['bench-press'],
      balance: ['bulgarian-split-squat'],
      secondary: ['cable-row'],
      isolation: ['lateral-raise', 'hammer-curl'],
    },
  },
  upper_lower: {
    upper_push: {
      // Primary: horizontal + vertical press (max 2)
      primary: ['bench-press', 'overhead-press'],
      // Balance: pull movement to oppose presses
      balance: ['face-pull'],
      // Secondary: supporting press movements
      secondary: ['incline-bench-press', 'dips'],
      isolation: ['tricep-pushdown', 'lateral-raise'],
    },
    upper_pull: {
      // Primary: 1 horizontal pull (max 2 but prefer 1 for pull day)
      primary: ['barbell-row'],
      // Balance: vertical pull to complement
      balance: ['pull-ups'],
      secondary: ['lat-pulldown', 'cable-row'],
      isolation: ['barbell-curl', 'face-pull'],
    },
    lower: {
      // Primary: 1 squat pattern (avoid 2 heavy axials)
      primary: ['squat'],
      // Balance: hinge to oppose squat
      balance: ['romanian-deadlift'],
      // Secondary: deadlift moved here, machine work
      secondary: ['deadlift', 'leg-press'],
      isolation: ['leg-extension', 'leg-curl'],
    },
  },
  ppl: {
    push: {
      // Primary: horizontal + vertical press
      primary: ['bench-press', 'overhead-press'],
      // Balance: rear delt/pull for shoulder health
      balance: ['face-pull'],
      secondary: ['incline-bench-press'],
      isolation: ['tricep-pushdown', 'lateral-raise'],
    },
    pull: {
      // Primary: row (deadlift is hinge, moved to secondary)
      primary: ['barbell-row'],
      // Balance: vertical pull
      balance: ['pull-ups'],
      // Secondary: deadlift here since it's hinge-dominant
      secondary: ['deadlift', 'lat-pulldown'],
      isolation: ['barbell-curl', 'hammer-curl', 'face-pull'],
    },
    legs: {
      // Primary: squat pattern
      primary: ['squat'],
      // Balance: hinge pattern
      balance: ['romanian-deadlift'],
      secondary: ['leg-press', 'bulgarian-split-squat'],
      isolation: ['leg-extension', 'leg-curl'],
    },
  },
};

// =============================================================================
// GOAL-SPECIFIC TEMPLATE OVERRIDES (SLOT-BASED)
// =============================================================================
/**
 * Goal-specific exercise template overrides.
 * Each goal can partially override the default templates for specific split types.
 * Structure mirrors SlotBasedTemplate with all slots optional for partial overrides.
 */
type PartialSlotTemplate = Partial<SlotBasedTemplate>;

const GOAL_EXERCISE_OVERRIDES: Record<TrainingGoal, Partial<Record<SplitType, Record<string, PartialSlotTemplate>>>> = {
  muscle_gain: {
    // Mass: more compounds, free weights emphasis
    full_body: {
      emphasis_legs: {
        primary: ['squat'],
        balance: ['bench-press'],
        secondary: ['barbell-row'],
        isolation: ['lateral-raise', 'dumbbell-curl'],
      },
      emphasis_back: {
        primary: ['deadlift'],
        balance: ['weighted-pull-ups'],
        secondary: ['dumbbell-bench-press', 'leg-press'],
        isolation: ['tricep-pushdown'],
      },
      emphasis_chest: {
        primary: ['bench-press'],
        balance: ['bulgarian-split-squat'],
        secondary: ['dumbbell-row'],
        isolation: ['lateral-raise', 'hammer-curl'],
      },
    },
    ppl: {
      push: {
        primary: ['bench-press', 'overhead-press'],
        balance: ['face-pull'],
        secondary: ['incline-bench-press', 'dips', 'close-grip-bench'],
        isolation: ['tricep-pushdown', 'lateral-raise'],
      },
      pull: {
        primary: ['barbell-row'],
        balance: ['weighted-pull-ups'],
        secondary: ['deadlift', 'lat-pulldown', 't-bar-row'],
        isolation: ['barbell-curl', 'hammer-curl', 'face-pull'],
      },
      legs: {
        primary: ['squat'],
        balance: ['romanian-deadlift'],
        secondary: ['leg-press', 'front-squat'],
        isolation: ['leg-extension', 'leg-curl'],
      },
    },
  },
  recomposition: {
    // Recomp: balance between compounds and machines
    full_body: {
      emphasis_legs: {
        primary: ['squat'],
        balance: ['bench-press'],
        secondary: ['cable-row'],
        isolation: ['lateral-raise', 'dumbbell-curl'],
      },
      emphasis_back: {
        primary: ['deadlift'],
        balance: ['lat-pulldown'],
        secondary: ['dumbbell-bench-press', 'leg-press'],
        isolation: ['tricep-pushdown'],
      },
      emphasis_chest: {
        primary: ['incline-bench-press'],
        balance: ['bulgarian-split-squat'],
        secondary: ['cable-row'],
        isolation: ['lateral-raise', 'hammer-curl'],
      },
    },
  },
  cutting: {
    // Cutting: less axial load, more machines, more isolation
    full_body: {
      emphasis_legs: {
        primary: ['leg-press'],
        balance: ['chest-press-machine'],
        secondary: ['cable-row'],
        isolation: ['lateral-raise', 'cable-curl'],
      },
      emphasis_back: {
        primary: ['lat-pulldown'],
        balance: ['cable-row'],
        secondary: ['chest-press-machine', 'leg-extension'],
        isolation: ['tricep-pushdown'],
      },
      emphasis_chest: {
        primary: ['bench-press'],
        balance: ['leg-press'],
        secondary: ['cable-row'],
        isolation: ['lateral-raise', 'tricep-pushdown'],
      },
    },
    ppl: {
      push: {
        primary: ['bench-press'],
        balance: ['face-pull'],
        secondary: ['chest-press-machine', 'shoulder-press-machine', 'incline-bench-press'],
        isolation: ['tricep-pushdown', 'lateral-raise', 'cable-crossover', 'cable-fly'],
      },
      pull: {
        primary: ['lat-pulldown'],
        balance: ['cable-row'],
        secondary: ['t-bar-row'],
        isolation: ['cable-curl', 'hammer-curl', 'face-pull', 'rear-delt-fly'],
      },
      legs: {
        primary: ['leg-press'],
        balance: ['leg-curl'],
        secondary: ['hack-squat'],
        isolation: ['leg-extension', 'glute-kickback-machine', 'calf-raise-machine'],
      },
    },
  },
  maintenance: {
    // Maintenance: variety, lower risk
    full_body: {
      emphasis_legs: {
        primary: ['squat'],
        balance: ['dumbbell-bench-press'],
        secondary: ['cable-row'],
        isolation: ['lateral-raise', 'dumbbell-curl'],
      },
      emphasis_back: {
        primary: ['romanian-deadlift'],
        balance: ['lat-pulldown'],
        secondary: ['dumbbell-bench-press', 'leg-press'],
        isolation: ['tricep-pushdown'],
      },
      emphasis_chest: {
        primary: ['bench-press'],
        balance: ['bulgarian-split-squat'],
        secondary: ['dumbbell-row'],
        isolation: ['lateral-raise', 'hammer-curl'],
      },
    },
  },
};

export interface SmartGeneratorOptions {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeklyTrainings: number;
  injuries: InjuryArea[];
  equipment: EquipmentType[];
  priorityMuscles: MuscleGroup[];
  fatigueLevel: FatigueLevel;
}

export interface GeneratedExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  repRange: string;        // "4–6" формат
  rir: string;             // "RIR 0–1" или "До отказа"
  percentPM?: string;      // "80–87%" если есть
  isModified: boolean;
  originalExerciseId?: string;
  notes?: string;
}

export interface GeneratedSession {
  name: string;
  intensity: TrainingIntensity;
  exercises: GeneratedExercise[];
}

export interface SmartTrainingProgram {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeklyTrainings: number;
  splitType: SplitType;
  sessions: GeneratedSession[];
  volumeDistribution: string;
  targetVolume: Record<MuscleGroup, number>; // Рассчитанный объём
}

/**
 * Определяет сплит на основе опыта и частоты
 */
function determineSplitType(experience: ExperienceLevel, weeklyTrainings: number): SplitType {
  if (experience === 'beginner' || weeklyTrainings <= 3) {
    return 'full_body';
  }
  if (weeklyTrainings <= 4) {
    return 'upper_lower';
  }
  return 'ppl';
}

/**
 * Рассчитывает распределение объёма по дням
 */
function calculateVolumeDistribution(weeklyTrainings: number, targetVolume: Record<MuscleGroup, number>): number[] {
  // Базовое распределение объёма по дням
  const distributions: Record<number, number[]> = {
    2: [0.5, 0.5],
    3: [0.33, 0.34, 0.33],
    4: [0.3, 0.25, 0.25, 0.2],
    5: [0.25, 0.2, 0.2, 0.2, 0.15],
    6: [0.2, 0.17, 0.17, 0.17, 0.17, 0.12],
  };

  return distributions[weeklyTrainings] || distributions[3];
}

/**
 * Генерирует упражнения для сессии с учётом травм и оборудования
 */
function generateSessionExercises(
  templateExercises: string[],
  options: SmartGeneratorOptions,
  sessionIndex: number,
  totalSessions: number
): OrderedExercise[] {
  const { injuries, equipment, priorityMuscles, goal, experience, fatigueLevel } = options;

  // Фильтруем и заменяем упражнения по травмам
  const safeExercises = templateExercises.map(exerciseId => {
    if (isExerciseSafeForUser(exerciseId, injuries)) {
      return { id: exerciseId, isModified: false };
    }
    
    // Ищем безопасную альтернативу
    const alternatives = getSafeAlternatives(exerciseId, injuries);
    if (alternatives.length > 0) {
      // Проверяем, есть ли альтернатива среди доступного оборудования
      const safeAlt = alternatives.find(altId => {
        const meta = getExerciseMetadata(altId);
        return meta && meta.equipment.some(eq => equipment.includes(eq));
      });
      
      if (safeAlt) {
        return { id: safeAlt, isModified: true, originalId: exerciseId };
      }
    }
    
    return null;
  }).filter(Boolean) as { id: string; isModified: boolean; originalId?: string }[];

  // Применяем алгоритм сортировки
  const context: OrderingContext = {
    goal,
    experience,
    priorityMuscles,
    injuries,
    equipment,
    fatigueLevel,
  };

  const orderedExercises = sortExercises(
    safeExercises.map(e => e.id),
    context
  );

  // Добавляем информацию о модификациях
  return orderedExercises.map(ordered => {
    const original = safeExercises.find(e => e.id === ordered.exerciseId);
    return {
      ...ordered,
      isModified: original?.isModified || ordered.isModified || false,
      originalExerciseId: original?.originalId || ordered.originalExerciseId,
    };
  });
}

/**
 * Определяет интенсивность сессии на основе позиции в неделе
 */
function determineIntensity(sessionIndex: number, totalSessions: number, goal: TrainingGoal): TrainingIntensity {
  // Волновая периодизация: тяжёлый → средний → лёгкий
  const patterns: Record<number, TrainingIntensity[]> = {
    2: ['hard', 'medium'],
    3: ['hard', 'medium', 'easy'],
    4: ['hard', 'medium', 'hard', 'easy'],
    5: ['hard', 'medium', 'hard', 'medium', 'easy'],
    6: ['hard', 'medium', 'hard', 'medium', 'hard', 'easy'],
  };

  const pattern = patterns[totalSessions] || patterns[3];
  let intensity = pattern[sessionIndex % pattern.length];

  // Для сушки и поддержания снижаем интенсивность
  if (goal === 'cutting' && intensity === 'hard') {
    intensity = 'medium';
  }
  if (goal === 'maintenance') {
    intensity = intensity === 'hard' ? 'medium' : 'easy';
  }

  return intensity;
}

/**
 * Генерирует название сессии
 */
function generateSessionName(splitType: SplitType, sessionIndex: number, intensity: TrainingIntensity, totalSessions?: number): string {
  const intensityLabels: Partial<Record<TrainingIntensity, string>> = {
    hard: 'Тяжёлый',
    medium: 'Средний',
    easy: 'Лёгкий',
  };
  const label = intensityLabels[intensity] || 'Средний';

  if (splitType === 'full_body') {
    const emphasisLabels = ['Ноги', 'Спина', 'Грудь'];
    const emphasis = emphasisLabels[sessionIndex % 3];
    return `Full Body ${emphasis} (${label})`;
  }

  if (splitType === 'upper_lower') {
    const types = ['Верх', 'Низ', 'Верх', 'Низ'];
    return `${types[sessionIndex % 4]} (${label})`;
  }

  // PPL — сбалансированная ротация для 5 дней
  let pplTypes: string[];
  if (totalSessions === 5) {
    pplTypes = ['Push', 'Pull', 'Legs', 'Upper', 'Legs'];
  } else {
    pplTypes = ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'];
  }
  return `${pplTypes[sessionIndex % pplTypes.length]} (${label})`;
}

/**
 * Merges slot-based templates with goal-specific overrides
 */
function mergeSlotTemplates(base: SlotBasedTemplate, override?: PartialSlotTemplate): SlotBasedTemplate {
  if (!override) return base;
  
  return {
    primary: override.primary ?? base.primary,
    balance: override.balance ?? base.balance,
    secondary: override.secondary ?? base.secondary,
    isolation: override.isolation ?? base.isolation,
  };
}

/**
 * Converts a slot-based template to a flat exercise array (for backward compatibility)
 * Exercises are ordered: primary → balance → secondary → isolation
 */
function flattenSlotTemplate(template: SlotBasedTemplate): string[] {
  return [
    ...template.primary,
    ...template.balance,
    ...template.secondary,
    ...template.isolation,
  ];
}

/**
 * Gets the slot-based template for a session
 */
function getSlotBasedSessionTemplate(
  splitType: SplitType,
  sessionIndex: number,
  goal?: TrainingGoal,
  totalSessions?: number
): SlotBasedTemplate {
  // Determine which session key to use based on split type
  let sessionKey: string;
  
  if (splitType === 'full_body') {
    const fbRotation = ['emphasis_legs', 'emphasis_back', 'emphasis_chest'];
    sessionKey = fbRotation[sessionIndex % 3];
  } else if (splitType === 'upper_lower') {
    const isUpper = sessionIndex % 2 === 0;
    if (isUpper) {
      sessionKey = sessionIndex % 4 < 2 ? 'upper_push' : 'upper_pull';
    } else {
      sessionKey = 'lower';
    }
  } else {
    // PPL — сбалансированная ротация для 5 дней
    let pplOrder: string[];
    if (totalSessions === 5) {
      // Push, Pull, Legs, Upper(push), Legs — ноги 2x, верх 3x
      pplOrder = ['push', 'pull', 'legs', 'push', 'legs'];
    } else {
      pplOrder = ['push', 'pull', 'legs', 'push', 'pull', 'legs'];
    }
    sessionKey = pplOrder[sessionIndex % pplOrder.length];
  }
  
  // Get base template
  const baseTemplate = EXERCISE_TEMPLATES[splitType][sessionKey];
  
  // Get goal-specific override if available
  const goalOverride = goal 
    ? GOAL_EXERCISE_OVERRIDES[goal]?.[splitType]?.[sessionKey] 
    : undefined;
  
  // Merge templates
  return mergeSlotTemplates(baseTemplate, goalOverride);
}

/**
 * Выбирает шаблон упражнений для сессии с учётом цели
 * Returns a flat array of exercise IDs ordered by slot priority
 */
function getSessionTemplate(splitType: SplitType, sessionIndex: number, goal?: TrainingGoal, totalSessions?: number): string[] {
  const slotTemplate = getSlotBasedSessionTemplate(splitType, sessionIndex, goal, totalSessions);
  return flattenSlotTemplate(slotTemplate);
}

/**
 * Корректирует объём с учётом перераспределения и лимитов по категориям
 */
function adjustVolumeForFrequency(
  exercises: OrderedExercise[],
  weeklyTrainings: number,
  recommendedTrainings: number,
  goal: TrainingGoal,
  getCategory: (exerciseId: string) => ExerciseCategory
): OrderedExercise[] {
  // Если тренировок меньше рекомендованного — увеличиваем подходы
  if (weeklyTrainings < recommendedTrainings) {
    const volumeBoost = recommendedTrainings / weeklyTrainings;
    
    return exercises.map(ex => {
      const category = getCategory(ex.exerciseId);
      const limits = SET_LIMITS[category];
      const boostedSets = Math.round(ex.sets * volumeBoost);
      
      // CLAMP: respect category limits
      return {
        ...ex,
        sets: Math.min(limits.max, Math.max(limits.min, boostedSets)),
      };
    });
  }

  // Если тренировок больше рекомендованного — уменьшаем подходы на сессию
  if (weeklyTrainings > recommendedTrainings) {
    const volumeReduction = recommendedTrainings / weeklyTrainings;
    
    return exercises.map(ex => {
      const category = getCategory(ex.exerciseId);
      const limits = SET_LIMITS[category];
      const reducedSets = Math.round(ex.sets * volumeReduction);
      
      // CLAMP: не ниже минимума категории
      return {
        ...ex,
        sets: Math.min(limits.max, Math.max(limits.min, reducedSets)),
      };
    });
  }

  return exercises;
}

/**
 * Распределяет избыточный объём между другими упражнениями
 * Если упражнение достигло лимита, лишние подходы переносятся на другие
 */
function redistributeExcessVolume(
  exercises: OrderedExercise[],
  getCategory: (exerciseId: string) => ExerciseCategory
): OrderedExercise[] {
  let excessSets = 0;
  
  // Первый проход: найти избыток
  const clamped = exercises.map(ex => {
    const category = getCategory(ex.exerciseId);
    const limits = SET_LIMITS[category];
    
    if (ex.sets > limits.max) {
      excessSets += ex.sets - limits.max;
      return { ...ex, sets: limits.max };
    }
    return ex;
  });
  
  if (excessSets === 0) return clamped;
  
  // Второй проход: распределить избыток на упражнения с запасом
  const redistributed = clamped.map(ex => {
    if (excessSets <= 0) return ex;
    
    const category = getCategory(ex.exerciseId);
    const limits = SET_LIMITS[category];
    const headroom = limits.max - ex.sets;
    
    if (headroom > 0) {
      const toAdd = Math.min(headroom, excessSets);
      excessSets -= toAdd;
      return { ...ex, sets: ex.sets + toAdd };
    }
    return ex;
  });
  
  return redistributed;
}

// =============================================================================
// ENFORCE WORKOUT LIMITS — volume, CNS, and muscle balance safeguards
// =============================================================================

/**
 * Gets the primary muscle group string for an exercise (for coverage/limit checks)
 */
function getExerciseMuscleGroup(exerciseId: string): string {
  const exercise = getExerciseById(exerciseId);
  if (exercise) return exercise.muscleGroup;
  const normalized = getNormalizedExerciseById(exerciseId);
  if (normalized?.primaryMuscles?.[0]) return normalized.primaryMuscles[0];
  return 'other';
}

/**
 * Enforces session-level limits on exercises, sets, and heavy lifts.
 * Order: maxHeavy → MIN_MUSCLE_COVERAGE → PER_MUSCLE_LIMIT → maxExercises → maxSets
 */
function enforceWorkoutLimits(
  exercises: OrderedExercise[],
  splitType: SplitType,
  getCategoryFn: (exerciseId: string) => ExerciseCategory
): OrderedExercise[] {
  const limits = WORKOUT_LIMITS[splitType];
  let result = [...exercises];

  // --- Step 1: maxHeavy — unique heavy detection via Set ---
  const heavySet = new Set(result.filter(e => isHeavyExercise(e.exerciseId)).map(e => e.exerciseId));
  if (heavySet.size > limits.maxHeavy) {
    // Keep first N heavy, downgrade the rest
    let heavyKept = 0;
    result = result.map(ex => {
      if (!heavySet.has(ex.exerciseId)) return ex;
      heavyKept++;
      if (heavyKept <= limits.maxHeavy) return ex;
      // Downgrade: cap sets to 2
      return { ...ex, sets: Math.min(ex.sets, 2) };
    });
  }

  // --- Step 2: MIN_MUSCLE_COVERAGE — protect essential muscle groups ---
  const coverageRequired = MIN_MUSCLE_COVERAGE[splitType] || [];
  const protectedExerciseIds = new Set<string>();
  for (const muscleGroup of coverageRequired) {
    const exercisesForMuscle = result.filter(e => getExerciseMuscleGroup(e.exerciseId) === muscleGroup);
    if (exercisesForMuscle.length === 1) {
      protectedExerciseIds.add(exercisesForMuscle[0].exerciseId);
    }
  }

  // --- Step 3: PER_MUSCLE_LIMIT + LOWER_BODY_LIMIT ---
  const muscleCount: Record<string, number> = {};
  let lowerBodyCount = 0;
  const lowerBodyLimit = LOWER_BODY_LIMIT[splitType] || 5;
  
  // Removal priority: activation → isolation → secondary (never remove primary/protected)
  const removalPriority: ExerciseCategory[] = ['activation', 'isolation', 'semi_compound'];
  
  const toRemove = new Set<number>();
  
  // Count muscles
  for (let i = 0; i < result.length; i++) {
    const mg = getExerciseMuscleGroup(result[i].exerciseId);
    muscleCount[mg] = (muscleCount[mg] || 0) + 1;
    if (LOWER_BODY_GROUPS.includes(mg)) lowerBodyCount++;
  }
  
  // Remove excess by priority
  for (const priorityCat of removalPriority) {
    for (let i = result.length - 1; i >= 0; i--) {
      if (toRemove.has(i)) continue;
      if (protectedExerciseIds.has(result[i].exerciseId)) continue;
      
      const cat = getCategoryFn(result[i].exerciseId);
      if (cat !== priorityCat) continue;
      
      const mg = getExerciseMuscleGroup(result[i].exerciseId);
      const muscleLimit = PER_MUSCLE_LIMIT[mg] ?? 2;
      const isLowerBody = LOWER_BODY_GROUPS.includes(mg);
      
      if (muscleCount[mg] > muscleLimit || (isLowerBody && lowerBodyCount > lowerBodyLimit)) {
        toRemove.add(i);
        muscleCount[mg]--;
        if (isLowerBody) lowerBodyCount--;
      }
    }
  }
  
  result = result.filter((_, i) => !toRemove.has(i));

  // --- Step 4: maxExercises — trim to limit ---
  if (result.length > limits.maxExercises) {
    // Count types to preserve MIN_EXERCISE_TYPES
    const typeCounts = { primary: 0, secondary: 0, isolation: 0 };
    for (const ex of result) {
      const cat = getCategoryFn(ex.exerciseId);
      if (cat === 'compound') typeCounts.primary++;
      else if (cat === 'semi_compound') typeCounts.secondary++;
      else if (cat === 'isolation') typeCounts.isolation++;
    }
    
    // Remove from end, respecting priorities and coverage
    for (const priorityCat of (['activation', 'isolation', 'semi_compound'] as ExerciseCategory[])) {
      while (result.length > limits.maxExercises) {
        const idx = findLastRemovableIndex(result, priorityCat, protectedExerciseIds, getCategoryFn, typeCounts);
        if (idx === -1) break;
        
        const removedCat = getCategoryFn(result[idx].exerciseId);
        if (removedCat === 'compound') typeCounts.primary--;
        else if (removedCat === 'semi_compound') typeCounts.secondary--;
        else if (removedCat === 'isolation') typeCounts.isolation--;
        
        result.splice(idx, 1);
      }
    }
  }

  // --- Step 5: maxSets — gradual reduction ---
  let totalSets = result.reduce((sum, e) => sum + e.sets, 0);
  
  // Reduction priority: activation → isolation → secondary → compound(non-heavy) → heavy compound
  const setReductionOrder: Array<(ex: OrderedExercise) => boolean> = [
    (ex) => getCategoryFn(ex.exerciseId) === 'activation',
    (ex) => getCategoryFn(ex.exerciseId) === 'isolation',
    (ex) => getCategoryFn(ex.exerciseId) === 'semi_compound',
    (ex) => getCategoryFn(ex.exerciseId) === 'compound' && !isHeavyExercise(ex.exerciseId),
    (ex) => getCategoryFn(ex.exerciseId) === 'compound' && isHeavyExercise(ex.exerciseId),
  ];
  
  let safetyCounter = 0;
  while (totalSets > limits.maxSets && safetyCounter < 50) {
    safetyCounter++;
    let reduced = false;
    
    for (const matchFn of setReductionOrder) {
      if (totalSets <= limits.maxSets) break;
      
      // Find the exercise with most sets in this category
      let bestIdx = -1;
      let bestSets = 0;
      for (let i = 0; i < result.length; i++) {
        if (!matchFn(result[i])) continue;
        const cat = getCategoryFn(result[i].exerciseId);
        const minSets = MIN_SETS[cat] ?? DEFAULT_MIN_SETS;
        if (result[i].sets > minSets && result[i].sets > bestSets) {
          bestSets = result[i].sets;
          bestIdx = i;
        }
      }
      
      if (bestIdx >= 0) {
        result[bestIdx] = { ...result[bestIdx], sets: result[bestIdx].sets - 1 };
        totalSets--;
        reduced = true;
        break; // Re-evaluate from start of priority order
      }
    }
    
    if (!reduced) break; // Nothing left to reduce
  }

  return result;
}

/** Find last removable exercise index of a given category */
function findLastRemovableIndex(
  exercises: OrderedExercise[],
  category: ExerciseCategory,
  protectedIds: Set<string>,
  getCategoryFn: (id: string) => ExerciseCategory,
  typeCounts: { primary: number; secondary: number; isolation: number }
): number {
  for (let i = exercises.length - 1; i >= 0; i--) {
    if (protectedIds.has(exercises[i].exerciseId)) continue;
    const cat = getCategoryFn(exercises[i].exerciseId);
    if (cat !== category) continue;
    
    // Check if removing this would violate MIN_EXERCISE_TYPES
    if (cat === 'compound' && typeCounts.primary <= MIN_EXERCISE_TYPES.primary) continue;
    if (cat === 'semi_compound' && typeCounts.secondary <= MIN_EXERCISE_TYPES.secondary) continue;
    if (cat === 'isolation' && typeCounts.isolation <= MIN_EXERCISE_TYPES.isolation) continue;
    
    return i;
  }
  return -1;
}

/**
 * Основная функция генерации умного плана v3
 */
export function generateSmartPlan(options: SmartGeneratorOptions): SmartTrainingProgram {
  const { goal, experience, weeklyTrainings, priorityMuscles, fatigueLevel } = options;

  // 1. Определяем сплит
  const splitType = determineSplitType(experience, weeklyTrainings);

  // 2. Рассчитываем целевой объём через новый движок
  const volumeResult = calculateTargetVolume({
    goal,
    experience,
    fatigueLevel,
    priorityMuscles,
  });
  const targetVolume = volumeResult.volumes;

  // 3. Получаем модификатор цели
  const goalModifier = getGoalModifier(goal);

  // 4. Определяем рекомендуемое количество тренировок
  const recommendedTrainings = experience === 'beginner' ? 3 : experience === 'intermediate' ? 4 : 5;

  // 5. Генерируем сессии
  const sessions: GeneratedSession[] = [];
  const volumeDistributionArray = calculateVolumeDistribution(weeklyTrainings, targetVolume);
  
  let hardDayCount = 0;
  
  for (let i = 0; i < weeklyTrainings; i++) {
    // Применяем бюджет интенсивности — ограничиваем Hard-дни по уровню
    let intensity = determineIntensity(i, weeklyTrainings, goal);
    const { intensity: adjustedIntensity } = adjustIntensityForBudget(intensity, experience, hardDayCount);
    intensity = adjustedIntensity;
    if (intensity === 'hard') hardDayCount++;
    const name = generateSessionName(splitType, i, intensity, weeklyTrainings);
    const templateExercises = getSessionTemplate(splitType, i, goal, weeklyTrainings);
    
    // Генерируем упражнения (фильтрация по травмам/оборудованию)
    let orderedExercises = generateSessionExercises(templateExercises, options, i, weeklyTrainings);
    
    // Helper для получения категории
    const getCategoryForExercise = (exerciseId: string): ExerciseCategory => {
      const meta = getExerciseMetadata(exerciseId);
      return meta?.category || 'isolation';
    };
    
    // Корректируем объём при перераспределении с учётом лимитов
    orderedExercises = adjustVolumeForFrequency(orderedExercises, weeklyTrainings, recommendedTrainings, goal, getCategoryForExercise);
    
    // Применяем распределение объёма по дням с clamp
    const minMult = experience === 'beginner' ? 0.9 : 0.85;
    const volumeMultiplier = Math.min(1.1, Math.max(minMult, volumeDistributionArray[i] * weeklyTrainings));
    if (Math.abs(volumeMultiplier - 1.0) > 0.05) {
      orderedExercises = orderedExercises.map(ex => {
        const category = getCategoryForExercise(ex.exerciseId);
        const catLimits = SET_LIMITS[category];
        const scaledSets = Math.round(ex.sets * volumeMultiplier);
        return {
          ...ex,
          sets: Math.min(catLimits.max, Math.max(catLimits.min, scaledSets)),
        };
      });
    }
    
    // Перераспределяем избыточный объём между упражнениями
    orderedExercises = redistributeExcessVolume(orderedExercises, getCategoryForExercise);
    
    // Применяем лимиты объёма, CNS и мышечного баланса
    orderedExercises = enforceWorkoutLimits(orderedExercises, splitType, getCategoryForExercise);
    
    // =========================================================================
    // SLOT-BASED DAY ASSEMBLY (v4)
    // Exercises are assigned to slots: primary → balance → secondary → isolation
    // This ensures isolation exercises NEVER appear before compound movements
    // =========================================================================
    const slots = assignExercisesToSlots(orderedExercises, getCategoryForExercise);
    const slottedExercises = flattenSlotsToExercises(slots);

    // Формируем финальный список с полными параметрами (используем slottedExercises)
    const exercises: GeneratedExercise[] = slottedExercises.map(slotted => {
      const exercise = getExerciseById(slotted.exerciseId);
      const metadata = getExerciseMetadata(slotted.exerciseId);
      const category: ExerciseCategory = metadata?.category || 'isolation';
      
      // Получаем диапазон повторений через новый движок
      const repRangeData = getRepRange({
        goal,
        intensity,
        category,
        experience,
      });
      
      // Получаем параметры интенсивности
      const intensityParams = getIntensityParameters(intensity, category);
      const rirText = formatRIR(intensityParams);
      
      // Формируем строку %PM если нужно
      const percentPMText = `${intensityParams.percentPM.min}–${intensityParams.percentPM.max}%`;
      
      return {
        exerciseId: slotted.exerciseId,
        exerciseName: exercise?.name || slotted.exerciseId,
        sets: slotted.sets,
        reps: Math.round((repRangeData.min + repRangeData.max) / 2), // Среднее для совместимости
        repRange: repRangeData.formatted,
        rir: rirText,
        percentPM: percentPMText,
        isModified: slotted.isModified || false,
        originalExerciseId: slotted.originalExerciseId,
        notes: slotted.notes,
      };
    });

    sessions.push({ name, intensity, exercises });
  }

  // 6. Формируем описание распределения
  const volumeDesc = weeklyTrainings < recommendedTrainings
    ? `Объём перераспределён: ${recommendedTrainings} тренировки → ${weeklyTrainings} (увеличены подходы)`
    : `Стандартное распределение на ${weeklyTrainings} тренировок`;

  return {
    goal,
    experience,
    weeklyTrainings,
    splitType,
    sessions,
    volumeDistribution: volumeDesc,
    targetVolume,
  };
}

/**
 * Конвертирует диапазон повторений в число
 */
function parseRepsToNumber(reps: string): number {
  // "5–8" -> 6, "10–15" -> 12
  const match = reps.match(/(\d+)[–-](\d+)/);
  if (match) {
    return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
  }
  return parseInt(reps) || 10;
}

/**
 * Проверяет, нужна ли замена упражнения для пользователя
 */
export function checkExerciseReplacement(
  exerciseId: string,
  injuries: InjuryArea[],
  equipment: EquipmentType[]
): { needsReplacement: boolean; replacement?: string; reason?: string } {
  // Проверка травм
  if (!isExerciseSafeForUser(exerciseId, injuries)) {
    const alternatives = getSafeAlternatives(exerciseId, injuries);
    const safeAlt = alternatives.find(altId => {
      const meta = getExerciseMetadata(altId);
      return meta && meta.equipment.some(eq => equipment.includes(eq));
    });
    
    if (safeAlt) {
      return {
        needsReplacement: true,
        replacement: safeAlt,
        reason: 'Заменено из-за травмы',
      };
    }
    return { needsReplacement: true, reason: 'Нет безопасной альтернативы' };
  }

  // Проверка оборудования
  const meta = getExerciseMetadata(exerciseId);
  if (meta && !meta.equipment.some(eq => equipment.includes(eq))) {
    const exercise = getExerciseById(exerciseId);
    if (exercise?.alternatives) {
      const availableAlt = exercise.alternatives.find(altId => {
        const altMeta = getExerciseMetadata(altId);
        return altMeta && altMeta.equipment.some(eq => equipment.includes(eq));
      });
      
      if (availableAlt) {
        return {
          needsReplacement: true,
          replacement: availableAlt,
          reason: 'Заменено по оборудованию',
        };
      }
    }
    return { needsReplacement: true, reason: 'Оборудование недоступно' };
  }

  return { needsReplacement: false };
}
