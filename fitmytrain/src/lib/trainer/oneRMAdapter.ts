import type { OneRMPlan } from './types';
import type { PersonalMax } from '@/types/training';
import { calculateWeightFromPM, getExerciseCoefficient } from '@/lib/weightConversion';

export function oneRMAdapter(personalMaxes: PersonalMax[] = []): OneRMPlan {
  return { personalMaxes };
}

export function getTargetWeightFromOneRM(plan: OneRMPlan, exerciseId: string, percentPM?: string): number | null {
  if (!percentPM) return null;

  const coefficient = getExerciseCoefficient(exerciseId);
  const baseExerciseId = coefficient?.baseExercise ?? exerciseId;
  const personalMax = plan.personalMaxes.find(pm =>
    pm.exerciseId === exerciseId || pm.exerciseId === baseExerciseId
  );

  if (!personalMax) return null;

  const match = percentPM.match(/(\d+)[–-](\d+)/);
  if (!match) return null;

  const minPercent = Number(match[1]);
  const maxPercent = Number(match[2]);
  const averagePercent = (minPercent + maxPercent) / 2;

  return calculateWeightFromPM(exerciseId, personalMax.calculatedPM, averagePercent / 100);
}
