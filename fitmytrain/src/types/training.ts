export type Gender = 'male' | 'female';

export type TrainingGoal = 
  | 'muscle_gain' 
  | 'recomposition' 
  | 'cutting' 
  | 'maintenance';

export type ExperienceLevel = 
  | 'beginner' 
  | 'intermediate' 
  | 'advanced';

export type TrainingIntensity = 
  | 'easy' 
  | 'medium' 
  | 'hard' 
  | 'rest';

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'lats'
  | 'upper_back'
  | 'lower_back'
  | 'traps'
  | 'lumbar'
  | 'lumbar_multifidus'
  | 'lumbar_stabilizers'
  | 'quadriceps'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'hip_abductors'
  | 'hip_flexors'
  | 'shoulders'
  | 'front_delt'
  | 'side_delt'
  | 'rear_delt'
  | 'rotator_cuff'
  | 'shoulder_stabilizers'
  | 'biceps'
  | 'brachialis'
  | 'brachioradialis'
  | 'triceps'
  | 'triceps_long'
  | 'forearms'
  | 'grip'
  | 'core'
  | 'abs_rectus'
  | 'rectus_abdominis'
  | 'lower_rectus_abdominis'
  | 'abs_obliques'
  | 'obliques';

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back', 'lats', 'upper_back', 'lower_back', 'traps', 'lumbar', 'lumbar_multifidus', 'lumbar_stabilizers',
  'quadriceps', 'quads', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_flexors',
  'shoulders', 'front_delt', 'side_delt', 'rear_delt', 'rotator_cuff', 'shoulder_stabilizers',
  'biceps', 'brachialis', 'brachioradialis', 'triceps', 'triceps_long', 'forearms', 'grip',
  'core', 'abs_rectus', 'rectus_abdominis', 'lower_rectus_abdominis', 'abs_obliques', 'obliques',
];

export const PRIORITY_MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'lats', 'upper_back', 'lower_back',
  'quadriceps', 'hamstrings', 'glutes', 'calves',
  'front_delt', 'side_delt', 'rear_delt',
  'biceps', 'triceps', 'forearms',
  'abs_rectus', 'abs_obliques', 'core',
];

export const MUSCLE_GROUP_PARENT: Record<MuscleGroup, MuscleGroup> = {
  chest: 'chest',
  back: 'back',
  lats: 'back',
  upper_back: 'back',
  lower_back: 'back',
  traps: 'back',
  lumbar: 'lower_back',
  lumbar_multifidus: 'lower_back',
  lumbar_stabilizers: 'lower_back',
  quadriceps: 'quadriceps',
  quads: 'quadriceps',
  hamstrings: 'hamstrings',
  glutes: 'glutes',
  calves: 'quadriceps',
  hip_abductors: 'glutes',
  hip_flexors: 'core',
  shoulders: 'shoulders',
  front_delt: 'shoulders',
  side_delt: 'shoulders',
  rear_delt: 'shoulders',
  rotator_cuff: 'shoulders',
  shoulder_stabilizers: 'shoulders',
  biceps: 'biceps',
  brachialis: 'biceps',
  brachioradialis: 'biceps',
  triceps: 'triceps',
  triceps_long: 'triceps',
  forearms: 'biceps',
  grip: 'biceps',
  core: 'core',
  abs_rectus: 'core',
  rectus_abdominis: 'core',
  lower_rectus_abdominis: 'core',
  abs_obliques: 'core',
  obliques: 'core',
};

export type ExerciseType = 'compound' | 'isolation';

export type LoadType = 'primary' | 'secondary' | 'tertiary';

export interface MuscleLoad {
  muscleGroup: MuscleGroup;
  loadType: LoadType;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface User {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  goal: TrainingGoal;
  experience: ExperienceLevel;
  weeklyTrainings: number;
  trainingDays?: WeekDay[]; // Selected days for training
  planGenerated?: boolean; // Whether initial plan was generated
  createdAt: string;
}

export interface PersonalMax {
  id: string;
  userId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  calculatedPM: number;
  updatedAt: string;
}

// Weight log entry for tracking progress on exercises without PM
export interface WeightLogEntry {
  id: string;
  userId: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: string;
  createdAt: string;
}

// Body measurements for progress tracking
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  weight: number;
  waist: number; // талия
  chest: number; // грудь
  hip: number; // бедро
  createdAt: string;
}

