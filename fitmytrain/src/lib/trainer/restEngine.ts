import { getExerciseMetadata } from '@/data/exerciseMetadata';
import type { BulkTrainingDay, RestPlan } from './types';
import type { TrainingGoal } from '@/types/training';

const REST_BY_CATEGORY = {
  compound: 105,
  semi_compound: 90,
  isolation: 60,
  activation: 45,
} as const;

function getGoalRestMultiplier(goal: TrainingGoal): number {
  if (goal === 'muscle_gain') return 1.2;
  if (goal === 'cutting') return 0.8;
  return 1;
}

function roundRest(seconds: number): number {
  return Math.round(seconds / 5) * 5;
}

export function applyRestPlan(plan: BulkTrainingDay[], goal: TrainingGoal): BulkTrainingDay[] {
  const goalMultiplier = getGoalRestMultiplier(goal);

  return plan.map(day => ({
    ...day,
    exercises: day.exercises.map(exercise => {
      const category = getExerciseMetadata(exercise.exercise_id)?.category ?? 'isolation';
      const baseRest = REST_BY_CATEGORY[category];
      const targetRest = roundRest(baseRest * goalMultiplier);

      return {
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          target_rest_seconds: targetRest,
        })),
      };
    }),
  }));
}

export function restEngine(): RestPlan {
  return { enabled: true };
}
