import type { WeekDay } from '@/data/trainingPrograms';
import type { FrequencyPlan, TrainerUser } from './types';

const DAY_ORDER: Record<WeekDay, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function frequencyEngine(user: TrainerUser, availableDays: WeekDay[]): FrequencyPlan {
  const selectedDays = [...availableDays].sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);

  return {
    weeklyTrainings: selectedDays.length || user.weeklyTrainings || 3,
    selectedDays,
  };
}

export { DAY_ORDER };