export type TrendDirection = 'up' | 'down' | 'stable' | 'insufficient';

export type ProgressStatus = 
  | 'fat_loss'          // Снижение жировой массы
  | 'recomposition'     // Рекомпозиция
  | 'mass_gain'         // Набор массы
  | 'low_quality_gain'  // Некачественный набор
  | 'insufficient_data'; // Недостаточно данных

export interface ProgressAnalysis {
  status: ProgressStatus;
  fatTrend: TrendDirection;
  muscleTrend: TrendDirection;
  fatChangeRange?: { min: number; max: number };
  muscleChangeRange?: { min: number; max: number };
  warnings: string[];
}

export type WeightProgressPeriod = '1m' | '3m' | '6m' | '1y' | '3y';

export const PERIOD_LABELS: Record<WeightProgressPeriod, string> = {
  '1m': '1 мес',
  '3m': '3 мес',
  '6m': '6 мес',
  '1y': '1 год',
  '3y': '3 года',
};

export interface ExerciseWeightProgress {
  exerciseId: string;
  exerciseName: string;
  firstWeight: number;
  lastWeight: number;
  change: number;
  percentChange: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  type: ExerciseType;
  imageUrl?: string;
  alternatives?: string[];
  muscleLoads: MuscleLoad[];
  isTimeBased?: boolean; // true for exercises measured in seconds (plank, wall sit, etc.)
  /** True when external weight is impossible (planks, dead bug, bird dog). Hide weight UI. */
  isBodyweightOnly?: boolean;
  /** True when external weight is optional (ab-wheel, crunch, hanging leg raise). Show field, no autofill. */
  allowsExternalWeight?: boolean;
}

export interface PlannedSet {
  id: string;
  setNumber: number;
  targetReps: number;
  targetWeight: number;
  completed: boolean;
  actualReps?: number;
  actualWeight?: number;
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  sets: PlannedSet[];
  completed: boolean;
}

export interface TrainingDay {
  id: string;
  userId: string;
  date: string;
  intensity: TrainingIntensity;
  exercises: PlannedExercise[];
  completed: boolean;
  feedback?: TrainingFeedback;
}

export interface TrainingFeedback {
  praise: string;
  analysis: string;
  volumeCompletion: number;
  daysCompletion: number;
}

// Weekly volume tracking
export type WeekStatus = 'under' | 'ok' | 'over';

export interface WeeklyVolumeRecord {
  muscleGroup: MuscleGroup;
  plannedSets: number;
  actualSets: number;
  deviation: number;
  status: WeekStatus;
}

// Monthly volume tracking
export type MonthStatus = 'under' | 'low' | 'optimal' | 'over' | 'risk';

export interface MonthlyVolumeRecord {
  muscleGroup: MuscleGroup;
  plannedMin: number;
  plannedMax: number;
  plannedMid: number;
  actualSets: number;
  percentOfPlan: number;
  status: MonthStatus;
}

export interface WeeklyVolume {
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  recommended: { min: number; max: number };
  percentage: number;
}

export interface MonthlyStats {
  month: string;
  totalDays: number;
  completedDays: number;
  skippedDays: number;
  averageIntensity: TrainingIntensity;
  volumeByMuscle: WeeklyVolume[];
}

