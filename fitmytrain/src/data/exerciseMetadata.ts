import { ExerciseMetadata, RiskLevel, NeurologicalDemand, ExerciseCategory, EquipmentType, InjuryArea, MovementPattern } from '@/types/exercise-metadata';
import { EXERCISES } from './exercises';

// =============================================================================
// MOVEMENT PATTERN MAPPINGS
// =============================================================================

// Press pattern exercises (horizontal and vertical push)
const PRESS_PATTERN_EXERCISES = [
  'bench-press', 'incline-bench-press', 'decline-bench-press',
  'dumbbell-bench-press', 'incline-dumbbell-press', 'dumbbell-fly', 'cable-fly',
  'chest-press-machine', 'hammer-chest-press', 'pec-deck', 'cable-crossover', 'push-ups', 'dips', 'assisted-dips',
  'overhead-press', 'dumbbell-shoulder-press', 'push-press', 'shoulder-press-machine',
  'dumbbell-overhead-press', 'seated-dumbbell-press', 'machine-shoulder-press', 'arnold-press',
  'smith-bench-press', 'close-grip-bench', 'tricep-pushdown', 'skull-crusher',
  'dumbbell-tricep-extension', 'cable-overhead-extension', 'tricep-dips',
];

// Pull pattern exercises (horizontal and vertical pull)
const PULL_PATTERN_EXERCISES = [
  'barbell-row', 'dumbbell-row', 't-bar-row', 'cable-row', 'pendlay-row',
  'lat-pulldown', 'pull-ups', 'chin-ups', 'weighted-pull-ups', 'assisted-pullup',
  'face-pull', 'rear-delt-fly', 'reverse-pec-deck', 'band-pull-apart',
  'straight-arm-pulldown', 'cable-pullover', 'barbell-curl', 'dumbbell-curl',
  'hammer-curl', 'cable-curl', 'preacher-curl', 'concentration-curl',
  'ez-bar-curl', 'incline-curl', 'spider-curl',
];

// Squat pattern exercises (knee-dominant)
const SQUAT_PATTERN_EXERCISES = [
  'squat', 'barbell-squat', 'front-squat', 'goblet-squat',
  'hack-squat', 'leg-press', 'smith-squat', 'belt-squat',
  'bulgarian-split-squat', 'lunge', 'dumbbell-lunge', 'walking-lunge',
  'sissy-squat', 'leg-extension', 'step-up', 'bodyweight-squat',
];

// Hinge pattern exercises (hip-dominant)
const HINGE_PATTERN_EXERCISES = [
  'deadlift', 'romanian-deadlift', 'sumo-deadlift', 'trap-bar-deadlift',
  'stiff-leg-deadlift', 'dumbbell-rdl', 'good-morning', 'back-extension',
  'hip-thrust', 'glute-bridge', 'hip-thrust-bodyweight', 'cable-pull-through',
  'kettlebell-swing', 'leg-curl', 'seated-leg-curl', 'nordic-curl',
  'glute-kickback-machine', 'reverse-hyper',
];

/** Infer movement pattern from exercise id */
function inferMovementPattern(exerciseId: string): MovementPattern | undefined {
  if (PRESS_PATTERN_EXERCISES.includes(exerciseId)) return 'press';
  if (PULL_PATTERN_EXERCISES.includes(exerciseId)) return 'pull';
  if (SQUAT_PATTERN_EXERCISES.includes(exerciseId)) return 'squat';
  if (HINGE_PATTERN_EXERCISES.includes(exerciseId)) return 'hinge';
  return undefined; // Some exercises don't fit a pattern (e.g., lateral raises, core)
}

