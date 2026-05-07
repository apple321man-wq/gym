/**
 * Training Parameters Engine v3
 * 
 * Централизованный движок для расчёта всех параметров тренировки:
 * 1. Объём = f(база, уровень, восстановление, фактическая интенсивность)
 * 2. Интенсивность → reps, RIR, %PM
 * 3. Goal-based модификаторы шаблонов
 * 4. Повторения = f(цель, интенсивность, тип упражнения)
 * 5. %PM — опциональный слой поверх RIR
 */

import { TrainingGoal, ExperienceLevel, TrainingIntensity, MuscleGroup, MUSCLE_GROUPS, MUSCLE_GROUP_PARENT } from '@/types/training';
import { FatigueLevel, ExerciseCategory } from '@/types/exercise-metadata';

// ============================================================================
// 1. VOLUME MODIFIERS
// ============================================================================

/** Базовый объём по целям (подходов в неделю) */
const BASE_WEEKLY_VOLUME: Record<TrainingGoal, Partial<Record<MuscleGroup, number>>> = {
  muscle_gain: {
    chest: 16, back: 16, quadriceps: 14, hamstrings: 10, glutes: 8,
    shoulders: 12, biceps: 10, triceps: 10, core: 6,
  },
  recomposition: {
    chest: 14, back: 14, quadriceps: 12, hamstrings: 10, glutes: 8,
    shoulders: 10, biceps: 8, triceps: 8, core: 8,
  },
  cutting: {
    chest: 12, back: 12, quadriceps: 10, hamstrings: 8, glutes: 6,
    shoulders: 8, biceps: 6, triceps: 6, core: 8,
  },
  maintenance: {
    chest: 10, back: 10, quadriceps: 8, hamstrings: 6, glutes: 6,
    shoulders: 6, biceps: 6, triceps: 6, core: 6,
  },
};

/** 
 * VOLUME CLAMPS: минимальный и максимальный объём по уровню
 * Защита от MEV/MRV нарушений
 */
const VOLUME_LIMITS: Record<ExperienceLevel, Partial<Record<MuscleGroup, { min: number; max: number }>>> = {
  beginner: {
    chest: { min: 6, max: 12 },
    back: { min: 6, max: 14 },
    quadriceps: { min: 6, max: 12 },
    hamstrings: { min: 4, max: 10 },
    glutes: { min: 4, max: 10 },
    shoulders: { min: 4, max: 10 },
    biceps: { min: 4, max: 10 },
    triceps: { min: 4, max: 10 },
    core: { min: 4, max: 8 },
  },
  intermediate: {
    chest: { min: 8, max: 16 },
    back: { min: 10, max: 18 },
    quadriceps: { min: 8, max: 16 },
    hamstrings: { min: 6, max: 12 },
    glutes: { min: 6, max: 12 },
    shoulders: { min: 6, max: 14 },
    biceps: { min: 6, max: 14 },
    triceps: { min: 6, max: 14 },
    core: { min: 4, max: 10 },
  },
  advanced: {
    chest: { min: 10, max: 20 },
    back: { min: 12, max: 22 },
    quadriceps: { min: 10, max: 18 },
    hamstrings: { min: 8, max: 14 },
    glutes: { min: 8, max: 14 },
    shoulders: { min: 8, max: 16 },
    biceps: { min: 8, max: 16 },
    triceps: { min: 8, max: 16 },
    core: { min: 6, max: 12 },
  },
};

/**
 * Weekly Intensity Budget: максимум Hard-дней в неделю
 * Защита ЦНС от накопления интенсивности
 */
const MAX_HARD_DAYS_PER_WEEK: Record<ExperienceLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

/** Модификатор по уровню спортсмена */
const LEVEL_VOLUME_MODIFIER: Record<ExperienceLevel, number> = {
  beginner: 0.75,     // Новичкам меньше объёма для адаптации
  intermediate: 1.0,  // Базовый уровень
  advanced: 1.1,      // Продвинутым чуть больше для прогресса
};

/** Модификатор по восстановлению/усталости */
const RECOVERY_VOLUME_MODIFIER: Record<FatigueLevel, number> = {
  low: 1.0,           // Отличное восстановление — полный объём
  medium: 0.9,        // Нормальное — небольшое снижение
  high: 0.85,         // Усталость — значительное снижение
};

