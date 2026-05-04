import { getExtendedCoreExerciseById } from '@/data/exercisesExtended';
import type { SmartTrainingProgram } from '@/lib/smartPlanGenerator';
import type { MuscleGroup } from '@/types/training';

const MUSCLE_LIMITS: Record<MuscleGroup, { min: number; max: number }> = {
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

export type VolumeBias = Partial<Record<MuscleGroup, number>>;

export interface VolumeBalancerResult {
  volumeByMuscle: Partial<Record<MuscleGroup, number>>;
  bias: VolumeBias;
}

export function calculateMuscleVolume(program: SmartTrainingProgram): Partial<Record<MuscleGroup, number>> {
  const volumeByMuscle: Partial<Record<MuscleGroup, number>> = {};

  for (const session of program.sessions) {
    for (const exercise of session.exercises) {
      const extendedExercise = getExtendedCoreExerciseById(exercise.exerciseId);
      if (!extendedExercise) continue;

      for (const [muscleGroup, loadShare] of Object.entries(extendedExercise.loadProfile)) {
        const muscle = muscleGroup as MuscleGroup;
        volumeByMuscle[muscle] = (volumeByMuscle[muscle] ?? 0) + exercise.sets * (loadShare ?? 0);
      }
    }
  }

  return volumeByMuscle;
}

export function volumeBalancer(program: SmartTrainingProgram): VolumeBalancerResult {
  const volumeByMuscle = calculateMuscleVolume(program);
  const bias: VolumeBias = {};

  for (const [muscle, limits] of Object.entries(MUSCLE_LIMITS)) {
    const muscleGroup = muscle as MuscleGroup;
    const volume = volumeByMuscle[muscleGroup] ?? 0;

    if (volume < limits.min) {
      bias[muscleGroup] = Math.min(24, Math.round((limits.min - volume) * 3));
      continue;
    }

    if (volume > limits.max) {
      bias[muscleGroup] = -Math.min(30, Math.round((volume - limits.max) * 4));
    }
  }

  return {
    volumeByMuscle,
    bias,
  };
}