// Auto-generate metadata based on exercise type and muscle group
function inferMetadata(exercise: { id: string; type: 'compound' | 'isolation'; muscleGroup: string }): ExerciseMetadata {
  const isCompound = exercise.type === 'compound';
  
  // Base risk and demand inference
  let riskLevel: RiskLevel = 'low';
  let neurologicalDemand: NeurologicalDemand = 'low';
  let category: ExerciseCategory = isCompound ? 'compound' : 'isolation';
  let equipment: EquipmentType[] = ['bodyweight'];
  let contraindications: InjuryArea[] = [];
  const movementPattern = inferMovementPattern(exercise.id);

  // High-risk compound movements
  const highRiskExercises = [
    'barbell-squat', 'front-squat', 'deadlift', 'romanian-deadlift', 
    'sumo-deadlift', 'barbell-row', 'bench-press', 'incline-bench-press',
    'overhead-press', 'push-press', 'weighted-pull-ups'
  ];

  // Medium-risk movements
  const mediumRiskExercises = [
    'dumbbell-bench-press', 'incline-dumbbell-press', 'dumbbell-shoulder-press',
    'bulgarian-split-squat', 'hack-squat', 'leg-press', 'lat-pulldown',
    'cable-row', 't-bar-row', 'dumbbell-row'
  ];

  // Barbell exercises
  const barbellExercises = [
    'barbell-squat', 'front-squat', 'deadlift', 'romanian-deadlift', 
    'sumo-deadlift', 'barbell-row', 'bench-press', 'incline-bench-press',
    'overhead-press', 'push-press', 'barbell-curl', 'skull-crusher'
  ];

  // Dumbbell exercises
  const dumbbellExercises = [
    'dumbbell-bench-press', 'incline-dumbbell-press', 'dumbbell-shoulder-press',
    'lateral-raise', 'front-raise', 'rear-delt-fly', 'dumbbell-fly',
    'dumbbell-curl', 'hammer-curl', 'dumbbell-row', 'concentration-curl',
    'dumbbell-tricep-extension', 'goblet-squat', 'dumbbell-lunge', 'dumbbell-rdl'
  ];

  // Machine exercises
  const machineExercises = [
    'leg-press', 'hack-squat', 'leg-extension', 'leg-curl', 'seated-leg-curl',
    'hip-abduction', 'hip-adduction', 'chest-press-machine', 'pec-deck',
    'lat-pulldown', 'cable-row', 'shoulder-press-machine', 'smith-squat',
    'smith-bench-press', 'cable-curl', 'tricep-pushdown', 'cable-lateral-raise',
    'reverse-pec-deck', 'glute-kickback-machine', 'calf-raise-machine',
    'standing-calf-raise', 'seated-calf-raise',
    'assisted-pullup', 'assisted-dips',
  ];

  // Cable exercises
  const cableExercises = [
    'cable-crossover', 'cable-row', 'lat-pulldown', 'face-pull',
    'cable-curl', 'tricep-pushdown', 'cable-lateral-raise', 'cable-fly',
    'cable-crunch', 'cable-pull-through', 'cable-kickback'
  ];

  // Bodyweight exercises
  const bodyweightExercises = [
    'pull-ups', 'chin-ups', 'dips', 'push-ups', 'plank', 'dead-bug',
    'bird-dog', 'side-plank', 'leg-raise', 'mountain-climber', 'burpee',
    'bodyweight-squat', 'lunge', 'glute-bridge', 'hip-thrust-bodyweight'
  ];

  // Knee injury contraindications
  const kneeContraindicated = [
    'barbell-squat', 'front-squat', 'leg-extension', 'leg-press',
    'hack-squat', 'lunge', 'bulgarian-split-squat', 'jump-squat',
    'sissy-squat'
  ];

  // Shoulder injury contraindications  
  const shoulderContraindicated = [
    'overhead-press', 'push-press', 'behind-neck-press', 'dips',
    'upright-row', 'lateral-raise', 'bench-press', 'incline-bench-press'
  ];

  // Lower back injury contraindications
  const lowerBackContraindicated = [
    'deadlift', 'romanian-deadlift', 'sumo-deadlift', 'barbell-row',
    'good-morning', 'back-extension', 'barbell-squat', 'front-squat'
  ];

  // Elbow contraindications
  const elbowContraindicated = [
    'skull-crusher', 'close-grip-bench', 'tricep-dips', 'preacher-curl',
    'concentration-curl'
  ];

  // Set risk level
  if (highRiskExercises.includes(exercise.id)) {
    riskLevel = 'high';
    neurologicalDemand = 'high';
  } else if (mediumRiskExercises.includes(exercise.id)) {
    riskLevel = 'medium';
    neurologicalDemand = 'medium';
  }

  // Set equipment
  if (barbellExercises.includes(exercise.id)) {
    equipment = ['barbell'];
  } else if (dumbbellExercises.includes(exercise.id)) {
    equipment = ['dumbbells'];
  } else if (machineExercises.includes(exercise.id)) {
    equipment = ['machines'];
  } else if (cableExercises.includes(exercise.id)) {
    equipment = ['cables'];
  } else if (bodyweightExercises.includes(exercise.id)) {
    equipment = ['bodyweight'];
  }

  // Set contraindications
  if (kneeContraindicated.includes(exercise.id)) {
    contraindications.push('knee');
  }
  if (shoulderContraindicated.includes(exercise.id)) {
    contraindications.push('shoulder');
  }
  if (lowerBackContraindicated.includes(exercise.id)) {
    contraindications.push('lower_back');
  }
  if (elbowContraindicated.includes(exercise.id)) {
    contraindications.push('elbow');
  }

  // Determine semi_compound vs compound
  const semiCompoundExercises = [
    'leg-press', 'hack-squat', 'lat-pulldown', 'cable-row',
    'chest-press-machine', 'shoulder-press-machine', 'smith-squat'
  ];
  if (semiCompoundExercises.includes(exercise.id)) {
    category = 'semi_compound';
  }

  // Activation exercises
  const activationExercises = [
    'glute-bridge', 'hip-thrust-bodyweight', 'band-walk', 'clamshell',
    'dead-bug', 'bird-dog', 'face-pull', 'band-pull-apart',
    'external-rotation', 'internal-rotation'
  ];
  if (activationExercises.includes(exercise.id)) {
    category = 'activation';
    riskLevel = 'low';
    neurologicalDemand = 'low';
  }

  return {
    exerciseId: exercise.id,
    riskLevel,
    neurologicalDemand,
    category,
    equipment,
    contraindications,
    movementPattern,
  };
}

