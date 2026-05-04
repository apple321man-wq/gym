import type {
  AdaptiveDecision,
  AdaptivePlan,
  AdaptiveUserState,
  BulkTrainingDay,
  BulkTrainingSet,
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

function getCompletionRate(userState: AdaptiveUserState): number | null {
  if (!userState.plannedSets || userState.plannedSets <= 0 || userState.completedSets === undefined) {
    return null;
  }

  return Math.min(1, Math.max(0, userState.completedSets / userState.plannedSets));
}

function roundToTrainingWeight(weight: number): number {
  return Math.round(weight / 2.5) * 2.5;
}

function scaleWeight(weight: number | null, multiplier: number): number | null {
  if (weight === null) return null;
  return roundToTrainingWeight(weight * multiplier);
}

function scaleReps(reps: number, multiplier: number): number {
  return Math.max(1, Math.round(reps * multiplier));
}

function scaleSets(sets: BulkTrainingSet[], multiplier: number): BulkTrainingSet[] {
  const targetCount = Math.max(1, Math.round(sets.length * multiplier));

  if (targetCount <= sets.length) {
    return sets.slice(0, targetCount).map((set, index) => ({
      ...set,
      set_number: index + 1,
    }));
  }

  const lastSet = sets[sets.length - 1];
  const result = [...sets];
  while (result.length < targetCount && lastSet) {
    result.push({
      ...lastSet,
      set_number: result.length + 1,
    });
  }

  return result;
}

function scaleRest(set: BulkTrainingSet, multiplier: number): BulkTrainingSet {
  const currentRest = set.target_rest_seconds ?? 90;
  const nextRest = Math.round((currentRest * multiplier) / 5) * 5;

  return {
    ...set,
    target_rest_seconds: Math.min(300, Math.max(45, nextRest)),
  };
}

function getWeekOffset(day: BulkTrainingDay, firstDate: Date): number {
  const dayOffset = Math.floor((new Date(day.date).getTime() - firstDate.getTime()) / DAY_MS);
  return Math.max(0, Math.floor(dayOffset / 7));
}

function getFrequencyDropDates(plan: BulkTrainingDay[]): Set<string> {
  const firstDate = plan[0] ? new Date(plan[0].date) : new Date();
  const daysByWeek = new Map<number, BulkTrainingDay[]>();

  for (const day of plan) {
    const weekOffset = getWeekOffset(day, firstDate);
    const weekDays = daysByWeek.get(weekOffset) ?? [];
    weekDays.push(day);
    daysByWeek.set(weekOffset, weekDays);
  }

  const dropDates = new Set<string>();
  for (const [weekOffset, weekDays] of daysByWeek) {
    if (weekOffset === 0 || weekDays.length <= 2) continue;

    const sortedWeekDays = [...weekDays].sort((a, b) => a.date.localeCompare(b.date));
    dropDates.add(sortedWeekDays[sortedWeekDays.length - 1].date);
  }

  return dropDates;
}

function getAdaptiveDecisions(userState: AdaptiveUserState): AdaptiveDecision[] {
  const completionRate = getCompletionRate(userState);
  const decisions: AdaptiveDecision[] = [];
  const highRpe = userState.avgRpe !== undefined && userState.avgRpe >= 9;
  const lowRpe = userState.avgRpe !== undefined && userState.avgRpe <= 6.5;
  const lowCompletion = completionRate !== null && completionRate < 0.75;
  const highCompletion = completionRate !== null && completionRate >= 0.9;
  const highFatigue = userState.fatigue === 'high';
  const lowFatigue = userState.fatigue === 'low';
  const inconsistent = (userState.consistency !== undefined && userState.consistency < 0.65)
    || (userState.missedWorkouts !== undefined && userState.missedWorkouts >= 2);

  if (highRpe || lowCompletion || highFatigue) {
    decisions.push({
      type: 'decrease_load',
      multiplier: highFatigue || lowCompletion ? 0.9 : 0.95,
      reason: 'high_effort_or_low_completion',
    });
  } else if (lowRpe && highCompletion && lowFatigue && (userState.consistency ?? 1) >= 0.8) {
    decisions.push({
      type: 'increase_load',
      multiplier: 1.05,
      reason: 'low_effort_high_completion',
    });
  }

  if (highRpe || highFatigue) {
    decisions.push({
      type: 'adjust_rest',
      multiplier: 1.1,
      reason: 'recovery_support',
    });
  } else if (lowRpe && highCompletion) {
    decisions.push({
      type: 'adjust_rest',
      multiplier: 0.95,
      reason: 'easy_sessions',
    });
  }

  if (inconsistent) {
    decisions.push({
      type: 'adjust_frequency',
      multiplier: 0.9,
      reason: 'missed_workouts_or_low_consistency',
    });
  }

  return decisions;
}

export function buildAdaptiveWorkout(
  plan: BulkTrainingDay[],
  userState?: AdaptiveUserState
): { plan: BulkTrainingDay[]; adaptive: AdaptivePlan } {
  if (!userState) {
    return {
      plan,
      adaptive: { enabled: false, decisions: [] },
    };
  }

  const decisions = getAdaptiveDecisions(userState);
  if (decisions.length === 0) {
    return {
      plan,
      adaptive: { enabled: true, decisions: [] },
    };
  }

  const loadDecision = decisions.find(decision =>
    decision.type === 'increase_load' || decision.type === 'decrease_load'
  );
  const restDecision = decisions.find(decision => decision.type === 'adjust_rest');
  const frequencyDecision = decisions.find(decision => decision.type === 'adjust_frequency');
  const frequencyDropDates = frequencyDecision ? getFrequencyDropDates(plan) : new Set<string>();

  const adjustedPlan = plan
    .filter(day => !frequencyDropDates.has(day.date))
    .map(day => ({
      ...day,
      exercises: day.exercises.map(exercise => ({
        ...exercise,
        sets: scaleSets(exercise.sets, loadDecision?.multiplier ?? 1).map(set => {
          const loadAdjusted = {
            ...set,
            target_reps: scaleReps(set.target_reps, loadDecision?.multiplier ?? 1),
            target_weight: scaleWeight(set.target_weight, loadDecision?.multiplier ?? 1),
          };

          return restDecision ? scaleRest(loadAdjusted, restDecision.multiplier ?? 1) : loadAdjusted;
        }),
      })),
    }));

  return {
    plan: adjustedPlan,
    adaptive: {
      enabled: true,
      decisions,
    },
  };
}
