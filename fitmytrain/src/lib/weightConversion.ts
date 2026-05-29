import { getUnifiedExerciseForId, type UnifiedExercise } from '@/data/exercisesUnified';
import { getExtendedCoreExerciseById, type ExerciseExtended } from '@/data/exercisesExtended';
import type { MuscleGroup } from '@/types/training';

/**
 * Weight conversion coefficients between exercise variations
 * 
 * Based on fitness industry standards:
 * - Dumbbell exercises typically use ~75-85% of barbell weight (per dumbbell)
 * - Machine exercises can vary based on lever arm and cable routing
 * - Incline variations typically use 75-85% of flat variations
 */

// Base exercises that have Personal Maxes (ПМ)
export const BASE_PM_EXERCISES = [
  'bench-press',
  'squat',
  'romanian-deadlift',
  'weighted-pull-ups',
] as const;

export type BasePMExercise = typeof BASE_PM_EXERCISES[number];

export type ExerciseWeightLoadUnit = 'total' | 'per_limb' | 'added_bodyweight' | 'assistance' | 'bodyweight';

interface WeightCoefficient {
  baseExercise: BasePMExercise;
  coefficient: number;
  note?: string;
  isBodyweight?: boolean;
  isAssisted?: boolean;
  loadUnit?: ExerciseWeightLoadUnit;
}

const WEIGHT_COEFFICIENT_ALIASES: Record<string, string> = {
  'barbell-squat': 'squat',
  'quads-barbell-squat': 'squat',
  'quads-front-squat': 'front-squat',
  'quads-goblet-squat': 'goblet-squat',
  'quads-leg-press': 'leg-press',
  'quads-hack-squat': 'hack-squat',
  'quads-smith-squat': 'smith-squat',
  'quads-bulgarian-split-squat': 'bulgarian-split-squat',
  'quads-lunges': 'lunges',
  'quads-reverse-lunges': 'reverse-lunges',
  'quads-leg-extension': 'leg-extension',

  'hamstrings-romanian-deadlift': 'romanian-deadlift',
  'hamstrings-sldl': 'stiff-leg-deadlift',
  'hamstrings-good-morning': 'good-morning',
  'hamstrings-leg-curl': 'leg-curl',
  'hamstrings-leg-curl-lying': 'lying-leg-curl',
  'hamstrings-leg-curl-seated': 'seated-leg-curl',
  'hamstrings-leg-curl-standing': 'standing-leg-curl',
  'hamstrings-cable-leg-curl': 'cable-leg-curl',
  'hamstrings-nordic-curl': 'nordic-curl',
  'hamstrings-sliding-leg-curl': 'sliding-leg-curl',
  'hamstrings-hyperextension': 'hyperextension',
  'hamstrings-cable-pull-through': 'cable-pull-through',

  'glutes-barbell-hip-thrust': 'hip-thrust',
  'glutes-bridge': 'glute-bridge',
  'glutes-leg-press': 'leg-press',
  'glutes-bulgarian-split-squat': 'bulgarian-split-squat',
  'glutes-lunges': 'lunges',
  'glutes-reverse-lunges': 'reverse-lunges',
  'glutes-cable-kickback': 'cable-kickback',
  'glutes-band-kickback': 'band-kickback',

  'calves-standing-raise': 'standing-calf-raise',
  'calves-seated-raise': 'seated-calf-raise',
  'calves-leg-press-raise': 'leg-press-calf-raise',
  'calves-smith-raise': 'smith-calf-raise',
  'calves-dumbbell-raise': 'dumbbell-calf-raise',
  'calves-single-leg-raise': 'single-leg-calf-raise',

  'chest-barbell-flat': 'bench-press',
  'chest-dumbbell-flat': 'dumbbell-bench-press',
  'chest-incline-barbell': 'incline-bench-press',
  'chest-incline-dumbbell': 'incline-dumbbell-press',
  'chest-machine-seated-press': 'machine-chest-press',
  'chest-dips': 'dips',
  'chest-dips-assisted': 'assisted-dips',
  'chest-cable-crossover': 'cable-crossover',
  'chest-dumbbell-fly': 'dumbbell-fly',

  'lats-pull-ups-medium': 'pull-ups',
  'lats-pull-ups-weighted': 'weighted-pull-ups',
  'lats-pull-ups-assisted': 'assisted-pullup',
  'lats-cable-row': 'cable-row',
  'lats-dumbbell-row': 'dumbbell-row',
  'lats-t-bar-row': 't-bar-row',
  'upperback-bent-over-row': 'barbell-row',
  'upperback-dumbbell-row': 'dumbbell-row',
  'upperback-seated-cable-row': 'cable-row',
  'upperback-t-bar-row': 't-bar-row',
  'upperback-machine-row': 'machine-row',
  'upperback-face-pull': 'face-pull',

  'frontdelt-military-press': 'overhead-press',
  'frontdelt-seated-dumbbell-press': 'dumbbell-shoulder-press',
  'frontdelt-standing-dumbbell-press': 'dumbbell-overhead-press',
  'frontdelt-machine-shoulder-press': 'machine-shoulder-press',
  'frontdelt-arnold-press': 'arnold-press',
  'sidedelt-lateral-raises': 'lateral-raise',
  'sidedelt-leaning-dumbbell-raise': 'lateral-raise',
  'sidedelt-cable-lateral-raise': 'cable-lateral-raise',
  'sidedelt-machine-lateral-raise': 'machine-lateral-raise',
  'reardelt-rear-fly-dumbbell': 'rear-delt-fly',
  'reardelt-rear-fly-machine': 'reverse-pec-deck',

  'biceps-dumbbell-curl': 'dumbbell-curl',
  'biceps-barbell-curl': 'barbell-curl',
  'biceps-hammer-curl': 'hammer-curl',
  'biceps-preacher-curl': 'preacher-curl',
  'biceps-cable-curl': 'cable-curl',
  'biceps-machine-curl': 'machine-curl',

  'triceps-pushdown': 'tricep-pushdown',
  'triceps-skullcrusher': 'skull-crusher',
  'triceps-overhead-extension': 'overhead-tricep-extension',
  'triceps-close-grip-bench-press': 'close-grip-bench',

  'abs-plank': 'plank',
  'abs-ab-wheel': 'ab-wheel',
  'abs-hanging-leg-raises': 'hanging-leg-raise',
  'abs-leg-raises': 'lying-leg-raise',
  'abs-cable-crunch': 'cable-crunch',
  'core-pallof-press': 'pallof-press',
};