// Generate metadata for all exercises
export const EXERCISE_METADATA: Map<string, ExerciseMetadata> = new Map(
  EXERCISES.map(ex => [ex.id, inferMetadata(ex)])
);

// Manual overrides for specific exercises
const MANUAL_OVERRIDES: Partial<Record<string, Partial<ExerciseMetadata>>> = {
  'deadlift': {
    riskLevel: 'high',
    neurologicalDemand: 'high',
    contraindications: ['lower_back', 'knee', 'hip'],
  },
  'barbell-squat': {
    riskLevel: 'high',
    neurologicalDemand: 'high',
    contraindications: ['knee', 'lower_back', 'hip', 'ankle'],
  },
  'bench-press': {
    riskLevel: 'high',
    neurologicalDemand: 'high',
    contraindications: ['shoulder', 'elbow', 'wrist'],
  },
  'overhead-press': {
    riskLevel: 'high',
    neurologicalDemand: 'high',
    contraindications: ['shoulder', 'lower_back', 'neck'],
  },
  // Safe alternatives
  'leg-press': {
    safeAlternativeFor: ['lower_back'],
  },
  'leg-extension': {
    safeAlternativeFor: ['lower_back', 'hip'],
  },
  'chest-press-machine': {
    safeAlternativeFor: ['shoulder'],
  },
  'lat-pulldown': {
    safeAlternativeFor: ['lower_back'],
  },
};

// Apply manual overrides
Object.entries(MANUAL_OVERRIDES).forEach(([id, override]) => {
  const existing = EXERCISE_METADATA.get(id);
  if (existing) {
    EXERCISE_METADATA.set(id, { ...existing, ...override });
  }
});

// Helper functions
export function getExerciseMetadata(exerciseId: string): ExerciseMetadata | undefined {
  return EXERCISE_METADATA.get(exerciseId);
}

export function isExerciseSafeForUser(exerciseId: string, userInjuries: InjuryArea[]): boolean {
  const metadata = EXERCISE_METADATA.get(exerciseId);
  if (!metadata) return true; // Unknown exercise, allow it
  
  return !metadata.contraindications.some(injury => userInjuries.includes(injury));
}

export function getExercisesByEquipment(availableEquipment: EquipmentType[]): string[] {
  const result: string[] = [];
  EXERCISE_METADATA.forEach((metadata, id) => {
    if (metadata.equipment.some(eq => availableEquipment.includes(eq))) {
      result.push(id);
    }
  });
  return result;
}

export function getSafeAlternatives(exerciseId: string, userInjuries: InjuryArea[]): string[] {
  const exercise = EXERCISES.find(e => e.id === exerciseId);
  if (!exercise?.alternatives) return [];
  
  return exercise.alternatives.filter(altId => isExerciseSafeForUser(altId, userInjuries));
}

export function getExerciseMovementPattern(exerciseId: string): MovementPattern | undefined {
  const metadata = EXERCISE_METADATA.get(exerciseId);
  return metadata?.movementPattern;
}

export function isHeavyAxialCompound(exerciseId: string): boolean {
  const metadata = EXERCISE_METADATA.get(exerciseId);
  if (!metadata) return false;
  
  const isCompound = metadata.category === 'compound';
  const isHighRisk = metadata.riskLevel === 'high';
  
  // Check axial load from normalized exercise data
  // For now, use the contraindications as a proxy - lower_back issues indicate axial load
  const hasAxialContra = metadata.contraindications.includes('lower_back');
  
  return isCompound && isHighRisk && hasAxialContra;
}
