import { getExtendedCoreExerciseById } from '@/data/exercisesExtended';
import type { SmartTrainingProgram } from '@/lib/smartPlanGenerator';
import { MUSCLE_GROUPS, MUSCLE_GROUP_PARENT, RECOMMENDED_VOLUME_WEEKLY, type MuscleGroup } from '@/types/training';

const BIAS_DAMPING = 0.6;
const MAX_BIAS = 0.5;

export const MUSCLE_VOLUME_LIMITS: Partial<Record<MuscleGroup, { min: number; max: number }>> = {
  chest: { min: 8, max: 18 },
  back: { min: 8, max: 20 },
  quadriceps: { min: 8, max: 18 },
  hamstrings: { min: 6, max: 16 },
  glutes: { min: 6, max: 16 },
  shoulders: { min: 6, max: 16 },
  biceps: { min: 4, max: 14 },
  triceps: { min: 4, max: 14 },
  core: { min: 4, max: 12 },
};


export function getMuscleVolumeLimit(muscleGroup: MuscleGroup): { min: number; max: number } {
  return MUSCLE_VOLUME_LIMITS[muscleGroup]
    ?? MUSCLE_VOLUME_LIMITS[MUSCLE_GROUP_PARENT[muscleGroup]]
    ?? RECOMMENDED_VOLUME_WEEKLY[muscleGroup]
    ?? RECOMMENDED_VOLUME_WEEKLY[MUSCLE_GROUP_PARENT[muscleGroup]];
}

export type VolumeBias = Partial<Record<MuscleGroup, number>>;

export interface VolumeBalancerOptions {
  recentExerciseIds?: string[];
}

export interface VolumeBalancerResult {
  volumeByMuscle: Partial<Record<MuscleGroup, number>>;
  bias: VolumeBias;
}

function getMuscleRoleMultiplier(exerciseId: string, muscleGroup: MuscleGroup): number {
  const extendedExercise = getExtendedCoreExerciseById(exerciseId);
  if (!extendedExercise) return 1;

  if (extendedExercise.muscles.primary.includes(muscleGroup)) return 1;
  if (extendedExercise.muscles.secondary.includes(muscleGroup)) return 0.5;
  return 0.25;
}

function getCycleWeeks(program: SmartTrainingProgram): number {
  return Math.max(1, Math.round(program.sessions.length / Math.max(1, program.weeklyTrainings)));
}

function getRecentlyUsedMuscles(recentExerciseIds: string[] = []): Set<MuscleGroup> {
  const muscles = new Set<MuscleGroup>();

  for (const exerciseId of recentExerciseIds.slice(-12)) {
    const extendedExercise = getExtendedCoreExerciseById(exerciseId);
    if (!extendedExercise) continue;

    extendedExercise.muscles.primary.forEach(muscle => muscles.add(muscle));
  }

  return muscles;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateMuscleVolume(program: SmartTrainingProgram): Partial<Record<MuscleGroup, number>> {
  const volumeByMuscle: Partial<Record<MuscleGroup, number>> = {};
  const cycleWeeks = getCycleWeeks(program);

  for (const session of program.sessions) {
    for (const exercise of session.exercises) {
      const extendedExercise = getExtendedCoreExerciseById(exercise.exerciseId);
      if (!extendedExercise) continue;

      for (const [muscleGroup, loadShare] of Object.entries(extendedExercise.loadProfile)) {
        const muscle = muscleGroup as MuscleGroup;
        const roleMultiplier = getMuscleRoleMultiplier(exercise.exerciseId, muscle);
        volumeByMuscle[muscle] = (volumeByMuscle[muscle] ?? 0) + (exercise.sets * (loadShare ?? 0) * roleMultiplier) / cycleWeeks;
      }
    }
  }

  return volumeByMuscle;
}

export function volumeBalancer(program: SmartTrainingProgram, options: VolumeBalancerOptions = {}): VolumeBalancerResult {
  const volumeByMuscle = calculateMuscleVolume(program);
  const bias: VolumeBias = {};
  const recentlyUsedMuscles = getRecentlyUsedMuscles(options.recentExerciseIds);

  for (const muscleGroup of MUSCLE_GROUPS) {
    const limits = getMuscleVolumeLimit(muscleGroup);
    const volume = volumeByMuscle[muscleGroup] ?? 0;
    const recoveryMultiplier = recentlyUsedMuscles.has(muscleGroup) ? 0.5 : 1;

    if (volume < limits.min) {
      const deficitRatio = (limits.min - volume) / limits.min;
      bias[muscleGroup] = clamp(deficitRatio * BIAS_DAMPING * recoveryMultiplier, 0, MAX_BIAS);
      continue;
    }

    if (volume > limits.max) {
      const overloadRatio = (volume - limits.max) / limits.max;
      bias[muscleGroup] = -clamp(overloadRatio * BIAS_DAMPING, 0, MAX_BIAS);
    }
  }

  return {
    volumeByMuscle,
    bias,
  };
}