export interface VolumeCalculationParams {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  fatigueLevel: FatigueLevel;
  priorityMuscles?: MuscleGroup[];
  priorityWeeks?: number;  // Сколько недель уже длится приоритет
  avgRIR?: number;         // Средний RIR за последнюю неделю
}

/** Результат расчёта с полным трейсом для дебага */
export interface VolumeCalculationResult {
  volumes: Record<MuscleGroup, number>;
  trace: VolumeTrace;
}

export interface VolumeTrace {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  fatigueLevel: FatigueLevel;
  modifiers: {
    levelMod: number;
    recoveryMod: number;
    rirAdjustment: number;
  };
  perMuscle: Record<MuscleGroup, {
    base: number;
    priorityBonus: number;
    calculated: number;
    clamped: number;
    limits: { min: number; max: number };
  }>;
}

/**
 * Рассчитывает итоговый объём для каждой мышечной группы
 * targetVolume = clamp(baseVolume × levelMod × recoveryMod × rirMod × priorityBonus, MIN, MAX)
 */
export function calculateTargetVolume(params: VolumeCalculationParams): VolumeCalculationResult {
  const { 
    goal, 
    experience, 
    fatigueLevel, 
    priorityMuscles = [],
    priorityWeeks = 0,
    avgRIR,
  } = params;
  
  const baseVolume = BASE_WEEKLY_VOLUME[goal];
  const levelMod = LEVEL_VOLUME_MODIFIER[experience];
  const recoveryMod = RECOVERY_VOLUME_MODIFIER[fatigueLevel];
  const limits = VOLUME_LIMITS[experience];
  
  // RIR-Volume coupling: ближе к отказу → меньше объём
  let rirAdjustment = 1.0;
  if (avgRIR !== undefined) {
    if (avgRIR <= 1) rirAdjustment = 0.9;      // Близко к отказу — снижаем
    else if (avgRIR >= 3) rirAdjustment = 1.05; // Далеко от отказа — можем добавить
  }
  
  const volumes: Record<MuscleGroup, number> = {} as Record<MuscleGroup, number>;
  const perMuscle: VolumeTrace['perMuscle'] = {} as VolumeTrace['perMuscle'];
  
  for (const muscleGroup of MUSCLE_GROUPS) {
    const base = baseVolume[muscleGroup] ?? baseVolume[MUSCLE_GROUP_PARENT[muscleGroup]] ?? 6;
    const muscleLimit = limits[muscleGroup]
      ?? limits[MUSCLE_GROUP_PARENT[muscleGroup]]
      ?? { min: 4, max: 12 };
    
    // Приоритет: +15%, но затухает после 6 недель
    let priorityBonus = 1.0;
    if (priorityMuscles.includes(muscleGroup)) {
      if (priorityWeeks <= 6) {
        priorityBonus = 1.15;
      } else {
        // Плавное затухание: 15% → 10% → 5% → 0%
        const decay = Math.max(0, 1.15 - (priorityWeeks - 6) * 0.05);
        priorityBonus = Math.max(1.0, decay);
      }
    }
    
    const calculated = base * levelMod * recoveryMod * rirAdjustment * priorityBonus;
    
    // CLAMP: защита от выхода за MEV/MRV
    const clamped = Math.round(
      Math.min(muscleLimit.max, Math.max(muscleLimit.min, calculated))
    );
    
    volumes[muscleGroup] = clamped;
    perMuscle[muscleGroup] = {
      base,
      priorityBonus,
      calculated: Math.round(calculated * 10) / 10,
      clamped,
      limits: muscleLimit,
    };
  }
  
  return {
    volumes,
    trace: {
      goal,
      experience,
      fatigueLevel,
      modifiers: { levelMod, recoveryMod, rirAdjustment },
      perMuscle,
    },
  };
}

/**
 * Проверяет бюджет интенсивности на неделю
 * Возвращает true если можно добавить ещё Hard-день
 */
export function canAddHardDay(
  experience: ExperienceLevel,
  currentHardDays: number
): boolean {
  return currentHardDays < MAX_HARD_DAYS_PER_WEEK[experience];
}

