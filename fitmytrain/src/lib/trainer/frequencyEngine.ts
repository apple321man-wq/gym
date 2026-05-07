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

const DEFAULT_TRAINING_DAYS: WeekDay[] = ['monday', 'wednesday', 'friday', 'saturday', 'sunday'];

export function frequencyEngine(user: TrainerUser, availableDays: WeekDay[]): FrequencyPlan {
  const weeklyTrainings = availableDays.length || user.weeklyTrainings || 3;
  const sourceDays = availableDays.length > 0
    ? availableDays
    : DEFAULT_TRAINING_DAYS.slice(0, weeklyTrainings);
  const selectedDays = [...sourceDays].sort((a, b) => DAY_ORDER[a] - DAY_ORDER[b]);

  return {
    weeklyTrainings: selectedDays.length,
    selectedDays,
  };
}

export { DAY_ORDER };
