import type { SplitPlan, TrainerUser } from './types';

export function splitEngine(user: TrainerUser, weeklyTrainings: number): SplitPlan {
  if (user.experience === 'beginner' || weeklyTrainings <= 3) {
    return { splitType: 'full_body' };
  }

  if (weeklyTrainings <= 4) {
    return { splitType: 'upper_lower' };
  }

  return { splitType: 'ppl' };
}