function resolveCoefficientId(exerciseId: string): string {
  return WEIGHT_COEFFICIENT_ALIASES[exerciseId] ?? exerciseId;
}

/**
 * Weight conversion coefficients relative to base exercise
 * 
 * Example: dumbbell-bench-press has coefficient 0.40
 * If barbell bench PM = 100kg, dumbbell bench target = 100 * 0.40 = 40kg per dumbbell
 * 
 * These are based on common gym standards and biomechanical analysis:
 * - Dumbbells require more stabilization = lower total weight
 * - Incline positions reduce mechanical advantage
 * - Machines can vary but typically allow higher relative loads due to stability
 */
export const EXERCISE_WEIGHT_COEFFICIENTS: Record<string, WeightCoefficient> = {
  // === CHEST (base: bench-press) ===
  'bench-press': {
    baseExercise: 'bench-press',
    coefficient: 1.0,
    note: 'Base exercise',
  },
  'incline-bench-press': {
    baseExercise: 'bench-press',
    coefficient: 0.85,
    note: 'Incline reduces leverage ~15%',
  },
  'hammer-chest-press': {
    baseExercise: 'bench-press',
    coefficient: 1.0,
    note: 'Hammer Strength — убирает стабилизацию, вес ≈ штанге',
  },
  'decline-bench-press': {
    baseExercise: 'bench-press',
    coefficient: 1.05,
    note: 'Decline slightly increases leverage',
  },
  'dumbbell-bench-press': {
    baseExercise: 'bench-press',
    coefficient: 0.40,
    note: 'Per dumbbell weight, stability demand reduces total',
  },
  'dumbbell-press': {
    baseExercise: 'bench-press',
    coefficient: 0.40,
    note: 'Extended DB alias - Per dumbbell weight',
  },
  'incline-dumbbell-press': {
    baseExercise: 'bench-press',
    coefficient: 0.35,
    note: 'Incline + dumbbell stability',
  },
  'close-grip-bench': {
    baseExercise: 'bench-press',
    coefficient: 0.85,
    note: 'Narrower grip reduces leverage',
  },
  'smith-bench-press': {
    baseExercise: 'bench-press',
    coefficient: 1.05,
    note: 'Smith убирает стабилизацию — вес обычно на 5% выше штанги',
  },
  'chest-press-machine': {
    baseExercise: 'bench-press',
    coefficient: 1.10,
    note: 'Машина убирает стабилизаторы — вес на 10% выше штанги',
  },
  'machine-chest-press': {
    baseExercise: 'bench-press',
    coefficient: 1.10,
    note: 'Extended DB alias - Machine chest press, 10% выше штанги',
  },
  
  // === LEGS - Squat pattern (base: squat) ===
  'squat': {
    baseExercise: 'squat',
    coefficient: 1.0,
    note: 'Base exercise (barbell back squat)',
  },
  'barbell-squat': {
    baseExercise: 'squat',
    coefficient: 1.0,
    note: 'Alias for squat',
  },
  'front-squat': {
    baseExercise: 'squat',
    coefficient: 0.80,
    note: 'Anterior load position ~80% of back squat',
  },
  'goblet-squat': {
    baseExercise: 'squat',
    coefficient: 0.40,
    note: 'Limited by dumbbell holding capacity',
  },
  'hack-squat': {
    baseExercise: 'squat',
    coefficient: 1.10,
    note: 'Machine support allows higher loads',
  },
  'leg-press': {
    baseExercise: 'squat',
    coefficient: 2.0,
    note: 'Seated position ~200% of squat (varies by machine angle)',
  },
  'smith-squat': {
    baseExercise: 'squat',
    coefficient: 1.05,
    note: 'Smith убирает стабилизацию — вес обычно на 5% выше',
  },
  'belt-squat': {
    baseExercise: 'squat',
    coefficient: 1.0,
    note: 'Машина без осевой нагрузки — вес ≈ приседу',
  },
  'bulgarian-split-squat': {
    baseExercise: 'squat',
    coefficient: 0.40,
    note: 'Per hand / per side ориентир: односторонний вариант, баланс снижает рабочий вес',
  },
  'lunges': {
    baseExercise: 'squat',
    coefficient: 0.35,
    note: 'Per hand / per leg ориентир для выпадов с гантелями',
  },
  'reverse-lunges': {
    baseExercise: 'squat',
    coefficient: 0.35,
    note: 'Per hand / per leg ориентир для обратных выпадов',
  },
  'step-up': {
    baseExercise: 'squat',
    coefficient: 0.32,
    note: 'Per hand / per leg, высокая стабилизация',
  },
  'bodyweight-squat': {
    baseExercise: 'squat',
    coefficient: 0.0,
    note: 'Собственный вес — внешний вес не рассчитывается',
    isBodyweight: true,
  },
  
  // === LEGS - Hinge pattern (base: romanian-deadlift) ===
  'romanian-deadlift': {
    baseExercise: 'romanian-deadlift',
    coefficient: 1.0,
    note: 'Base exercise',
  },
  'deadlift': {
    baseExercise: 'romanian-deadlift',
    coefficient: 1.25,
    note: 'Conventional DL typically 20-25% higher than RDL',
  },
  'sumo-deadlift': {
    baseExercise: 'romanian-deadlift',
    coefficient: 1.20,
    note: 'Slightly lower than conventional for most',
  },
  'stiff-leg-deadlift': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.95,
    note: 'Similar to RDL, slightly less',
  },
  'dumbbell-rdl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.40,
    note: 'Per dumbbell, grip limiting',
  },
  'trap-bar-deadlift': {
    baseExercise: 'romanian-deadlift',
    coefficient: 1.15,
    note: 'Neutral grip allows higher loads',
  },
  'good-morning': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.50,
    note: 'Long moment arm, significant reduction',
  },
  'hyperextension': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.35,
    note: 'Гиперэкстензия с внешним весом, ниже RDL из-за рычага и амплитуды',
  },
  'cable-pull-through': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.55,
    note: 'Блочный hip hinge, стабильная траектория, ниже RDL',
  },
  'dumbbell-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.22,
    note: 'Свободный вес между стопами, общий вес гантели',
  },
  'leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.42,
    note: 'Базовый тренажёр сгибания ног, двусторонний вес стека',
  },
  'lying-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.42,
    note: 'Лёжа в тренажёре, двусторонний вес стека',
  },
  'seated-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.45,
    note: 'Сидя в тренажёре, часто немного сильнее варианта лёжа',
  },
  'standing-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.22,
    note: 'Одной ногой в тренажёре: вес для одной конечности',
  },
  'single-leg-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.22,
    note: 'Односторонний тренажёр: вес для одной конечности',
  },
  'cable-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.20,
    note: 'Блочный тренажёр одной ногой: вес для одной конечности',
  },
  'nordic-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.0,
    note: 'Собственный вес, внешний вес обычно не рассчитывается',
    isBodyweight: true,
  },
  'sliding-leg-curl': {
    baseExercise: 'romanian-deadlift',
    coefficient: 0.0,
    note: 'Собственный вес / слайдеры, внешний вес не рассчитывается',
    isBodyweight: true,
  },
  
  // === BACK (base: weighted-pull-ups) ===
  // IMPORTANT: For weighted-pull-ups family, the PM represents ADDED weight only.
  // The coefficients here are relative to TOTAL pulling capacity (bodyweight + added PM).
  // calculateWeightFromPM handles the bodyweight math when userBodyweight is provided.
  'weighted-pull-ups': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 1.0,
    note: 'Base exercise - coefficient relative to total capacity',
    isBodyweight: true, // Result = totalCapacity * coef * intensity - bodyweight
  },
  'pull-ups': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 1.0,
    note: 'Bodyweight exercise - added weight = totalCapacity * coef - bodyweight',
    isBodyweight: true,
  },
  'chin-ups': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 1.0,
    note: 'Similar difficulty to pull-ups',
    isBodyweight: true,
  },
  'lat-pulldown': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.75,
    note: 'Машина — 75% от тяговой мощности, стабильнее чем подтягивания',
  },
  'barbell-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.80,
    note: '80% of total pulling capacity',
  },
  'dumbbell-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.40,
    note: 'Per dumbbell, ~40% of total pulling capacity',
  },
  't-bar-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.85,
    note: 'Полумашина — стабильнее barbell row, 85% тяговой мощности',
  },
  'cable-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.75,
    note: 'Блок — стабильная тяга, 75% тяговой мощности',
  },
  'machine-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.85,
    note: 'Тренажёрная тяга, больше стабильности чем свободный вес',
  },
  'single-arm-cable-row': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.38,
    note: 'Блок одной рукой: вес для одной конечности',
  },
  'straight-arm-pulldown': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 0.35,
    note: 'Блочная изоляция широчайших',
  },

  // === ASSISTED EXERCISES (gravitron) ===
  'assisted-pullup': {
    baseExercise: 'weighted-pull-ups',
    coefficient: 1.0,
    note: 'Гравитрон — пользователь вводит помощь, система считает effective = bodyweight - assistance',
    isAssisted: true,
  },
  'assisted-dips': {
    baseExercise: 'bench-press',
    coefficient: 0.85,
    note: 'Гравитрон брусья — помощь тренажёра, effective = bodyweight - assistance',
    isAssisted: true,
  },

  // === SHOULDERS (base: bench-press) ===
  'overhead-press': {
    baseExercise: 'bench-press',
    coefficient: 0.65,
    note: 'OHP ~65% of bench press',
  },
  'dumbbell-overhead-press': {
    baseExercise: 'bench-press',
    coefficient: 0.30,
    note: 'Per hand, ~60% ÷ 2',
  },
  'dumbbell-shoulder-press': {
    baseExercise: 'bench-press',
    coefficient: 0.32,
    note: 'Seated DB press, per hand',
  },
  'seated-dumbbell-press': {
    baseExercise: 'bench-press',
    coefficient: 0.32,
    note: 'Alias for dumbbell-shoulder-press, per hand',
  },
  'machine-shoulder-press': {
    baseExercise: 'bench-press',
    coefficient: 0.75,
    note: 'Машина убирает стабилизацию — выше OHP (0.65)',
  },
  'shoulder-press-machine': {
    baseExercise: 'bench-press',
    coefficient: 0.75,
    note: 'Alias — машина выше свободного OHP',
  },
  'arnold-press': {
    baseExercise: 'bench-press',
    coefficient: 0.28,
    note: 'Per hand, rotation reduces load',
  },
  'push-press': {
    baseExercise: 'bench-press',
    coefficient: 0.75,
    note: 'Leg drive allows ~75% of bench',
  },

  // === ISOLATION - SHOULDERS (base: bench-press) ===
  'lateral-raise': {
    baseExercise: 'bench-press',
    coefficient: 0.12,
    note: 'Per hand, ~12кг при ПМ жима 100кг',
  },
  'cable-lateral-raise': {
    baseExercise: 'bench-press',
    coefficient: 0.15,
    note: 'Per arm, блок стабильнее гантели',
  },
  'face-pull': {
    baseExercise: 'bench-press',
    coefficient: 0.20,
    note: '~20кг при ПМ жима 100',
  },
  'rear-delt-fly': {
    baseExercise: 'bench-press',
    coefficient: 0.10,
    note: 'Per hand, ~10кг при ПМ жима 100',
  },
  'machine-lateral-raise': {
    baseExercise: 'bench-press',
    coefficient: 0.18,
    note: 'Тренажёр боковых дельт, стабильнее гантелей',
  },
  'reverse-pec-deck': {
    baseExercise: 'bench-press',
    coefficient: 0.18,
    note: 'Тренажёр задней дельты / обратная бабочка',
  },

  // === ISOLATION - BICEPS (base: bench-press) ===
  'dumbbell-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.20,
    note: 'Per hand, ~20кг при ПМ жима 100',
  },
  'barbell-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.40,
    note: 'Штанга бицепс',
  },
  'hammer-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.22,
    note: 'Per hand, нейтральный хват',
  },
  'preacher-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.35,
    note: 'Скамья Скотта',
  },
  'cable-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.20,
    note: 'Блок бицепс',
  },
  'machine-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.32,
    note: 'Тренажёр на бицепс, стабильная траектория',
  },
  'single-arm-cable-curl': {
    baseExercise: 'bench-press',
    coefficient: 0.12,
    note: 'Блок одной рукой: вес для одной конечности',
  },

  // === ISOLATION - TRICEPS (base: bench-press) ===
  'tricep-pushdown': {
    baseExercise: 'bench-press',
    coefficient: 0.30,
    note: 'Блок трицепс',
  },
  'skull-crusher': {
    baseExercise: 'bench-press',
    coefficient: 0.35,
    note: 'Французский жим',
  },
  'overhead-tricep-extension': {
    baseExercise: 'bench-press',
    coefficient: 0.25,
    note: 'Блок над головой',
  },
  'cable-overhead-extension': {
    baseExercise: 'bench-press',
    coefficient: 0.25,
    note: 'Блок над головой',
  },
  'tricep-kickback': {
    baseExercise: 'bench-press',
    coefficient: 0.08,
    note: 'Гантель одной рукой: вес для одной конечности',
  },
  'single-arm-tricep-pushdown': {
    baseExercise: 'bench-press',
    coefficient: 0.13,
    note: 'Блок одной рукой: вес для одной конечности',
  },

  // === ISOLATION - CHEST (base: bench-press) ===
  'cable-crossover': {
    baseExercise: 'bench-press',
    coefficient: 0.15,
    note: 'Per hand, кроссовер',
  },
  'cable-fly': {
    baseExercise: 'bench-press',
    coefficient: 0.15,
    note: 'Per hand, разведения на блоке',
  },
  'dumbbell-fly': {
    baseExercise: 'bench-press',
    coefficient: 0.12,
    note: 'Per hand, свободный вес требует больше стабилизации',
  },
  'pec-deck': {
    baseExercise: 'bench-press',
    coefficient: 0.25,
    note: 'Тренажёр бабочка, общий вес стека',
  },

  // === ISOLATION - LEGS (base: squat) ===
  'leg-extension': {
    baseExercise: 'squat',
    coefficient: 0.40,
    note: 'Тренажёр разгибания, двусторонний вес стека',
  },
  'single-leg-extension': {
    baseExercise: 'squat',
    coefficient: 0.20,
    note: 'Тренажёр разгибания одной ногой: вес для одной конечности',
  },
  'glute-bridge': {
    baseExercise: 'squat',
    coefficient: 0.60,
    note: 'Ягодичный мост со штангой',
  },
  'hip-thrust': {
    baseExercise: 'squat',
    coefficient: 0.80,
    note: 'Тяжелее моста, свободный вес/штанга',
  },
  'machine-hip-thrust': {
    baseExercise: 'squat',
    coefficient: 0.90,
    note: 'Тренажёр hip thrust, стабильная траектория',
  },
  'cable-kickback': {
    baseExercise: 'squat',
    coefficient: 0.12,
    note: 'Блок одной ногой: вес для одной конечности',
  },
  'band-kickback': {
    baseExercise: 'squat',
    coefficient: 0.0,
    note: 'Резинка/собственный вес, внешний вес не пересчитывается',
    isBodyweight: true,
  },

  // === DIPS (base: bench-press) ===
  'dips': {
    baseExercise: 'bench-press',
    coefficient: 0.85,
    note: 'Bodyweight + доп. вес',
    isBodyweight: true,
  },

  // === ISOLATION - CALVES (base: squat) ===
  'standing-calf-raise': {
    baseExercise: 'squat',
    coefficient: 0.60,
    note: 'Подъём на носки стоя',
  },
  'seated-calf-raise': {
    baseExercise: 'squat',
    coefficient: 0.45,
    note: 'Подъём на носки сидя (камбаловидная)',
  },
  'calf-raise-machine': {
    baseExercise: 'squat',
    coefficient: 0.70,
    note: 'Тренажёр для икр',
  },
  'leg-press-calf-raise': {
    baseExercise: 'squat',
    coefficient: 1.20,
    note: 'Икры в жиме ногами, тренажёр позволяет высокий общий вес',
  },
  'smith-calf-raise': {
    baseExercise: 'squat',
    coefficient: 0.70,
    note: 'Смит для икр, меньше стабилизации',
  },
  'dumbbell-calf-raise': {
    baseExercise: 'squat',
    coefficient: 0.30,
    note: 'Per hand, подъём на носки с гантелями',
  },
  'single-leg-calf-raise': {
    baseExercise: 'squat',
    coefficient: 0.18,
    note: 'Одна нога: вес для одной конечности / одной руки',
  },
};