/**
 * Корректирует интенсивность если превышен недельный лимит
 */
export function adjustIntensityForBudget(
  requestedIntensity: TrainingIntensity,
  experience: ExperienceLevel,
  currentHardDays: number
): { intensity: TrainingIntensity; wasDowngraded: boolean } {
  if (requestedIntensity === 'hard' && !canAddHardDay(experience, currentHardDays)) {
    return { intensity: 'medium', wasDowngraded: true };
  }
  return { intensity: requestedIntensity, wasDowngraded: false };
}

/**
 * Возвращает максимум Hard-дней для уровня
 */
export function getMaxHardDays(experience: ExperienceLevel): number {
  return MAX_HARD_DAYS_PER_WEEK[experience];
}

// ============================================================================
// 2. INTENSITY → TRAINING PARAMETERS
// ============================================================================

export interface IntensityParameters {
  repRange: { min: number; max: number };
  rir: { min: number; max: number };  // Reps In Reserve
  percentPM: { min: number; max: number };  // Если есть PM
}

/** Полная матрица: интенсивность × категория упражнения */
const INTENSITY_MATRIX: Record<TrainingIntensity, Record<ExerciseCategory, IntensityParameters>> = {
  hard: {
    compound: { repRange: { min: 4, max: 6 }, rir: { min: 0, max: 1 }, percentPM: { min: 80, max: 87 } },
    semi_compound: { repRange: { min: 5, max: 8 }, rir: { min: 1, max: 2 }, percentPM: { min: 75, max: 82 } },
    isolation: { repRange: { min: 8, max: 12 }, rir: { min: 1, max: 2 }, percentPM: { min: 70, max: 78 } },
    activation: { repRange: { min: 12, max: 15 }, rir: { min: 2, max: 3 }, percentPM: { min: 50, max: 60 } },
  },
  medium: {
    compound: { repRange: { min: 6, max: 10 }, rir: { min: 1, max: 2 }, percentPM: { min: 70, max: 80 } },
    semi_compound: { repRange: { min: 8, max: 12 }, rir: { min: 2, max: 3 }, percentPM: { min: 65, max: 75 } },
    isolation: { repRange: { min: 10, max: 15 }, rir: { min: 2, max: 3 }, percentPM: { min: 60, max: 70 } },
    activation: { repRange: { min: 12, max: 15 }, rir: { min: 3, max: 4 }, percentPM: { min: 45, max: 55 } },
  },
  easy: {
    compound: { repRange: { min: 10, max: 15 }, rir: { min: 2, max: 3 }, percentPM: { min: 60, max: 70 } },
    semi_compound: { repRange: { min: 12, max: 15 }, rir: { min: 3, max: 4 }, percentPM: { min: 55, max: 65 } },
    isolation: { repRange: { min: 12, max: 20 }, rir: { min: 3, max: 4 }, percentPM: { min: 50, max: 60 } },
    activation: { repRange: { min: 15, max: 20 }, rir: { min: 4, max: 5 }, percentPM: { min: 40, max: 50 } },
  },
  rest: {
    compound: { repRange: { min: 0, max: 0 }, rir: { min: 0, max: 0 }, percentPM: { min: 0, max: 0 } },
    semi_compound: { repRange: { min: 0, max: 0 }, rir: { min: 0, max: 0 }, percentPM: { min: 0, max: 0 } },
    isolation: { repRange: { min: 0, max: 0 }, rir: { min: 0, max: 0 }, percentPM: { min: 0, max: 0 } },
    activation: { repRange: { min: 0, max: 0 }, rir: { min: 0, max: 0 }, percentPM: { min: 0, max: 0 } },
  },
};

/**
 * Получает параметры тренировки на основе интенсивности и категории
 */
export function getIntensityParameters(
  intensity: TrainingIntensity,
  category: ExerciseCategory
): IntensityParameters {
  return INTENSITY_MATRIX[intensity][category];
}

/**
 * Форматирует диапазон повторений в строку
 */
export function formatRepRange(params: IntensityParameters): string {
  const { min, max } = params.repRange;
  return min === max ? `${min}` : `${min}–${max}`;
}

