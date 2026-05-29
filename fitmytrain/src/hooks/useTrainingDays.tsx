import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { calculatePM } from '@/lib/calculations';
import { calculateBodyweightReps, calculateWeightFromPM, getExerciseCoefficient, getExerciseWeightLoadUnit } from '@/lib/weightConversion';

export interface TrainingDay {
  id: string;
  user_id: string;
  date: string;
  name: string;
  intensity: 'easy' | 'medium' | 'hard';
  is_completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlannedExercise {
  id: string;
  training_day_id: string;
  exercise_id: string;
  exercise_name: string;
  order_index: number;
  created_at: string;
}

export interface ExerciseSet {
  id: string;
  planned_exercise_id: string;
  set_number: number;
  target_reps: number;
  target_weight: number | null;
  actual_reps: number | null;
  actual_weight: number | null;
  is_completed: boolean;
  created_at: string;
}

export interface TrainingDayWithExercises extends TrainingDay {
  planned_exercises: (PlannedExercise & {
    exercise_sets: ExerciseSet[];
  })[];
}

type PersonalMaxForRecalculation = {
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number | null;
};

const INTENSITY_MULTIPLIERS: Record<'easy' | 'medium' | 'hard', number> = {
  easy: 0.675,
  medium: 0.75,
  hard: 0.825,
};

function findPersonalMaxForExercise(
  exerciseId: string,
  personalMaxes: PersonalMaxForRecalculation[]
): PersonalMaxForRecalculation | null {
  const direct = personalMaxes.find(pm => pm.exercise_id === exerciseId);
  if (direct) return direct;

  const baseExercise = getExerciseCoefficient(exerciseId)?.baseExercise;
  if (!baseExercise) return null;

  return personalMaxes.find(pm => pm.exercise_id === baseExercise) ?? null;
}

function shouldRecalculateForBodyweight(exerciseId: string): boolean {
  const loadUnit = getExerciseWeightLoadUnit(exerciseId);
  return loadUnit === 'bodyweight' || loadUnit === 'added_bodyweight' || loadUnit === 'assistance';
}

export function useTrainingDays() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all training days for a month
  const useTrainingDaysForMonth = (year: number, month: number) => {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    return useQuery({
      queryKey: ['training-days', user?.id, year, month],
      queryFn: async () => {
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('training_days')
          .select(`
            *,
            planned_exercises (
              *,
              exercise_sets (*)
            )
          `)
          .eq('user_id', user.id)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: true });
        
        if (error) throw error;
        return data as TrainingDayWithExercises[];
      },
      enabled: !!user,
    });
  };

  // Fetch all training days for analytics (no date filter, loads all user data)
  const useAllTrainingDays = () => {
    return useQuery({
      queryKey: ['training-days-all', user?.id],
      queryFn: async () => {
        if (!user) return [];
        
        const { data, error } = await supabase
          .from('training_days')
          .select(`
            *,
            planned_exercises (
              *,
              exercise_sets (*)
            )
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        
        if (error) throw error;
        return data as TrainingDayWithExercises[];
      },
      enabled: !!user,
    });
  };

  // Fetch a single training day
  const useTrainingDay = (date: string) => {
    return useQuery({
      queryKey: ['training-day', user?.id, date],
      queryFn: async () => {
        if (!user) return null;
        
        const { data, error } = await supabase
          .from('training_days')
          .select(`
            *,
            planned_exercises (
              *,
              exercise_sets (*)
            )
          `)
          .eq('user_id', user.id)
          .eq('date', date)
          .maybeSingle();
        
        if (error) throw error;
        return data as TrainingDayWithExercises | null;
      },
      enabled: !!user && !!date,
    });
  };

  // Create training day with exercises
  const createTrainingDay = useMutation({
    mutationFn: async (data: {
      date: string;
      name: string;
      intensity: 'easy' | 'medium' | 'hard';
      exercises: {
        exercise_id: string;
        exercise_name: string;
        order_index: number;
        sets: {
          set_number: number;
          target_reps: number;
          target_weight: number | null;
        }[];
      }[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Create training day
      const { data: trainingDay, error: dayError } = await supabase
        .from('training_days')
        .insert({
          user_id: user.id,
          date: data.date,
          name: data.name,
          intensity: data.intensity,
        })
        .select()
        .single();

      if (dayError) throw dayError;

      // Create exercises
      for (const exercise of data.exercises) {
        const { data: plannedExercise, error: exerciseError } = await supabase
          .from('planned_exercises')
          .insert({
            training_day_id: trainingDay.id,
            exercise_id: exercise.exercise_id,
            exercise_name: exercise.exercise_name,
            order_index: exercise.order_index,
          })
          .select()
          .single();

        if (exerciseError) throw exerciseError;

        // Create sets
        if (exercise.sets.length > 0) {
          const { error: setsError } = await supabase
            .from('exercise_sets')
            .insert(
              exercise.sets.map(set => ({
                planned_exercise_id: plannedExercise.id,
                set_number: set.set_number,
                target_reps: set.target_reps,
                target_weight: set.target_weight,
              }))
            );

          if (setsError) throw setsError;
        }
      }

      return trainingDay;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
    },
  });

  // Update training day completion
  const updateTrainingDay = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TrainingDay> & { id: string }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('training_days')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
      queryClient.invalidateQueries({ queryKey: ['training-day'] });
    },
  });

  // Update planned exercise (e.g., when replacing an exercise)
  const updatePlannedExercise = useMutation({
    mutationFn: async ({ id, exercise_id, exercise_name }: { id: string; exercise_id: string; exercise_name: string }) => {
      const { data, error } = await supabase
        .from('planned_exercises')
        .update({ exercise_id, exercise_name })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
      queryClient.invalidateQueries({ queryKey: ['training-day'] });
    },
  });

  // Update exercise set
  const updateExerciseSet = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExerciseSet> & { id: string }) => {
      const { data, error } = await supabase
        .from('exercise_sets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
      queryClient.invalidateQueries({ queryKey: ['training-day'] });
    },
  });

  // Bulk create training days with exercises and sets (batch insert)
  const bulkCreateTrainingDays = useMutation({
    mutationFn: async (days: {
      date: string;
      name: string;
      intensity: 'easy' | 'medium' | 'hard';
      exercises: {
        exercise_id: string;
        exercise_name: string;
        order_index: number;
        sets: {
          set_number: number;
          target_reps: number;
          target_weight: number | null;
        }[];
      }[];
    }[]) => {
      if (!user) throw new Error('Not authenticated');

      // Step 1: Batch insert all training days
      const { data: createdDays, error: daysError } = await supabase
        .from('training_days')
        .insert(days.map(d => ({
          user_id: user.id,
          date: d.date,
          name: d.name,
          intensity: d.intensity,
        })))
        .select();

      if (daysError) throw daysError;
      if (!createdDays) throw new Error('No days created');

      // Sort created days by date to match input order
      const sortedCreatedDays = [...createdDays].sort((a, b) => a.date.localeCompare(b.date));
      const sortedInputDays = [...days].sort((a, b) => a.date.localeCompare(b.date));

      // Step 2: Batch insert all exercises
      const exerciseInserts: { training_day_id: string; exercise_id: string; exercise_name: string; order_index: number; _dayIdx: number; _exIdx: number }[] = [];
      sortedInputDays.forEach((day, dayIdx) => {
        day.exercises.forEach((ex, exIdx) => {
          exerciseInserts.push({
            training_day_id: sortedCreatedDays[dayIdx].id,
            exercise_id: ex.exercise_id,
            exercise_name: ex.exercise_name,
            order_index: ex.order_index,
            _dayIdx: dayIdx,
            _exIdx: exIdx,
          });
        });
      });

      // Insert exercises in chunks of 500 to avoid payload limits
      const CHUNK_SIZE = 500;
      const allExercises: { id: string; training_day_id: string; order_index: number }[] = [];
      for (let i = 0; i < exerciseInserts.length; i += CHUNK_SIZE) {
        const chunk = exerciseInserts.slice(i, i + CHUNK_SIZE).map(({ _dayIdx, _exIdx, ...rest }) => rest);
        const { data: exData, error: exError } = await supabase
          .from('planned_exercises')
          .insert(chunk)
          .select('id, training_day_id, order_index');
        if (exError) throw exError;
        if (exData) allExercises.push(...exData);
      }

      // Step 3: Build sets mapping - match exercises by training_day_id + order_index
      const setInserts: { planned_exercise_id: string; set_number: number; target_reps: number; target_weight: number | null }[] = [];
      
      // Group created exercises by training_day_id and order_index
      const exerciseMap = new Map<string, string>(); // "dayId:orderIndex" -> exerciseId
      allExercises.forEach(ex => {
        exerciseMap.set(`${ex.training_day_id}:${ex.order_index}`, ex.id);
      });

      sortedInputDays.forEach((day, dayIdx) => {
        const dayId = sortedCreatedDays[dayIdx].id;
        
        day.exercises.forEach((inputEx) => {
          const createdExId = exerciseMap.get(`${dayId}:${inputEx.order_index}`);
          if (!createdExId) return;
          
          inputEx.sets.forEach(set => {
            setInserts.push({
              planned_exercise_id: createdExId,
              set_number: set.set_number,
              target_reps: set.target_reps,
              target_weight: set.target_weight,
            });
          });
        });
      });

      // Insert sets in chunks
      for (let i = 0; i < setInserts.length; i += CHUNK_SIZE) {
        const chunk = setInserts.slice(i, i + CHUNK_SIZE);
        const { error: setsError } = await supabase
          .from('exercise_sets')
          .insert(chunk);
        if (setsError) throw setsError;
      }

      return createdDays;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
    },
  });

  const recalculateFutureBodyweightLoads = useMutation({
    mutationFn: async ({
      bodyweight,
      personalMaxes,
    }: {
      bodyweight: number;
      personalMaxes: PersonalMaxForRecalculation[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];
      const { data: days, error } = await supabase
        .from('training_days')
        .select(`
          *,
          planned_exercises (
            *,
            exercise_sets (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .gte('date', today);

      if (error) throw error;

      const setUpdates: Promise<unknown>[] = [];

      (days as TrainingDayWithExercises[] | null)?.forEach(day => {
        day.planned_exercises.forEach(exercise => {
          if (!shouldRecalculateForBodyweight(exercise.exercise_id)) return;

          const pm = findPersonalMaxForExercise(exercise.exercise_id, personalMaxes);
          const coefficient = getExerciseCoefficient(exercise.exercise_id);
          const loadUnit = getExerciseWeightLoadUnit(exercise.exercise_id);
          const intensityMultiplier = INTENSITY_MULTIPLIERS[day.intensity];

          let targetWeight: number | null | undefined;
          let targetReps: number | null = null;

          if (pm && loadUnit !== 'bodyweight') {
            targetWeight = calculateWeightFromPM(
              exercise.exercise_id,
              pm.estimated_1rm ?? calculatePM(pm.weight, pm.reps),
              intensityMultiplier,
              bodyweight,
              pm.weight,
              pm.reps
            );
          } else if (loadUnit === 'bodyweight') {
            targetWeight = null;
          }

          if (pm && coefficient?.baseExercise === 'weighted-pull-ups') {
            targetReps = calculateBodyweightReps(
              exercise.exercise_id,
              pm.weight,
              pm.reps,
              bodyweight,
              day.intensity
            );
          }

          exercise.exercise_sets.forEach(set => {
            if (set.is_completed) return;

            const updates: Partial<ExerciseSet> = {};
            if (targetWeight !== undefined && set.target_weight !== targetWeight) {
              updates.target_weight = targetWeight;
            }
            if (targetReps !== null && set.target_reps !== targetReps) {
              updates.target_reps = targetReps;
            }

            if (Object.keys(updates).length === 0) return;

            setUpdates.push(
              supabase
                .from('exercise_sets')
                .update(updates)
                .eq('id', set.id)
            );
          });
        });
      });

      await Promise.all(setUpdates);
      return setUpdates.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
      queryClient.invalidateQueries({ queryKey: ['training-day'] });
    },
  });

  // Delete only future uncompleted training days (preserves completed history)
  const deleteFutureTrainingDays = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const today = new Date().toISOString().split('T')[0];

      // Delete only uncompleted training days from today onwards
      const { error } = await supabase
        .from('training_days')
        .delete()
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .gte('date', today);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-days'] });
    },
  });

  return {
    useTrainingDaysForMonth,
    useAllTrainingDays,
    useTrainingDay,
    createTrainingDay: createTrainingDay.mutateAsync,
    bulkCreateTrainingDays: bulkCreateTrainingDays.mutateAsync,
    updateTrainingDay: updateTrainingDay.mutateAsync,
    updatePlannedExercise: updatePlannedExercise.mutateAsync,
    updateExerciseSet: updateExerciseSet.mutateAsync,
    recalculateFutureBodyweightLoads: recalculateFutureBodyweightLoads.mutateAsync,
    deleteFutureTrainingDays: deleteFutureTrainingDays.mutateAsync,
    isCreating: createTrainingDay.isPending,
    isBulkCreating: bulkCreateTrainingDays.isPending,
    isRecalculatingBodyweightLoads: recalculateFutureBodyweightLoads.isPending,
  };
}