const BODYWEIGHT_ONLY_KEYWORDS = [
  'bodyweight', 'plank', 'планка', 'ab-wheel', 'ролик', 'push-up', 'отжим',
  'nordic', 'sliding', 'скольж', 'без веса', 'own bodyweight',
];

const UNILATERAL_KEYWORDS = [
  'single', 'one-arm', 'one arm', 'one-leg', 'single-leg', 'single-arm',
  'per dumbbell', 'per hand', 'per arm', 'per side', 'per leg',
  'одной', 'одна', 'одну', 'односторон', 'поочеред', 'на одну', 'для одной', 'standing-leg-curl',
];

type ExerciseDescriptor = {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  equipment: string[];
  difficultyScore: number;
  isBodyweightOnly: boolean;
  isCompound: boolean;
  source: 'unified' | 'extended' | 'unknown';
};

function includesAny(value: string, keywords: string[]): boolean {
  const normalized = value.toLowerCase();
  return keywords.some(keyword => normalized.includes(keyword));
}

function hasMuscle(muscles: MuscleGroup[], candidates: MuscleGroup[]): boolean {
  return muscles.some(muscle => candidates.includes(muscle));
}

function getExerciseDescriptor(exerciseId: string): ExerciseDescriptor {
  const unified = getUnifiedExerciseForId(exerciseId);
  if (unified) return getUnifiedDescriptor(unified, exerciseId);

  const extended = getExtendedCoreExerciseById(exerciseId);
  if (extended) return getExtendedDescriptor(extended, exerciseId);

  return {
    id: exerciseId,
    name: exerciseId,
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: [],
    difficultyScore: 2,
    isBodyweightOnly: includesAny(exerciseId, BODYWEIGHT_ONLY_KEYWORDS),
    isCompound: false,
    source: 'unknown',
  };
}

