import type { TrainingGoal } from '@/types/training';
import type { GoalPlan } from './types';

export function goalAdapter(goal: TrainingGoal): GoalPlan {
  return { goal };
}