/**
 * Форматирует RIR в понятную строку
 */
export function formatRIR(params: IntensityParameters): string {
  const { min, max } = params.rir;
  if (min === 0 && max <= 1) return 'До отказа';
  if (min === max) return `RIR ${min}`;
  return `RIR ${min}–${max}`;
}

// ============================================================================
// 3. GOAL-BASED EXERCISE MODIFIERS
// ============================================================================

export interface GoalModifier {
  compoundAdjust: number;      // +1 = добавить compound, -1 = убрать
  isolationAdjust: number;     // +1 = добавить isolation, -1 = убрать
  machinePreference: number;   // 0-1, насколько предпочитать тренажёры
  freeWeightPreference: number; // 0-1, насколько предпочитать свободные веса
  axialLoadLimit: number;      // 0-1, лимит осевой нагрузки
  exerciseRotation: boolean;   // Ротировать упражнения каждую неделю
  preExhaustAllowed: boolean;  // Разрешена предварительная усталость
}

const GOAL_MODIFIERS: Record<TrainingGoal, GoalModifier> = {
  muscle_gain: {
    compoundAdjust: 1,
    isolationAdjust: -0.5,
    machinePreference: 0.3,
    freeWeightPreference: 0.8,
    axialLoadLimit: 1.0,
    exerciseRotation: false,
    preExhaustAllowed: true,
  },
  recomposition: {
    compoundAdjust: 0,
    isolationAdjust: 0.5,
    machinePreference: 0.5,
    freeWeightPreference: 0.5,
    axialLoadLimit: 0.9,
    exerciseRotation: false,
    preExhaustAllowed: true,
  },
  cutting: {
    compoundAdjust: -0.5,
    isolationAdjust: 1,
    machinePreference: 0.7,
    freeWeightPreference: 0.4,
    axialLoadLimit: 0.7, // Меньше осевой нагрузки при дефиците
    exerciseRotation: true,
    preExhaustAllowed: false,
  },
  maintenance: {
    compoundAdjust: 0,
    isolationAdjust: 0,
    machinePreference: 0.5,
    freeWeightPreference: 0.5,
    axialLoadLimit: 0.8,
    exerciseRotation: true, // Вариативность для интереса
    preExhaustAllowed: false,
  },
};

export function getGoalModifier(goal: TrainingGoal): GoalModifier {
  return GOAL_MODIFIERS[goal];
}

/**
 * Применяет модификатор цели к списку ID упражнений
 * Возвращает скорректированный список с рекомендациями
 */
export interface ModifiedExercise {
  exerciseId: string;
  action: 'keep' | 'remove' | 'replace' | 'add';
  reason?: string;
  replacementId?: string;
}

export function applyGoalModifierToExercises(
  exerciseIds: string[],
  goal: TrainingGoal,
  getCategory: (id: string) => ExerciseCategory | undefined,
  getEquipment: (id: string) => string[]
): ModifiedExercise[] {
  const modifier = GOAL_MODIFIERS[goal];
  const result: ModifiedExercise[] = [];
  
  let compoundCount = 0;
  let isolationCount = 0;
  
  for (const id of exerciseIds) {
    const category = getCategory(id);
    const equipment = getEquipment(id);
    
    let action: ModifiedExercise['action'] = 'keep';
    let reason: string | undefined;
    
    // Подсчитываем и применяем лимиты
    if (category === 'compound') {
      compoundCount++;
      if (modifier.compoundAdjust < 0 && compoundCount > 2) {
        action = 'remove';
        reason = 'Лимит compound для цели';
      }
    }
    
    if (category === 'isolation') {
      isolationCount++;
      if (modifier.isolationAdjust < 0 && isolationCount > 2) {
        action = 'remove';
        reason = 'Лимит isolation для цели';
      }
    }
    
    // Проверяем осевую нагрузку для сушки
    if (goal === 'cutting') {
      const isAxialLoad = id.includes('deadlift') || id.includes('squat') || id.includes('overhead');
      if (isAxialLoad && Math.random() > modifier.axialLoadLimit) {
        // В 30% случаев заменяем на менее нагружающее
        action = 'replace';
        reason = 'Снижение осевой нагрузки при сушке';
      }
    }
    
    // Предпочтение тренажёров/свободных весов
    const isMachine = equipment.includes('machines');
    const isFreeWeight = equipment.includes('barbell') || equipment.includes('dumbbells');
    
    if (goal === 'cutting' && isFreeWeight && !isMachine) {
      // Для сушки предпочитаем тренажёры (но не заменяем автоматически)
      reason = 'Рассмотри замену на тренажёр';
    }
    
    result.push({ exerciseId: id, action, reason });
  }
  
  return result;
}

