import { getExtendedCoreExerciseById } from '@/data/exercisesExtended';
import type { GeneratedExercise, SmartTrainingProgram } from '@/lib/smartPlanGenerator';
import type { MuscleGroup } from '@/types/training';
import { calculateMuscleVolume, getMuscleVolumeLimit } from './volumeBalancer';

const MIN_SETS = 1;
const MAX_SETS = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getPrimaryMuscles(exercise: GeneratedExercise): MuscleGroup[] {
  return getExtendedCoreExerciseById(exercise.exerciseId)?.muscles.primary ?? [];
}

function getSetMultiplier(muscles: MuscleGroup[], volumeByMuscle: Partial<Record<MuscleGroup, number>>): number {
  if (muscles.length === 0) return 1;

  const multipliers = muscles.map(muscle => {
    const limits = getMuscleVolumeLimit(muscle);
    const volume = volumeByMuscle[muscle] ?? 0;

    if (volume > limits.max) return 0.9;
    if (volume < limits.min) return 1.1;
    return 1;
  });

  return multipliers.reduce((sum, value) => sum + value, 0) / multipliers.length;
}

export function volumeAdjuster(program: SmartTrainingProgram): SmartTrainingProgram {
  const volumeByMuscle = calculateMuscleVolume(program);

  return {
    ...program,
    sessions: program.sessions.map(session => ({
      ...session,
      exercises: session.exercises.map(exercise => {
        const primaryMuscles = getPrimaryMuscles(exercise);
        const multiplier = getSetMultiplier(primaryMuscles, volumeByMuscle);
        if (multiplier === 1) return exercise;

        const scaledSets = exercise.sets * multiplier;
        const nextSets = clamp(
          multiplier < 1 ? Math.floor(scaledSets) : Math.ceil(scaledSets),
          MIN_SETS,
          MAX_SETS
        );
        if (nextSets === exercise.sets) return exercise;

        return {
          ...exercise,
          sets: nextSets,
          isModified: true,
          notes: [exercise.notes, 'Объём скорректирован volumeAdjuster'].filter(Boolean).join(' · '),
        };
      }),
    })),
  };
}
