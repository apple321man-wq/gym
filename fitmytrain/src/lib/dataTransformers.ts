import { TrainingDayWithExercises } from '@/hooks/useTrainingDays';
import { TrainingDay as LocalTrainingDay } from '@/types/training';

/**
 * Transforms Supabase training day data to the local format used by calculations
 */
export function transformToLocalFormat(cloudDays: TrainingDayWithExercises[]): LocalTrainingDay[] {
  return cloudDays.map(day => ({
    id: day.id,
    userId: day.user_id,
    date: day.date,
    intensity: day.intensity,
    completed: day.is_completed,
    exercises: day.planned_exercises.map(pe => ({
      id: pe.id,
      exerciseId: pe.exercise_id,
      completed: pe.exercise_sets.every(s => s.is_completed),
      sets: pe.exercise_sets.map(set => ({
        id: set.id,
        setNumber: set.set_number,
        targetReps: set.target_reps,
        // NOTE: legacy LocalTrainingDay format requires a number; volume calculations
        // here only count sets, never aggregate weights — so the 0 fallback is safe.
        // For weight-aware logic always use weight_logs + isValidWeight from weightFormat.ts.
        targetWeight: set.target_weight ?? 0,
        completed: set.is_completed,
        actualReps: set.actual_reps ?? undefined,
        actualWeight: set.actual_weight ?? undefined,
      })),
    })),
    feedback: undefined,
  }));
}
