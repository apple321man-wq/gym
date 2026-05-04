// Auto-update Personal Max (PM) logic
// Формула Эпли: 1RM = weight × (1 + reps / 30)

export interface PMUpdateResult {
  shouldUpdate: boolean;
  new1RM: number;
  old1RM: number;
  reason: 'increase' | 'decrease' | 'none';
  changePercent: number;
  rejectionReason?: string;
}

export interface SetResult {
  weight: number;
  reps: number;
  rir: number;
  completed: boolean;
  targetReps: number;
}

/**
 * Multi-level PM update check
 * 
 * Increase conditions (ALL must be true):
 * 1. weight >= 78% of current 1RM
 * 2. At least 2 "good" sets (RIR 2-3, reps completed)
 * 3. completed_sets >= 60% of planned sets
 * 4. Last completed set RIR >= 2 (not failed)
 * 5. All completed sets have reps fulfilled
 * 6. consecutiveGoodSessions >= 2 (two good sessions in a row)
 * Max +5% per update
 * 
 * Decrease conditions:
 * - RIR = 0 (failure) on 2 consecutive sessions → PM -3%
 */
export function checkPMUpdate(params: {
  current1RM: number;
  weight: number;
  reps: number;
  rir: number;
  consecutiveHardSessions: number;
  consecutiveGoodSessions: number;
}): PMUpdateResult {
  // Legacy single-set API — use checkPMUpdateMultiSet for full logic
  return checkPMUpdateMultiSet({
    current1RM: params.current1RM,
    sets: [{
      weight: params.weight,
      reps: params.reps,
      rir: params.rir,
      completed: true,
      targetReps: params.reps,
    }],
    plannedSetsCount: 1,
    consecutiveHardSessions: params.consecutiveHardSessions,
    consecutiveGoodSessions: params.consecutiveGoodSessions,
  });
}

/**
 * Full multi-set PM update check with all safety conditions
 */
export function checkPMUpdateMultiSet(params: {
  current1RM: number;
  sets: SetResult[];
  plannedSetsCount: number;
  consecutiveHardSessions: number;
  consecutiveGoodSessions: number;
}): PMUpdateResult {
  const { current1RM, sets, plannedSetsCount, consecutiveHardSessions, consecutiveGoodSessions } = params;

  const noChange: PMUpdateResult = {
    shouldUpdate: false,
    new1RM: current1RM,
    old1RM: current1RM,
    reason: 'none',
    changePercent: 0,
  };

  const completedSets = sets.filter(s => s.completed);
  const completedCount = completedSets.length;

  // --- Decrease check ---
  // If 2+ consecutive hard sessions and last set was RIR 0
  if (consecutiveHardSessions >= 2) {
    const lastSet = completedSets[completedSets.length - 1];
    if (lastSet && lastSet.rir === 0) {
      const new1RM = roundTo1Decimal(current1RM * 0.97);
      return {
        shouldUpdate: true,
        new1RM,
        old1RM: current1RM,
        reason: 'decrease',
        changePercent: -3,
      };
    }
  }

  // --- Increase checks (ALL conditions must pass) ---

  // Condition 1: weight >= 78% 1RM (check best set)
  const weightThreshold = current1RM * 0.78;
  const heavySets = completedSets.filter(s => s.weight >= weightThreshold);
  if (heavySets.length === 0) {
    return { ...noChange, rejectionReason: 'weight_below_threshold' };
  }

  // Condition 2: at least 2 "good" sets (RIR 2-3, reps completed)
  const goodSets = completedSets.filter(s =>
    s.weight >= weightThreshold &&
    s.rir >= 2 && s.rir <= 3 &&
    s.reps >= s.targetReps
  );
  if (goodSets.length < 2) {
    return { ...noChange, rejectionReason: 'not_enough_good_sets' };
  }

  // Condition 3: completed >= 60% of planned sets
  const completionRatio = completedCount / Math.max(plannedSetsCount, 1);
  if (completionRatio < 0.6) {
    return { ...noChange, rejectionReason: 'insufficient_volume' };
  }

  // Condition 4: last completed set RIR >= 2 (not failed)
  const lastCompletedSet = completedSets[completedSets.length - 1];
  if (!lastCompletedSet || lastCompletedSet.rir < 2) {
    return { ...noChange, rejectionReason: 'last_set_failed' };
  }

  // Condition 5: all completed sets have reps fulfilled
  const allRepsCompleted = completedSets.every(s => s.reps >= s.targetReps);
  if (!allRepsCompleted) {
    return { ...noChange, rejectionReason: 'reps_not_completed' };
  }

  // Condition 6: at least 2 consecutive good sessions
  if (consecutiveGoodSessions < 2) {
    return { ...noChange, rejectionReason: 'need_consecutive_good_sessions' };
  }

  // All conditions passed — calculate new 1RM from best good set (Epley)
  let bestEstimated1RM = 0;
  for (const s of goodSets) {
    const est = s.weight * (1 + s.reps / 30);
    if (est > bestEstimated1RM) bestEstimated1RM = est;
  }

  if (bestEstimated1RM <= current1RM) {
    return { ...noChange, rejectionReason: 'estimated_not_higher' };
  }

  // Cap at +5%
  const maxAllowed = current1RM * 1.05;
  const new1RM = roundTo1Decimal(Math.min(bestEstimated1RM, maxAllowed));
  const changePercent = roundTo1Decimal(((new1RM - current1RM) / current1RM) * 100);

  if (changePercent < 0.5) {
    return { ...noChange, rejectionReason: 'change_too_small' };
  }

  return {
    shouldUpdate: true,
    new1RM,
    old1RM: current1RM,
    reason: 'increase',
    changePercent,
  };
}

function roundTo1Decimal(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Get exercise name for PM update toast
 */
export function getPMUpdateMessage(exerciseName: string, result: PMUpdateResult): string {
  // Lazy import to avoid circular deps with UI helpers
  const fmt = (v: number) => Number.isFinite(v) ? `${v.toFixed(1)} кг` : '— кг';
  if (result.reason === 'increase') {
    return `ПМ ${exerciseName} обновлён: ${fmt(result.old1RM)} → ${fmt(result.new1RM)} (+${result.changePercent}%)`;
  }
  if (result.reason === 'decrease') {
    return `ПМ ${exerciseName} снижен: ${fmt(result.old1RM)} → ${fmt(result.new1RM)} (${result.changePercent}%)`;
  }
  return '';
}

/**
 * Rejection reason labels for debugging/UI
 */
export const REJECTION_LABELS: Record<string, string> = {
  weight_below_threshold: 'Вес ниже 78% ПМ',
  not_enough_good_sets: 'Менее 2 качественных подходов (RIR 2-3)',
  insufficient_volume: 'Выполнено менее 60% подходов',
  last_set_failed: 'Последний подход провален (RIR < 2)',
  reps_not_completed: 'Не все повторения выполнены',
  need_consecutive_good_sessions: 'Нужно 2 хорошие тренировки подряд',
  estimated_not_higher: 'Расчётный 1RM не выше текущего',
  change_too_small: 'Изменение менее 0.5%',
};