function getUnifiedDescriptor(exercise: UnifiedExercise, requestedId: string): ExerciseDescriptor {
  const searchable = `${requestedId} ${exercise.id} ${exercise.name.ru} ${exercise.name.en}`;
  return {
    id: exercise.id,
    name: exercise.name.ru,
    primaryMuscles: exercise.primaryMuscles,
    secondaryMuscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficultyScore: exercise.difficultyScore,
    isBodyweightOnly: exercise.equipment.includes('bodyweight') && includesAny(searchable, BODYWEIGHT_ONLY_KEYWORDS),
    isCompound: exercise.primaryMuscles.length > 1 || exercise.secondaryMuscles.length > 0,
    source: 'unified',
  };
}

function getExtendedDescriptor(exercise: ExerciseExtended, requestedId: string): ExerciseDescriptor {
  const searchable = `${requestedId} ${exercise.id} ${exercise.name}`;
  return {
    id: exercise.id,
    name: exercise.name,
    primaryMuscles: exercise.muscles.primary,
    secondaryMuscles: exercise.muscles.secondary,
    equipment: exercise.equipment,
    difficultyScore: exercise.difficulty,
    isBodyweightOnly: exercise.isBodyweightOnly === true || exercise.equipment.includes('bodyweight') && includesAny(searchable, BODYWEIGHT_ONLY_KEYWORDS),
    isCompound: exercise.type === 'compound',
    source: 'extended',
  };
}