// Load coefficients
export const LOAD_COEFFICIENTS: Record<LoadType, number> = {
  primary: 1.0,
  secondary: 0.5,
  tertiary: 0.3,
};

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: 'Грудь',
  back: 'Спина',
  lats: 'Широчайшие',
  upper_back: 'Верх спины',
  lower_back: 'Поясница',
  traps: 'Трапеции',
  lumbar: 'Поясничные',
  lumbar_multifidus: 'Многораздельные мышцы',
  lumbar_stabilizers: 'Стабилизаторы поясницы',
  quadriceps: 'Квадрицепс',
  quads: 'Квадрицепс',
  hamstrings: 'Бицепс бедра',
  glutes: 'Ягодицы',
  calves: 'Икры',
  hip_abductors: 'Отводящие бедра',
  hip_flexors: 'Сгибатели бедра',
  shoulders: 'Плечи',
  front_delt: 'Передняя дельта',
  side_delt: 'Средняя дельта',
  rear_delt: 'Задняя дельта',
  rotator_cuff: 'Ротаторная манжета',
  shoulder_stabilizers: 'Стабилизаторы плеча',
  biceps: 'Бицепс',
  brachialis: 'Брахиалис',
  brachioradialis: 'Плечелучевая',
  triceps: 'Трицепс',
  triceps_long: 'Длинная головка трицепса',
  forearms: 'Предплечья',
  grip: 'Хват',
  core: 'Кор',
  abs_rectus: 'Прямая мышца живота',
  rectus_abdominis: 'Прямая мышца живота',
  lower_rectus_abdominis: 'Нижний пресс',
  abs_obliques: 'Косые мышцы живота',
  obliques: 'Косые мышцы живота',
};

export const GOAL_LABELS: Record<TrainingGoal, string> = {
  muscle_gain: 'Набор мышечной массы',
  recomposition: 'Рекомпозиция',
  cutting: 'Рельеф / сушка',
  maintenance: 'Поддержание формы',
};

export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  beginner: 'Новичок (0–1 год)',
  intermediate: 'Средний (1–3 года)',
  advanced: 'Продвинутый (3+ лет)',
};

export const INTENSITY_LABELS: Record<TrainingIntensity, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
  rest: 'Выходной',
};

export const INTENSITY_PERCENT: Record<Exclude<TrainingIntensity, 'rest'>, { min: number; max: number }> = {
  easy: { min: 65, max: 70 },
  medium: { min: 70, max: 80 },
  hard: { min: 80, max: 85 },
};

// Weekly recommended volume per muscle group
export const RECOMMENDED_VOLUME_WEEKLY: Record<MuscleGroup, { min: number; max: number }> = {
  chest: { min: 12, max: 18 },
  back: { min: 14, max: 20 },
  lats: { min: 8, max: 14 },
  upper_back: { min: 8, max: 14 },
  lower_back: { min: 4, max: 10 },
  traps: { min: 4, max: 10 },
  lumbar: { min: 3, max: 8 },
  lumbar_multifidus: { min: 2, max: 6 },
  lumbar_stabilizers: { min: 2, max: 6 },
  quadriceps: { min: 12, max: 18 },
  quads: { min: 12, max: 18 },
  hamstrings: { min: 10, max: 16 },
  glutes: { min: 10, max: 16 },
  calves: { min: 6, max: 14 },
  hip_abductors: { min: 4, max: 10 },
  hip_flexors: { min: 3, max: 8 },
  shoulders: { min: 12, max: 18 },
  front_delt: { min: 6, max: 12 },
  side_delt: { min: 8, max: 16 },
  rear_delt: { min: 8, max: 16 },
  rotator_cuff: { min: 3, max: 8 },
  shoulder_stabilizers: { min: 3, max: 8 },
  biceps: { min: 8, max: 14 },
  brachialis: { min: 4, max: 10 },
  brachioradialis: { min: 4, max: 10 },
  triceps: { min: 8, max: 14 },
  triceps_long: { min: 4, max: 10 },
  forearms: { min: 4, max: 12 },
  grip: { min: 3, max: 8 },
  core: { min: 6, max: 12 },
  abs_rectus: { min: 6, max: 12 },
  rectus_abdominis: { min: 6, max: 12 },
  lower_rectus_abdominis: { min: 4, max: 10 },
  abs_obliques: { min: 4, max: 10 },
  obliques: { min: 4, max: 10 },
};

// Monthly recommended volume per muscle group (4 weeks)
export const RECOMMENDED_VOLUME_MONTHLY: Record<MuscleGroup, { min: number; max: number }> = Object.fromEntries(
  Object.entries(RECOMMENDED_VOLUME_WEEKLY).map(([muscle, volume]) => [
    muscle,
    { min: volume.min * 4, max: volume.max * 4 },
  ])
) as Record<MuscleGroup, { min: number; max: number }>;

// For backward compatibility
export const RECOMMENDED_VOLUME = RECOMMENDED_VOLUME_WEEKLY;
