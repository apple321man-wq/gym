// RIR-based weight adjustment logic
// RIR = Reps In Reserve (сколько повторений осталось в запасе)

export type RIRLevel = 0 | 1 | 2 | 4;
export type TrainingType = 'easy' | 'medium' | 'hard';

export interface RIROption {
  label: string;
  description: string;
  rir: RIRLevel;
  emoji: string;
}

export const RIR_OPTIONS: RIROption[] = [
  { label: 'На изи', description: 'Мог ещё много', rir: 4, emoji: '😎' },
  { label: 'Можно было ещё пару', description: 'Запас 2-3 повтора', rir: 2, emoji: '💪' },
  { label: 'Максимум ещё один', description: 'Почти на пределе', rir: 1, emoji: '😤' },
  { label: 'Из последних сил', description: 'До отказа', rir: 0, emoji: '🔥' },
];

// Weight adjustment percentages by training type and RIR
const ADJUSTMENT_TABLE: Record<TrainingType, Record<RIRLevel, number>> = {
  hard: {
    4: 0.05,    // +5%
    2: 0.025,   // +2.5%
    1: 0,       // no change
    0: -0.025,  // -2.5%
  },
  medium: {
    4: 0.025,   // +2.5%
    2: 0,       // no change
    1: -0.025,  // -2.5%
    0: -0.05,   // -5%
  },
  easy: {
    4: 0.01,    // +1%
    2: 0,       // no change
    1: -0.025,  // -2.5%
    0: -0.05,   // -5%
  },
};

// Target RIR ranges by training type
export const TARGET_RIR: Record<TrainingType, { min: number; max: number }> = {
  hard: { min: 0, max: 2 },
  medium: { min: 1, max: 3 },
  easy: { min: 3, max: 5 },
};

/**
 * Round weight to nearest 2.5 kg
 */
function roundToStep(weight: number, step: number = 2.5): number {
  return Math.round(weight / step) * step;
}

/**
 * Calculate adjusted weight based on RIR feedback
 */
export function calculateAdjustedWeight(
  currentWeight: number,
  rir: RIRLevel,
  trainingType: TrainingType
): number {
  const adjustmentPercent = ADJUSTMENT_TABLE[trainingType][rir];
  const rawAdjusted = currentWeight * (1 + adjustmentPercent);
  return roundToStep(Math.max(0, rawAdjusted));
}

/**
 * Get load assessment label based on RIR and training type
 */
export function getLoadAssessment(
  rir: RIRLevel,
  trainingType: TrainingType
): { label: string; color: 'good' | 'warning' | 'critical' } {
  const target = TARGET_RIR[trainingType];
  
  if (rir >= target.min && rir <= target.max) {
    return { label: 'Оптимальная', color: 'good' };
  } else if (rir > target.max) {
    return { label: 'Слишком легко', color: 'warning' };
  } else {
    return { label: 'Слишком тяжело', color: 'critical' };
  }
}

/**
 * Get weight change description for next session
 */
export function getNextSessionRecommendation(
  currentWeight: number,
  adjustedWeight: number
): string {
  const diff = adjustedWeight - currentWeight;
  if (diff > 0) return `+${diff} кг`;
  if (diff < 0) return `${diff} кг`;
  return 'без изменений';
}