function inferBaseExercise(descriptor: ExerciseDescriptor): BasePMExercise {
  const muscles = [...descriptor.primaryMuscles, ...descriptor.secondaryMuscles];

  if (hasMuscle(muscles, ['hamstrings', 'lower_back', 'lumbar', 'lumbar_multifidus', 'lumbar_stabilizers'])) {
    return 'romanian-deadlift';
  }

  if (hasMuscle(muscles, ['quadriceps', 'quads', 'glutes', 'calves', 'hip_abductors', 'hip_flexors'])) {
    return 'squat';
  }

  if (hasMuscle(muscles, ['back', 'lats', 'upper_back', 'traps', 'grip'])) {
    return 'weighted-pull-ups';
  }

  if (hasMuscle(muscles, ['chest', 'shoulders', 'front_delt', 'side_delt', 'rear_delt', 'rotator_cuff', 'shoulder_stabilizers', 'biceps', 'brachialis', 'brachioradialis', 'triceps', 'triceps_long', 'forearms'])) {
    return 'bench-press';
  }

  return 'squat';
}

function getEquipmentKind(equipment: string[]): 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'other' {
  if (equipment.includes('bodyweight')) return 'bodyweight';
  if (equipment.includes('barbell')) return 'barbell';
  if (equipment.includes('dumbbell')) return 'dumbbell';
  if (equipment.includes('machine')) return 'machine';
  if (equipment.includes('cable') || equipment.includes('cables')) return 'cable';
  return 'other';
}

