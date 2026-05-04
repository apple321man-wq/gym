// Exercise metadata types for smart ordering algorithm

export type RiskLevel = 'low' | 'medium' | 'high';
export type NeurologicalDemand = 'low' | 'medium' | 'high';
export type ExerciseCategory = 'compound' | 'semi_compound' | 'isolation' | 'activation';
export type EquipmentType = 'barbell' | 'dumbbells' | 'machines' | 'cables' | 'bodyweight' | 'kettlebell' | 'bands';
export type InjuryArea = 'knee' | 'shoulder' | 'lower_back' | 'elbow' | 'wrist' | 'hip' | 'ankle' | 'neck';
export type FatigueLevel = 'low' | 'medium' | 'high';

// Movement pattern types for daily balance constraints
export type MovementPattern = 'press' | 'pull' | 'squat' | 'hinge' | 'carry' | 'rotation';

export interface ExerciseMetadata {
  exerciseId: string;
  riskLevel: RiskLevel;
  neurologicalDemand: NeurologicalDemand;
  category: ExerciseCategory;
  equipment: EquipmentType[];
  contraindications: InjuryArea[]; // Injuries that prevent this exercise
  safeAlternativeFor?: InjuryArea[]; // This is a safe alternative for these injuries
  movementPattern?: MovementPattern; // Primary movement pattern
}

// Numerical values for sorting
export const RISK_LEVEL_SCORE: Record<RiskLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const NEUROLOGICAL_DEMAND_SCORE: Record<NeurologicalDemand, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const CATEGORY_PRIORITY: Record<ExerciseCategory, number> = {
  compound: 4,
  semi_compound: 3,
  isolation: 2,
  activation: 1, // Activation can be first for priority muscles
};

// Equipment labels
export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: 'Штанга',
  dumbbells: 'Гантели',
  machines: 'Тренажёры',
  cables: 'Кроссовер/блоки',
  bodyweight: 'Своё тело',
  kettlebell: 'Гири',
  bands: 'Резинки',
};

// Injury labels
export const INJURY_LABELS: Record<InjuryArea, string> = {
  knee: 'Колено',
  shoulder: 'Плечо',
  lower_back: 'Поясница',
  elbow: 'Локоть',
  wrist: 'Запястье',
  hip: 'Бедро',
  ankle: 'Голеностоп',
  neck: 'Шея',
};

// Fatigue level labels
export const FATIGUE_LABELS: Record<FatigueLevel, string> = {
  low: 'Отличное',
  medium: 'Нормальное',
  high: 'Усталость',
};

// Movement pattern labels
export const MOVEMENT_PATTERN_LABELS: Record<MovementPattern, string> = {
  press: 'Жим',
  pull: 'Тяга',
  squat: 'Присед',
  hinge: 'Наклон',
  carry: 'Перенос',
  rotation: 'Вращение',
};

// Daily pattern limits
export const DAILY_PATTERN_LIMITS: Record<MovementPattern, number> = {
  press: 2,
  pull: 3, // Pulls are generally safer, higher limit
  squat: 2,
  hinge: 2,
  carry: 1,
  rotation: 2,
};

// Max heavy axial-load compounds per day
export const MAX_HEAVY_AXIAL_COMPOUNDS_PER_DAY = 1;