// ============================================================================
// 4. REP RANGE CALCULATOR
// ============================================================================

export interface RepRangeParams {
  goal: TrainingGoal;
  intensity: TrainingIntensity;
  category: ExerciseCategory;
  experience: ExperienceLevel;
}

/**
 * Главная функция: определяет диапазон повторений
 * repRange = f(goal, intensity, exerciseType, experience)
 */
export function getRepRange(params: RepRangeParams): { min: number; max: number; formatted: string } {
  const { goal, intensity, category, experience } = params;
  
  // Базовые параметры из матрицы интенсивности
  const baseParams = getIntensityParameters(intensity, category);
  let { min, max } = baseParams.repRange;
  
  // Модификация по цели
  if (goal === 'muscle_gain') {
    // Масса: чуть меньше повторов, больше веса
    if (category === 'compound') {
      min = Math.max(4, min - 1);
      max = Math.min(8, max);
    }
  } else if (goal === 'cutting') {
    // Сушка: больше повторов для метаболического стресса
    min = Math.min(min + 2, 12);
    max = Math.min(max + 3, 20);
  } else if (goal === 'maintenance') {
    // Поддержание: средние значения
    // Без изменений
  }
  
  // Модификация по опыту
  if (experience === 'beginner') {
    // Новичкам: больше повторов для техники
    min = Math.max(6, min);
    max = Math.min(15, max + 2);
  } else if (experience === 'advanced') {
    // Продвинутым: можно меньше повторов
    if (category === 'compound') {
      min = Math.max(3, min - 1);
    }
  }
  
  return {
    min,
    max,
    formatted: min === max ? `${min}` : `${min}–${max}`,
  };
}

// ============================================================================
// 5. OPTIONAL %PM LAYER WITH RIR BASE
// ============================================================================

export interface WeightRecommendation {
  method: 'rir' | 'percent_pm';
  rir?: { min: number; max: number };
  percentPM?: number;
  displayText: string;
  hint: string;
}

/**
 * Рассчитывает рекомендацию по весу
 * Приоритет: RIR как основа, %PM как подсказка (если доступен)
 */
export function getWeightRecommendation(
  intensity: TrainingIntensity,
  category: ExerciseCategory,
  hasPersonalMax: boolean,
  personalMax?: number
): WeightRecommendation {
  const params = getIntensityParameters(intensity, category);
  
  // RIR всегда доступен как основной метод
  const rirText = formatRIR(params);
  
  if (hasPersonalMax && personalMax && personalMax > 0) {
    // Есть PM — показываем оба метода
    const avgPercent = (params.percentPM.min + params.percentPM.max) / 2;
    const calculatedWeight = Math.round((personalMax * avgPercent / 100) / 2.5) * 2.5;
    
    return {
      method: 'percent_pm',
      rir: params.rir,
      percentPM: avgPercent,
      displayText: `~${calculatedWeight} кг`,
      hint: `${rirText} или ${params.percentPM.min}–${params.percentPM.max}% от PM`,
    };
  }
  
  // Нет PM — только RIR
  return {
    method: 'rir',
    rir: params.rir,
    displayText: rirText,
    hint: 'Ориентируйся на ощущения: сколько повторов в запасе',
  };
}

// ============================================================================
// COMBINED SESSION GENERATOR
// ============================================================================

export interface SessionExerciseParams {
  exerciseId: string;
  category: ExerciseCategory;
  sets: number;
  repRange: { min: number; max: number; formatted: string };
  rir: { min: number; max: number };
  percentPM?: { min: number; max: number };
  weightRecommendation: WeightRecommendation;
}