function inferCoefficientByBase(baseExercise: BasePMExercise, descriptor: ExerciseDescriptor, exerciseId: string): number {
  const muscles = [...descriptor.primaryMuscles, ...descriptor.secondaryMuscles];
  const equipmentKind = getEquipmentKind(descriptor.equipment);
  const searchable = `${exerciseId} ${descriptor.id} ${descriptor.name}`;
  const unilateral = includesAny(searchable, UNILATERAL_KEYWORDS);
  const bodyweight = descriptor.isBodyweightOnly || equipmentKind === 'bodyweight';

  if (bodyweight) return 0;

  if (baseExercise === 'romanian-deadlift') {
    if (hasMuscle(descriptor.primaryMuscles, ['hamstrings']) && !descriptor.isCompound) {
      if (equipmentKind === 'cable') return unilateral ? 0.20 : 0.34;
      if (equipmentKind === 'machine') return unilateral ? 0.22 : 0.43;
      if (equipmentKind === 'dumbbell') return unilateral ? 0.18 : 0.22;
      return unilateral ? 0.20 : 0.35;
    }
    if (equipmentKind === 'dumbbell') return unilateral ? 0.28 : 0.40;
    if (equipmentKind === 'machine') return 0.85;
    if (equipmentKind === 'cable') return 0.55;
    return descriptor.isCompound ? 1.0 : 0.45;
  }

  if (baseExercise === 'squat') {
    if (hasMuscle(descriptor.primaryMuscles, ['calves'])) {
      if (equipmentKind === 'machine') return unilateral ? 0.35 : 0.70;
      if (equipmentKind === 'dumbbell') return unilateral ? 0.18 : 0.30;
      return unilateral ? 0.25 : 0.55;
    }
    if (hasMuscle(descriptor.primaryMuscles, ['hip_abductors', 'hip_flexors'])) {
      if (equipmentKind === 'cable') return unilateral ? 0.12 : 0.22;
      if (equipmentKind === 'machine') return unilateral ? 0.18 : 0.35;
      return unilateral ? 0.08 : 0.18;
    }
    if (!descriptor.isCompound) {
      if (equipmentKind === 'machine') return unilateral ? 0.20 : 0.40;
      if (equipmentKind === 'cable') return unilateral ? 0.12 : 0.24;
      return unilateral ? 0.18 : 0.35;
    }
    if (equipmentKind === 'machine') return includesAny(searchable, ['press', 'жим']) ? 2.0 : 1.1;
    if (equipmentKind === 'dumbbell') return unilateral ? 0.35 : 0.45;
    return unilateral ? 0.40 : 1.0;
  }

  if (baseExercise === 'weighted-pull-ups') {
    if (equipmentKind === 'machine') return 0.85;
    if (equipmentKind === 'cable') return unilateral ? 0.38 : 0.75;
    if (equipmentKind === 'dumbbell') return unilateral ? 0.40 : 0.55;
    if (equipmentKind === 'barbell') return 0.80;
    return descriptor.isCompound ? 0.80 : 0.35;
  }

  if (baseExercise === 'bench-press') {
    if (hasMuscle(descriptor.primaryMuscles, ['chest'])) {
      if (!descriptor.isCompound) {
        if (equipmentKind === 'machine') return 0.25;
        if (equipmentKind === 'cable') return unilateral ? 0.10 : 0.15;
        if (equipmentKind === 'dumbbell') return 0.12;
        return 0.18;
      }
      if (equipmentKind === 'machine') return 1.10;
      if (equipmentKind === 'dumbbell') return 0.40;
      return 1.0;
    }
    if (hasMuscle(descriptor.primaryMuscles, ['shoulders', 'front_delt', 'side_delt', 'rear_delt'])) {
      if (descriptor.isCompound) {
        if (equipmentKind === 'machine') return 0.75;
        if (equipmentKind === 'dumbbell') return 0.32;
        return 0.65;
      }
      if (equipmentKind === 'machine') return 0.18;
      if (equipmentKind === 'cable') return unilateral ? 0.08 : 0.15;
      if (equipmentKind === 'dumbbell') return unilateral ? 0.10 : 0.12;
      return 0.12;
    }
    if (hasMuscle(descriptor.primaryMuscles, ['biceps', 'brachialis', 'brachioradialis', 'forearms'])) {
      if (equipmentKind === 'barbell') return 0.40;
      if (equipmentKind === 'machine') return 0.32;
      if (equipmentKind === 'cable') return unilateral ? 0.12 : 0.20;
      if (equipmentKind === 'dumbbell') return unilateral ? 0.20 : 0.22;
      return 0.20;
    }
    if (hasMuscle(descriptor.primaryMuscles, ['triceps', 'triceps_long'])) {
      if (equipmentKind === 'barbell') return 0.35;
      if (equipmentKind === 'machine') return 0.35;
      if (equipmentKind === 'cable') return unilateral ? 0.13 : 0.30;
      if (equipmentKind === 'dumbbell') return unilateral ? 0.08 : 0.22;
      return 0.25;
    }
    return descriptor.isCompound ? 0.65 : 0.20;
  }

  return 0.25;
}

