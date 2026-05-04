import type { OneRMPlan } from './types';
import type { PersonalMax } from '@/types/training';

export function oneRMAdapter(personalMaxes: PersonalMax[] = []): OneRMPlan {
  return { personalMaxes };
}

export function getTargetWeightFromOneRM(plan: OneRMPlan, exerciseId: string, percentPM?: string): number | null {
  const personalMax = plan.personalMaxes.find(pm => pm.exerciseId === exerciseId);
  if (!personalMax || !percentPM) return null;

  const match = percentPM.match(/(\d+)[–-](\d+)/);
  if (!match) return null;

  const minPercent = Number(match[1]);
  const maxPercent = Number(match[2]);
  const averagePercent = (minPercent + maxPercent) / 2;

  return Math.round((personalMax.calculatedPM * averagePercent / 100) / 2.5) * 2.5;
}
