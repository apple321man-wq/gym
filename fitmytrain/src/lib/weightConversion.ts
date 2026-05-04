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
export const EXERCISE_WEIGHT_COEFFICIENTS: Record<string, {
  baseExercise: BasePMExercise;
  coefficient: number;
  note?: string;
  isBodyweight?: boolean; // true = result is added weight (subtract bodyweight from calculated total)
  isAssisted?: boolean; // true = gravitron-style: user inputs assistance, effective = bodyweight - assistance
}> = {
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
    note: 'Per side, balance requirement reduces weight',
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
    note: 'Alias for dumbbell-shoulder-press',
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
    note: '~12кг при ПМ жима 100кг',
  },
  'cable-lateral-raise': {
    baseExercise: 'bench-press',
    coefficient: 0.15,
    note: 'Блок стабильнее гантели',
  },
  'face-pull': {
    baseExercise: 'bench-press',
    coefficient: 0.20,
    note: '~20кг при ПМ жима 100',
  },
  'rear-delt-fly': {
    baseExercise: 'bench-press',
    coefficient: 0.10,
    note: '~10кг при ПМ жима 100',
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

  // === ISOLATION - LEGS (base: squat) ===
  'leg-extension': {
    baseExercise: 'squat',
    coefficient: 0.40,
    note: 'Тренажёр разгибания',
  },
  'leg-curl': {
    baseExercise: 'squat',
    coefficient: 0.35,
    note: 'Тренажёр сгибания',
  },
  'glute-bridge': {
    baseExercise: 'squat',
    coefficient: 0.60,
    note: 'Ягодичный мост',
  },
  'hip-thrust': {
    baseExercise: 'squat',
    coefficient: 0.80,
    note: 'Тяжелее моста',
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
};

/**
 * Check if an exercise is assisted (gravitron-style)
 */
export function isAssistedExercise(exerciseId: string): boolean {
  return EXERCISE_WEIGHT_COEFFICIENTS[exerciseId]?.isAssisted === true;
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
export function getExerciseCoefficient(exerciseId: string): {
  baseExercise: BasePMExercise;
  coefficient: number;
} | null {
  return EXERCISE_WEIGHT_COEFFICIENTS[exerciseId] || null;
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
  const fromCoef = EXERCISE_WEIGHT_COEFFICIENTS[fromExerciseId];
  const toCoef = EXERCISE_WEIGHT_COEFFICIENTS[toExerciseId];
  
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
  const coef = EXERCISE_WEIGHT_COEFFICIENTS[exerciseId];
  
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
  const coef = EXERCISE_WEIGHT_COEFFICIENTS[exerciseId];
  
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