function getLimbLabel(descriptor: ExerciseDescriptor): 'руку' | 'ногу' | 'сторону' {
  const muscles = [...descriptor.primaryMuscles, ...descriptor.secondaryMuscles];
  if (hasMuscle(muscles, ['quadriceps', 'quads', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_flexors'])) return 'ногу';
  if (hasMuscle(muscles, ['chest', 'back', 'lats', 'upper_back', 'shoulders', 'front_delt', 'side_delt', 'rear_delt', 'biceps', 'brachialis', 'brachioradialis', 'triceps', 'triceps_long', 'forearms'])) return 'руку';
  return 'сторону';
}

function inferLoadUnit(exerciseId: string, coefficient: WeightCoefficient, descriptor = getExerciseDescriptor(exerciseId)): ExerciseWeightLoadUnit {
  if (coefficient.isAssisted) return 'assistance';
  if (coefficient.isBodyweight && coefficient.coefficient > 0) return 'added_bodyweight';
  if (coefficient.isBodyweight || coefficient.coefficient === 0 || descriptor.isBodyweightOnly) return 'bodyweight';

  const searchable = `${exerciseId} ${descriptor.id} ${descriptor.name} ${coefficient.note ?? ''}`;
  const lower = searchable.toLowerCase();
  if (lower.includes('общий вес') || lower.includes('двусторонний вес')) return 'total';
  return includesAny(searchable, UNILATERAL_KEYWORDS) ? 'per_limb' : 'total';
}

function withLoadUnit(exerciseId: string, coefficient: WeightCoefficient | null): WeightCoefficient | null {
  if (!coefficient) return null;
  return {
    ...coefficient,
    loadUnit: coefficient.loadUnit ?? inferLoadUnit(exerciseId, coefficient),
  };
}

function inferExerciseCoefficient(exerciseId: string): WeightCoefficient | null {
  const descriptor = getExerciseDescriptor(exerciseId);
  if (descriptor.source === 'unknown' && descriptor.primaryMuscles.length === 0) return null;

  const baseExercise = inferBaseExercise(descriptor);
  const coefficient = inferCoefficientByBase(baseExercise, descriptor, exerciseId);
  const equipmentKind = getEquipmentKind(descriptor.equipment);
  const note = coefficient === 0
    ? 'Авто-коэффициент: собственный вес / внешний вес не рассчитывается'
    : `Авто-коэффициент по базе ${baseExercise}, группе мышц и оборудованию (${equipmentKind})`;

  return {
    baseExercise,
    coefficient,
    note,
    isBodyweight: coefficient === 0 || descriptor.isBodyweightOnly,
    loadUnit: inferLoadUnit(exerciseId, { baseExercise, coefficient, isBodyweight: coefficient === 0 || descriptor.isBodyweightOnly }, descriptor),
  };
}

function getResolvedCoefficient(exerciseId: string): WeightCoefficient | null {
  const resolvedId = resolveCoefficientId(exerciseId);
  return withLoadUnit(exerciseId, EXERCISE_WEIGHT_COEFFICIENTS[resolvedId] ?? inferExerciseCoefficient(exerciseId));
}

export function getExerciseWeightLoadUnit(exerciseId: string): ExerciseWeightLoadUnit {
  return getResolvedCoefficient(exerciseId)?.loadUnit ?? 'total';
}

export function getExerciseWeightUnitLabel(exerciseId: string): string {
  const descriptor = getExerciseDescriptor(exerciseId);
  const limb = getLimbLabel(descriptor);

  switch (getExerciseWeightLoadUnit(exerciseId)) {
    case 'per_limb':
      return `на одну ${limb}`;
    case 'added_bodyweight':
      return 'добавочный вес';
    case 'assistance':
      return 'помощь тренажёра';
    case 'bodyweight':
      return 'собственный вес';
    case 'total':
    default:
      return 'общий вес';
  }
}

export function getExerciseWeightUnitSuffix(exerciseId: string): string {
  switch (getExerciseWeightLoadUnit(exerciseId)) {
    case 'per_limb':
      return ` / ${getLimbLabel(getExerciseDescriptor(exerciseId))}`;
    case 'added_bodyweight':
      return ' доб.';
    case 'assistance':
      return ' помощь';
    case 'bodyweight':
      return ' св. вес';
    case 'total':
    default:
      return '';
  }
}

/**
 * Check if an exercise is assisted (gravitron-style)
 */
export function isAssistedExercise(exerciseId: string): boolean {
  return getResolvedCoefficient(exerciseId)?.isAssisted === true;
}

/**
 * Calculate effective weight for assisted exercises
 * effective = bodyweight - assistance
 * For progression: decreasing assistance = increasing effective weight
 * When assistance reaches 0, transition to bodyweight/added weight
 */
export function calculateEffectiveWeight(
  assistanceWeight: number,
  userBodyweight: number
): number {
  return Math.max(0, userBodyweight - assistanceWeight);
}

/**
 * Calculate assistance weight from effective weight
 * assistance = bodyweight - effective
 */
export function calculateAssistanceFromEffective(
  effectiveWeight: number,
  userBodyweight: number
): number {
  return Math.max(0, userBodyweight - effectiveWeight);
}

/**
 * Get the weight coefficient for an exercise
 * Returns null if exercise is not in the conversion table (use default weight logic)
 */
export function getExerciseCoefficient(exerciseId: string): WeightCoefficient | null {
  return getResolvedCoefficient(exerciseId);
}

/**
 * Convert weight between two exercises based on their coefficients
 * 
 * @param fromExerciseId - Source exercise
 * @param toExerciseId - Target exercise  
 * @param currentWeight - Current weight for source exercise
 * @param basePM - Optional PM value to use as reference
 * @returns Adjusted weight for target exercise, rounded to 2.5kg
 */
export function convertWeightBetweenExercises(
  fromExerciseId: string,
  toExerciseId: string,
  currentWeight: number,
  basePM?: number
): number {
  const fromCoef = getResolvedCoefficient(fromExerciseId);
  const toCoef = getResolvedCoefficient(toExerciseId);
  
  // If either exercise is not in the table, return current weight
  if (!fromCoef || !toCoef) {
    return currentWeight;
  }
  
  // Must be same base exercise family
  if (fromCoef.baseExercise !== toCoef.baseExercise) {
    return currentWeight;
  }
  
  // If we have base PM, calculate from it
  if (basePM && basePM > 0) {
    const targetWeight = basePM * toCoef.coefficient;
    return Math.round(targetWeight / 2.5) * 2.5;
  }
  
  // Otherwise, calculate relative conversion
  // fromWeight = basePM * fromCoef => basePM = fromWeight / fromCoef
  // toWeight = basePM * toCoef = (fromWeight / fromCoef) * toCoef
  if (fromCoef.coefficient === 0) {
    // Can't divide by zero (bodyweight exercises)
    return currentWeight;
  }
  
  const estimatedBasePM = currentWeight / fromCoef.coefficient;
  const targetWeight = estimatedBasePM * toCoef.coefficient;
  
  return Math.round(targetWeight / 2.5) * 2.5;
}

/**
 * Calculate target weight for an exercise based on PM and intensity
 * 
 * For weighted-pull-ups family: PM = added weight only.
 * Total pulling capacity = userBodyweight + PM.
 * Target weight = totalCapacity * coefficient * intensity.
 * For bodyweight exercises (pull-ups): added weight = target - bodyweight (min 0).
 * For barbell/machine exercises: target weight is the bar/machine weight directly.
 * 
 * @param exerciseId - Exercise to calculate for
 * @param pm - Personal Max value (estimated 1RM or added weight for pull-ups)
 * @param intensityMultiplier - Percentage of PM to use (0.65-0.85)
 * @param userBodyweight - User's bodyweight in kg (needed for pull-up family calculations)
 * @returns Target weight rounded to 2.5kg
 */
export function calculateWeightFromPM(
  exerciseId: string,
  pm: number,
  intensityMultiplier: number,
  userBodyweight?: number,
  pmRawWeight?: number,
  pmRawReps?: number,
): number {
  const coef = getResolvedCoefficient(exerciseId);
  
  if (!coef) {
    // No coefficient, use PM directly with intensity
    return Math.round((pm * intensityMultiplier) / 2.5) * 2.5;
  }
  
  // Special handling for weighted-pull-ups family:
  if (coef.baseExercise === 'weighted-pull-ups' && userBodyweight && userBodyweight > 0) {
    // Use correct total 1RM if raw values provided, otherwise fallback
    let total1RM: number;
    if (pmRawWeight !== undefined && pmRawReps !== undefined) {
      total1RM = calculateTotal1RM(pmRawWeight, pmRawReps, userBodyweight);
    } else {
      // Fallback: pm is estimated_1rm of added weight (less accurate)
      total1RM = userBodyweight + pm;
    }
    
    const targetTotal = total1RM * coef.coefficient * intensityMultiplier;
    
    if (coef.isAssisted) {
      // Assisted exercise (gravitron): return assistance weight
      // assistance = bodyweight - effective target load
      const assistanceWeight = Math.max(0, userBodyweight - targetTotal);
      return Math.round(assistanceWeight / 2.5) * 2.5;
    }
    
    if (coef.isBodyweight) {
      const addedWeight = Math.max(0, targetTotal - userBodyweight);
      return Math.round(addedWeight / 2.5) * 2.5;
    }
    
    return Math.round(targetTotal / 2.5) * 2.5;
  }
  
  // Standard calculation for non-bodyweight families
  const baseWeight = pm * coef.coefficient;
  const targetWeight = baseWeight * intensityMultiplier;
  
  return Math.round(targetWeight / 2.5) * 2.5;
}

/**
 * Calculate total 1RM for pulling capacity from raw PM data.
 * 
 * IMPORTANT: Epley formula is NOT linear, so:
 *   1RM_total ≠ bodyweight + 1RM_added
 * 
 * Correct: 1RM_total = (bodyweight + addedWeight) × (1 + reps/30)
 * 
 * @param addedWeight - Raw added weight (kg on belt/vest)
 * @param reps - Reps performed with that added weight
 * @param userBodyweight - User's bodyweight in kg
 * @returns Total pulling 1RM
 */
export function calculateTotal1RM(
  addedWeight: number,
  reps: number,
  userBodyweight: number
): number {
  const totalWeight = userBodyweight + addedWeight;
  if (reps === 1) return totalWeight;
  return totalWeight * (1 + reps / 30);
}

/**
 * Calculate max bodyweight reps from total 1RM using inverse Epley.
 * 
 * Inverse Epley: maxReps = 30 × (1RM / loadWeight - 1)
 * For bodyweight: maxReps = 30 × (total1RM / bodyweight - 1)
 * 
 * @param total1RM - Total pulling 1RM (from calculateTotal1RM)
 * @param userBodyweight - User's bodyweight in kg
 * @returns Estimated max reps at bodyweight, capped at 30
 */
export function calculateMaxBodyweightReps(
  total1RM: number,
  userBodyweight: number
): number | null {
  if (!userBodyweight || userBodyweight <= 0 || total1RM <= userBodyweight) return null;
  const maxReps = Math.floor(30 * (total1RM / userBodyweight - 1));
  if (maxReps <= 0) return null;
  return Math.min(maxReps, 30);
}

/**
 * Calculate target reps for bodyweight exercises (pull-ups, chin-ups)
 * based on estimated max reps at bodyweight.
 * 
 * Uses the correct total 1RM calculation (Epley on full load),
 * then inverse Epley to find max bodyweight reps,
 * then scales by intensity.
 * 
 * @param exerciseId - Exercise to check (only applies to bodyweight pull-up family)
 * @param addedWeight - Raw added weight in kg (NOT estimated 1RM)
 * @param reps - Reps performed with that added weight
 * @param userBodyweight - User's bodyweight in kg
 * @param intensity - Training intensity
 * @returns Adjusted target reps, or null if not a bodyweight exercise / no data
 */
export function calculateBodyweightReps(
  exerciseId: string,
  addedWeight: number,
  reps: number,
  userBodyweight: number,
  intensity: 'easy' | 'medium' | 'hard'
): number | null {
  const coef = getResolvedCoefficient(exerciseId);
  
  // Only applies to bodyweight exercises in the pull-up family
  if (!coef || !coef.isBodyweight || coef.baseExercise !== 'weighted-pull-ups') {
    return null;
  }
  
  if (!userBodyweight || userBodyweight <= 0) return null;
  
  const total1RM = calculateTotal1RM(addedWeight, reps, userBodyweight);
  const maxReps = calculateMaxBodyweightReps(total1RM, userBodyweight);
  
  if (!maxReps) return null;
  
  // Intensity-based rep percentage
  const repPercentages: Record<string, number> = {
    easy: 0.55,
    medium: 0.70,
    hard: 0.85,
  };
  
  const percentage = repPercentages[intensity] || 0.65;
  const targetReps = Math.max(3, Math.round(maxReps * percentage));
  
  return targetReps;
}
