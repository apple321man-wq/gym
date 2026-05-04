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
  | 'quadriceps' 
  | 'hamstrings' 
  | 'glutes'
  | 'shoulders' 
  | 'biceps'
  | 'triceps'
  | 'core';

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
  quadriceps: 'Квадрицепс',
  hamstrings: 'Задняя поверхность',
  glutes: 'Ягодицы',
  shoulders: 'Плечи',
  biceps: 'Бицепс',
  triceps: 'Трицепс',
  core: 'Кор',
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
  quadriceps: { min: 12, max: 18 },
  hamstrings: { min: 10, max: 16 },
  glutes: { min: 10, max: 16 },
  shoulders: { min: 12, max: 18 },
  biceps: { min: 8, max: 14 },
  triceps: { min: 8, max: 14 },
  core: { min: 6, max: 12 },
};

// Monthly recommended volume per muscle group (4 weeks)
export const RECOMMENDED_VOLUME_MONTHLY: Record<MuscleGroup, { min: number; max: number }> = {
  chest: { min: 48, max: 72 },
  back: { min: 56, max: 80 },
  quadriceps: { min: 48, max: 72 },
  hamstrings: { min: 40, max: 64 },
  glutes: { min: 40, max: 64 },
  shoulders: { min: 48, max: 72 },
  biceps: { min: 32, max: 56 },
  triceps: { min: 32, max: 56 },
  core: { min: 24, max: 48 },
};

// For backward compatibility
export const RECOMMENDED_VOLUME = RECOMMENDED_VOLUME_WEEKLY;
