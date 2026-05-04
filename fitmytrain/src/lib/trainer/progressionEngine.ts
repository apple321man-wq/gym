import type { TrainingGoal, TrainingIntensity } from '@/types/training';
import type { BulkTrainingDay, BulkTrainingSet, ProgressionPlan } from './types';

const CYCLE_LENGTH = 4;
const DELOAD_WEEK = 4;

const INTENSITY_BY_GOAL: Record<TrainingGoal, Record<number, Exclude<TrainingIntensity, 'rest'>>> = {
  muscle_gain: {
    1: 'medium',
    2: 'hard',
    3: 'hard',
    4: 'easy',
  },
  recomposition: {
    1: 'medium',
    2: 'medium',
    3: 'hard',
    4: 'easy',
  },
  cutting: {
    1: 'medium',
    2: 'medium',
    3: 'medium',
    4: 'easy',
  },
  maintenance: {
    1: 'easy',
    2: 'medium',
    3: 'medium',
    4: 'easy',
  },
};

const VOLUME_MULTIPLIER_BY_WEEK: Record<number, number> = {
  1: 1,
  2: 1.05,
  3: 1.1,
  4: 0.6,
};

const WEIGHT_MULTIPLIER_BY_WEEK: Record<number, number> = {
  1: 1,
  2: 1.025,
  3: 1.05,
  4: 0.85,
};

export interface ProgressionConfig {
  goal: TrainingGoal;
  startWeekIndex?: number;
}

export function getCycleWeek(weekIndex: number): number {
  return ((Math.max(0, weekIndex) % CYCLE_LENGTH) + 1);
}

export function getIntensity(week: number, goal: TrainingGoal): Exclude<TrainingIntensity, 'rest'> {
  const cycleWeek = getCycleWeek(week - 1);
  return INTENSITY_BY_GOAL[goal][cycleWeek];
}

export function getVolumeMultiplier(week: number): number {
  const cycleWeek = getCycleWeek(week - 1);
  return VOLUME_MULTIPLIER_BY_WEEK[cycleWeek];
}

function getWeightMultiplier(week: number): number {
  const cycleWeek = getCycleWeek(week - 1);
  return WEIGHT_MULTIPLIER_BY_WEEK[cycleWeek];
}

function getMondayTime(date: Date): number {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);

  const dayOfWeek = normalized.getDay();
  const mondayBasedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  normalized.setDate(normalized.getDate() - mondayBasedToday);

  return normalized.getTime();
}

function roundToTrainingWeight(weight: number): number {
  return Math.round(weight / 2.5) * 2.5;
}

function scaleSets(sets: BulkTrainingSet[], multiplier: number): BulkTrainingSet[] {
  const targetCount = Math.max(1, Math.round(sets.length * multiplier));
  return sets.slice(0, targetCount).map((set, index) => ({
    ...set,
    set_number: index + 1,
  }));
}

export function applyProgression(plan: BulkTrainingDay[], config: ProgressionConfig): BulkTrainingDay[] {
  if (plan.length === 0) return plan;

  const firstWeekStart = getMondayTime(new Date(plan[0].date));

  return plan.map(day => {
    const dayWeekStart = getMondayTime(new Date(day.date));
    const calendarWeekOffset = Math.max(0, Math.floor((dayWeekStart - firstWeekStart) / (7 * 24 * 60 * 60 * 1000)));
    const weekIndex = (config.startWeekIndex ?? 0) + calendarWeekOffset;
    const cycleWeek = getCycleWeek(weekIndex);
    const volumeMultiplier = getVolumeMultiplier(cycleWeek);
    const weightMultiplier = getWeightMultiplier(cycleWeek);

    return {
      ...day,
      intensity: getIntensity(cycleWeek, config.goal),
      exercises: day.exercises.map(exercise => ({
        ...exercise,
        sets: scaleSets(exercise.sets, volumeMultiplier).map(set => ({
          ...set,
          target_weight: set.target_weight === null
            ? null
            : roundToTrainingWeight(set.target_weight * weightMultiplier),
        })),
      })),
    };
  });
}

export function progressionEngine(startWeekIndex = 0): ProgressionPlan {
  return {
    enabled: true,
    cycleLength: CYCLE_LENGTH,
    deloadWeek: DELOAD_WEEK,
    startWeekIndex,
  };
}