export interface GenerateSessionParams {
  goal: TrainingGoal;
  experience: ExperienceLevel;
  intensity: TrainingIntensity;
  fatigueLevel: FatigueLevel;
  priorityMuscles: MuscleGroup[];
  exerciseIds: string[];
  getCategory: (id: string) => ExerciseCategory;
  getPersonalMax?: (exerciseId: string) => number | undefined;
}

/**
 * Генерирует полные параметры для всех упражнений сессии
 */
export function generateSessionExerciseParams(params: GenerateSessionParams): SessionExerciseParams[] {
  const {
    goal,
    experience,
    intensity,
    fatigueLevel,
    priorityMuscles,
    exerciseIds,
    getCategory,
    getPersonalMax,
  } = params;
  
  // Рассчитываем целевой объём (для информации)
  const targetVolume = calculateTargetVolume({ goal, experience, fatigueLevel, priorityMuscles });
  
  return exerciseIds.map((exerciseId, index) => {
    const category = getCategory(exerciseId);
    
    // Диапазон повторов
    const repRange = getRepRange({ goal, intensity, category, experience });
    
    // Параметры интенсивности
    const intensityParams = getIntensityParameters(intensity, category);
    
    // Рекомендация по весу
    const personalMax = getPersonalMax?.(exerciseId);
    const weightRecommendation = getWeightRecommendation(
      intensity,
      category,
      personalMax !== undefined && personalMax > 0,
      personalMax
    );
    
    // Количество подходов
    let sets = category === 'compound' ? 4 : 3;
    if (goal === 'cutting' || goal === 'maintenance') sets--;
    if (fatigueLevel === 'high') sets = Math.max(2, sets - 1);
    if (index >= 4) sets = Math.max(2, sets - 1); // Позднее в сессии — меньше сетов
    if (category === 'activation') sets = 2;
    
    return {
      exerciseId,
      category,
      sets,
      repRange,
      rir: intensityParams.rir,
      percentPM: intensityParams.percentPM,
      weightRecommendation,
    };
  });
}

// ============================================================================
// EXPORTS FOR TESTING/DEBUGGING
// ============================================================================

export const _internal = {
  BASE_WEEKLY_VOLUME,
  LEVEL_VOLUME_MODIFIER,
  RECOVERY_VOLUME_MODIFIER,
  INTENSITY_MATRIX,
  GOAL_MODIFIERS,
  VOLUME_LIMITS,
  MAX_HARD_DAYS_PER_WEEK,
};

// ============================================================================
// DEBUG HELPER: полный трейс сессии
// ============================================================================

export interface SessionDebugTrace {
  params: GenerateSessionParams;
  volumeTrace: VolumeTrace;
  intensityBudget: {
    maxHardDays: number;
    currentHardDays: number;
    wasDowngraded: boolean;
  };
  exercises: Array<{
    exerciseId: string;
    category: ExerciseCategory;
    repRange: string;
    rir: string;
    sets: number;
    weightMethod: 'rir' | 'percent_pm';
  }>;
}

/**
 * Генерирует полный дебаг-трейс для диагностики
 */
export function generateSessionDebugTrace(
  params: GenerateSessionParams,
  currentHardDays: number = 0
): SessionDebugTrace {
  const volumeResult = calculateTargetVolume({
    goal: params.goal,
    experience: params.experience,
    fatigueLevel: params.fatigueLevel,
    priorityMuscles: params.priorityMuscles,
  });

  const { wasDowngraded } = adjustIntensityForBudget(
    params.intensity,
    params.experience,
    currentHardDays
  );

  const exercises = generateSessionExerciseParams(params);

  return {
    params,
    volumeTrace: volumeResult.trace,
    intensityBudget: {
      maxHardDays: getMaxHardDays(params.experience),
      currentHardDays,
      wasDowngraded,
    },
    exercises: exercises.map(ex => ({
      exerciseId: ex.exerciseId,
      category: ex.category,
      repRange: ex.repRange.formatted,
      rir: formatRIR({ repRange: ex.repRange, rir: ex.rir, percentPM: ex.percentPM || { min: 0, max: 0 } }),
      sets: ex.sets,
      weightMethod: ex.weightRecommendation.method,
    })),
  };
}
