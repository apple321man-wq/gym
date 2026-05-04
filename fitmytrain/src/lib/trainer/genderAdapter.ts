import type { GenderPlan, TrainerUser } from './types';

export function genderAdapter(user: TrainerUser): GenderPlan {
  return { gender: user.gender };
}
