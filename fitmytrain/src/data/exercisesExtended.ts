import type { MuscleGroup } from '@/types/training';
import type { EquipmentType, ExerciseCategory, MovementPattern, RiskLevel } from '@/types/exercise-metadata';
import type { ExerciseAlternative, ExerciseDescription } from '@/types/alternatives';

export type ExtendedExerciseType = 'compound' | 'isolation' | 'bodyweight' | 'activation';
export type ExtendedEquipment = 'barbell' | 'dumbbell' | 'machine' | 'bodyweight';
export type MovementGroup = 'knee_dominant' | 'hip_dominant' | 'horizontal_push' | 'vertical_push' | 'vertical_pull' | 'horizontal_pull' | 'elbow_flexion' | 'elbow_extension' | 'core';

export interface ExerciseExtended {
  id: string;
  name: string;
  muscles: {
    primary: MuscleGroup[];
    secondary: MuscleGroup[];
  };
  loadProfile: Partial<Record<MuscleGroup, number>>;
  type: ExtendedExerciseType;
  movementPattern: MovementPattern;
  movementGroup: MovementGroup;
  equipment: ExtendedEquipment[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  supports1RM: boolean;
  alternatives?: string[];
  allowsExternalWeight?: boolean;
  isBodyweightOnly?: boolean;
}

export const EXERCISES_EXTENDED: ExerciseExtended[] = [
  // ================= НОГИ =================

  {
    id: 'barbell-squat',
    name: 'Приседания со штангой',
    muscles: { primary: ['quadriceps', 'glutes'], secondary: ['hamstrings'] },
    loadProfile: { quadriceps: 0.5, glutes: 0.3, hamstrings: 0.2 },
    type: 'compound',
    movementPattern: 'squat',
    movementGroup: 'knee_dominant',
    equipment: ['barbell'],
    difficulty: 4,
    supports1RM: true,
    alternatives: ['smith-squat', 'leg-press', 'goblet-squat'],
  },

  {
    id: 'leg-press',
    name: 'Жим ногами',
    muscles: { primary: ['quadriceps'], secondary: ['glutes'] },
    loadProfile: { quadriceps: 0.6, glutes: 0.4 },
    type: 'compound',
    movementPattern: 'squat',
    movementGroup: 'knee_dominant',
    equipment: ['machine'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['barbell-squat', 'hack-squat'],
  },

  {
    id: 'romanian-deadlift',
    name: 'Румынская тяга',
    muscles: { primary: ['hamstrings'], secondary: ['glutes'] },
    loadProfile: { hamstrings: 0.6, glutes: 0.4 },
    type: 'compound',
    movementPattern: 'hinge',
    movementGroup: 'hip_dominant',
    equipment: ['barbell', 'dumbbell'],
    difficulty: 4,
    supports1RM: true,
    alternatives: ['hip-thrust', 'good-morning'],
  },

  {
    id: 'leg-curl',
    name: 'Сгибание ног',
    muscles: { primary: ['hamstrings'], secondary: [] },
    loadProfile: { hamstrings: 1 },
    type: 'isolation',
    movementPattern: 'hinge',
    movementGroup: 'hip_dominant',
    equipment: ['machine'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['romanian-deadlift'],
  },

  {
    id: 'leg-extension',
    name: 'Разгибание ног',
    muscles: { primary: ['quadriceps'], secondary: [] },
    loadProfile: { quadriceps: 1 },
    type: 'isolation',
    movementPattern: 'squat',
    movementGroup: 'knee_dominant',
    equipment: ['machine'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['leg-press'],
  },

  {
    id: 'hip-thrust',
    name: 'Ягодичный мост',
    muscles: { primary: ['glutes'], secondary: ['hamstrings'] },
    loadProfile: { glutes: 0.7, hamstrings: 0.3 },
    type: 'compound',
    movementPattern: 'hinge',
    movementGroup: 'hip_dominant',
    equipment: ['barbell'],
    difficulty: 3,
    supports1RM: true,
    alternatives: ['glute-bridge'],
  },

  // ================= ГРУДЬ =================

  {
    id: 'bench-press',
    name: 'Жим штанги лёжа',
    muscles: { primary: ['chest'], secondary: ['triceps', 'shoulders'] },
    loadProfile: { chest: 0.6, triceps: 0.2, shoulders: 0.2 },
    type: 'compound',
    movementPattern: 'press',
    movementGroup: 'horizontal_push',
    equipment: ['barbell'],
    difficulty: 4,
    supports1RM: true,
    alternatives: ['dumbbell-press', 'machine-press'],
  },

  {
    id: 'dumbbell-press',
    name: 'Жим гантелей',
    muscles: { primary: ['chest'], secondary: ['triceps'] },
    loadProfile: { chest: 0.7, triceps: 0.3 },
    type: 'compound',
    movementPattern: 'press',
    movementGroup: 'horizontal_push',
    equipment: ['dumbbell'],
    difficulty: 3,
    supports1RM: true,
    alternatives: ['bench-press'],
  },

  {
    id: 'chest-fly',
    name: 'Разведения',
    muscles: { primary: ['chest'], secondary: [] },
    loadProfile: { chest: 1 },
    type: 'isolation',
    movementPattern: 'press',
    movementGroup: 'horizontal_push',
    equipment: ['machine', 'dumbbell'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['cable-fly'],
  },

  // ================= СПИНА =================

  {
    id: 'pull-up',
    name: 'Подтягивания',
    muscles: { primary: ['back'], secondary: ['biceps'] },
    loadProfile: { back: 0.7, biceps: 0.3 },
    type: 'compound',
    movementPattern: 'pull',
    movementGroup: 'vertical_pull',
    equipment: ['bodyweight'],
    difficulty: 4,
    supports1RM: false,
    allowsExternalWeight: true,
    alternatives: ['lat-pulldown'],
  },

  {
    id: 'lat-pulldown',
    name: 'Тяга верхнего блока',
    muscles: { primary: ['back'], secondary: ['biceps'] },
    loadProfile: { back: 0.7, biceps: 0.3 },
    type: 'compound',
    movementPattern: 'pull',
    movementGroup: 'vertical_pull',
    equipment: ['machine'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['pull-up'],
  },

  {
    id: 'barbell-row',
    name: 'Тяга штанги',
    muscles: { primary: ['back'], secondary: ['biceps'] },
    loadProfile: { back: 0.7, biceps: 0.3 },
    type: 'compound',
    movementPattern: 'pull',
    movementGroup: 'horizontal_pull',
    equipment: ['barbell'],
    difficulty: 4,
    supports1RM: true,
    alternatives: ['dumbbell-row'],
  },

  {
    id: 'dumbbell-row',
    name: 'Тяга гантели',
    muscles: { primary: ['back'], secondary: ['biceps'] },
    loadProfile: { back: 0.7, biceps: 0.3 },
    type: 'compound',
    movementPattern: 'pull',
    movementGroup: 'horizontal_pull',
    equipment: ['dumbbell'],
    difficulty: 3,
    supports1RM: true,
    alternatives: ['barbell-row'],
  },

  // ================= ПЛЕЧИ =================

  {
    id: 'overhead-press',
    name: 'Жим стоя',
    muscles: { primary: ['shoulders'], secondary: ['triceps'] },
    loadProfile: { shoulders: 0.7, triceps: 0.3 },
    type: 'compound',
    movementPattern: 'press',
    movementGroup: 'vertical_push',
    equipment: ['barbell'],
    difficulty: 4,
    supports1RM: true,
    alternatives: ['dumbbell-shoulder-press'],
  },

  {
    id: 'lateral-raise',
    name: 'Махи в стороны',
    muscles: { primary: ['shoulders'], secondary: [] },
    loadProfile: { shoulders: 1 },
    type: 'isolation',
    movementPattern: 'press',
    movementGroup: 'vertical_push',
    equipment: ['dumbbell'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['cable-lateral'],
  },

  // ================= РУКИ =================

  {
    id: 'biceps-curl',
    name: 'Сгибание рук',
    muscles: { primary: ['biceps'], secondary: [] },
    loadProfile: { biceps: 1 },
    type: 'isolation',
    movementPattern: 'pull',
    movementGroup: 'elbow_flexion',
    equipment: ['dumbbell', 'barbell'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['hammer-curl'],
  },

  {
    id: 'triceps-pushdown',
    name: 'Разгибание на блоке',
    muscles: { primary: ['triceps'], secondary: [] },
    loadProfile: { triceps: 1 },
    type: 'isolation',
    movementPattern: 'press',
    movementGroup: 'elbow_extension',
    equipment: ['machine'],
    difficulty: 2,
    supports1RM: false,
    alternatives: ['dips'],
  },

  // ================= CORE =================

  {
    id: 'ab-wheel',
    name: 'Ролик',
    muscles: { primary: ['core'], secondary: [] },
    loadProfile: { core: 1 },
    type: 'bodyweight',
    movementPattern: 'rotation',
    movementGroup: 'core',
    equipment: ['bodyweight'],
    difficulty: 3,
    supports1RM: false,
    allowsExternalWeight: false,
  },

  {
    id: 'plank',
    name: 'Планка',
    muscles: { primary: ['core'], secondary: [] },
    loadProfile: { core: 1 },
    type: 'activation',
    movementPattern: 'carry',
    movementGroup: 'core',
    equipment: ['bodyweight'],
    difficulty: 2,
    supports1RM: false,
    isBodyweightOnly: true,
  },
];

const EXERCISE_ID_ALIASES: Record<string, string> = {
  squat: 'barbell-squat',
  'pull-ups': 'pull-up',
  'weighted-pull-ups': 'pull-up',
  'dumbbell-bench-press': 'dumbbell-press',
  'incline-bench-press': 'bench-press',
  'incline-dumbbell-press': 'dumbbell-press',
  'dumbbell-curl': 'biceps-curl',
  'barbell-curl': 'biceps-curl',
  'hammer-curl': 'biceps-curl',
  'tricep-pushdown': 'triceps-pushdown',
  'cable-row': 'barbell-row',
};

export interface NormalizedExercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  axialLoad: boolean;
  equipment: EquipmentType[];
  riskLevel: RiskLevel;
  movementPattern?: MovementPattern;
  movementGroup?: MovementGroup;
  loadProfile?: Partial<Record<MuscleGroup, number>>;
  isTimeBased?: boolean;
  isBodyweightOnly?: boolean;
  allowsExternalWeight?: boolean;
  alternativesWithTags?: ExerciseAlternative[];
  description?: ExerciseDescription;
}

export interface ExtendedExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: 'compound' | 'isolation';
  muscleLoads: { muscleGroup: MuscleGroup; loadType: 'primary' | 'secondary' | 'tertiary' }[];
  movementPattern?: MovementPattern;
  movementGroup?: MovementGroup;
  loadProfile?: Partial<Record<MuscleGroup, number>>;
  isTimeBased?: boolean;
  isBodyweightOnly?: boolean;
  allowsExternalWeight?: boolean;
  alternativesWithTags?: ExerciseAlternative[];
  description?: ExerciseDescription;
}

const EQUIPMENT_MAP: Record<ExtendedEquipment, EquipmentType> = {
  barbell: 'barbell',
  dumbbell: 'dumbbells',
  machine: 'machines',
  bodyweight: 'bodyweight',
};

function toCategory(type: ExtendedExerciseType): ExerciseCategory {
  if (type === 'activation') return 'activation';
  if (type === 'isolation' || type === 'bodyweight') return 'isolation';
  return 'compound';
}

function inferRiskLevel(exercise: ExerciseExtended): RiskLevel {
  if (exercise.difficulty >= 4) return 'high';
  if (exercise.difficulty === 3) return 'medium';
  return 'low';
}

function inferAxialLoad(exercise: ExerciseExtended): boolean {
  return [
    'barbell-squat',
    'romanian-deadlift',
    'barbell-row',
    'overhead-press',
  ].includes(exercise.id);
}

function resolveCoreExercise(id: string): ExerciseExtended | undefined {
  const resolvedId = EXERCISE_ID_ALIASES[id] ?? id;
  return EXERCISES_EXTENDED.find(exercise => exercise.id === resolvedId);
}

function normalizeLoadProfile(loadProfile: Partial<Record<MuscleGroup, number>>): Partial<Record<MuscleGroup, number>> {
  const total = Object.values(loadProfile).reduce((sum, value) => sum + (value ?? 0), 0);
  if (total <= 0) return loadProfile;

  return Object.fromEntries(
    Object.entries(loadProfile).map(([muscleGroup, value]) => [
      muscleGroup,
      Math.round(((value ?? 0) / total) * 100) / 100,
    ])
  ) as Partial<Record<MuscleGroup, number>>;
}

function getBidirectionalAlternatives(exercise: ExerciseExtended): string[] {
  const alternatives = new Set(exercise.alternatives ?? []);

  for (const candidate of EXERCISES_EXTENDED) {
    if (candidate.id === exercise.id) continue;
    if (candidate.alternatives?.includes(exercise.id)) {
      alternatives.add(candidate.id);
    }
  }

  return [...alternatives];
}

function convertToNormalized(exercise: ExerciseExtended, id = exercise.id): NormalizedExercise {
  const normalizedLoadProfile = normalizeLoadProfile(exercise.loadProfile);
  const alternatives = getBidirectionalAlternatives(exercise);

  return {
    id,
    name: exercise.name,
    category: toCategory(exercise.type),
    primaryMuscles: exercise.muscles.primary,
    secondaryMuscles: exercise.muscles.secondary,
    axialLoad: inferAxialLoad(exercise),
    equipment: exercise.equipment.map(item => EQUIPMENT_MAP[item]),
    riskLevel: inferRiskLevel(exercise),
    movementPattern: exercise.movementPattern,
    movementGroup: exercise.movementGroup,
    loadProfile: normalizedLoadProfile,
    isTimeBased: exercise.id === 'plank',
    isBodyweightOnly: exercise.isBodyweightOnly,
    allowsExternalWeight: exercise.allowsExternalWeight,
    alternativesWithTags: alternatives.map(exerciseId => ({ exerciseId, tag: 'equal' })),
  };
}

function convertToLegacy(normalized: NormalizedExercise): ExtendedExercise {
  return {
    id: normalized.id,
    name: normalized.name,
    muscleGroup: normalized.primaryMuscles[0] ?? 'core',
    type: normalized.category === 'compound' ? 'compound' : 'isolation',
    muscleLoads: [
      ...normalized.primaryMuscles.map(muscleGroup => ({ muscleGroup, loadType: 'primary' as const })),
      ...normalized.secondaryMuscles.map(muscleGroup => ({ muscleGroup, loadType: 'secondary' as const })),
    ],
    movementPattern: normalized.movementPattern,
    movementGroup: normalized.movementGroup,
    loadProfile: normalized.loadProfile,
    isTimeBased: normalized.isTimeBased,
    isBodyweightOnly: normalized.isBodyweightOnly,
    allowsExternalWeight: normalized.allowsExternalWeight,
    alternativesWithTags: normalized.alternativesWithTags,
    description: normalized.description,
  };
}

export const ALL_NORMALIZED_EXERCISES: NormalizedExercise[] = EXERCISES_EXTENDED.map(convertToNormalized);
export const ALL_EXTENDED_EXERCISES: ExtendedExercise[] = ALL_NORMALIZED_EXERCISES.map(convertToLegacy);

export function getExtendedCoreExerciseById(id: string): ExerciseExtended | undefined {
  const coreExercise = resolveCoreExercise(id);
  if (!coreExercise) return undefined;

  return {
    ...coreExercise,
    loadProfile: normalizeLoadProfile(coreExercise.loadProfile),
    alternatives: getBidirectionalAlternatives(coreExercise),
  };
}

export function getNormalizedExerciseById(id: string): NormalizedExercise | undefined {
  const coreExercise = resolveCoreExercise(id);
  return coreExercise ? convertToNormalized(coreExercise, id) : undefined;
}

export function getExtendedExerciseById(id: string): ExtendedExercise | undefined {
  const normalized = getNormalizedExerciseById(id);
  return normalized ? convertToLegacy(normalized) : undefined;
}

export function getNormalizedExercisesByMuscle(muscleGroup: MuscleGroup): NormalizedExercise[] {
  return ALL_NORMALIZED_EXERCISES.filter(exercise =>
    exercise.primaryMuscles.includes(muscleGroup) || exercise.secondaryMuscles.includes(muscleGroup)
  );
}

export function getExtendedExercisesByMuscle(muscleGroup: MuscleGroup): ExtendedExercise[] {
  return getNormalizedExercisesByMuscle(muscleGroup).map(convertToLegacy);
}

export function getExercisesByCategory(category: ExerciseCategory): NormalizedExercise[] {
  return ALL_NORMALIZED_EXERCISES.filter(exercise => exercise.category === category);
}

export function getExercisesWithoutAxialLoad(): NormalizedExercise[] {
  return ALL_NORMALIZED_EXERCISES.filter(exercise => !exercise.axialLoad);
}

export function getExercisesByEquipment(equipment: EquipmentType): NormalizedExercise[] {
  return ALL_NORMALIZED_EXERCISES.filter(exercise => exercise.equipment.includes(equipment));
}

export function getExercisesByRiskLevel(riskLevel: RiskLevel): NormalizedExercise[] {
  return ALL_NORMALIZED_EXERCISES.filter(exercise => exercise.riskLevel === riskLevel);
}
