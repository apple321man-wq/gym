import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type ModificationType = 
  | 'replace_exercise' 
  | 'add_exercise' 
  | 'delete_exercise' 
  | 'change_weight' 
  | 'change_sets';

export interface TrainingModification {
  id: string;
  user_id: string;
  training_day_name: string;
  modification_type: ModificationType;
  original_exercise_id: string | null;
  new_exercise_id: string | null;
  new_exercise_name: string | null;
  new_weight: number | null;
  new_sets_count: number | null;
  order_index: number | null;
  target_reps: number | null;
  created_at: string;
  is_active: boolean;
}

export interface CreateModificationParams {
  training_day_name: string;
  modification_type: ModificationType;
  original_exercise_id?: string;
  new_exercise_id?: string;
  new_exercise_name?: string;
  new_weight?: number;
  new_sets_count?: number;
  order_index?: number;
  target_reps?: number;
}

export function useTrainingModifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all active modifications for a specific training day name
  const useModificationsForDay = (dayName: string) => {
    return useQuery({
      queryKey: ['training-modifications', user?.id, dayName],
      queryFn: async () => {
        if (!user || !dayName) return [];
        
        const { data, error } = await supabase
          .from('training_modifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('training_day_name', dayName)
          .eq('is_active', true)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data as TrainingModification[];
      },
      enabled: !!user && !!dayName,
    });
  };

  // Fetch all modifications for the user (for analytics/history)
  const allModificationsQuery = useQuery({
    queryKey: ['training-modifications-all', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('training_modifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TrainingModification[];
    },
    enabled: !!user,
  });

  // Create a new modification
  const createModification = useMutation({
    mutationFn: async (params: CreateModificationParams) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('training_modifications')
        .insert({
          user_id: user.id,
          training_day_name: params.training_day_name,
          modification_type: params.modification_type,
          original_exercise_id: params.original_exercise_id || null,
          new_exercise_id: params.new_exercise_id || null,
          new_exercise_name: params.new_exercise_name || null,
          new_weight: params.new_weight || null,
          new_sets_count: params.new_sets_count || null,
          order_index: params.order_index || null,
          target_reps: params.target_reps || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['training-modifications', user?.id, variables.training_day_name] });
      queryClient.invalidateQueries({ queryKey: ['training-modifications-all', user?.id] });
    },
  });

  // Deactivate a modification (soft delete)
  const deactivateModification = useMutation({
    mutationFn: async (modificationId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('training_modifications')
        .update({ is_active: false })
        .eq('id', modificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modifications'] });
      queryClient.invalidateQueries({ queryKey: ['training-modifications-all'] });
    },
  });

  // Delete a modification permanently
  const deleteModification = useMutation({
    mutationFn: async (modificationId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('training_modifications')
        .delete()
        .eq('id', modificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modifications'] });
      queryClient.invalidateQueries({ queryKey: ['training-modifications-all'] });
    },
  });

  // Helper: Log exercise replacement
  const logExerciseReplacement = useCallback(async (
    dayName: string,
    originalExerciseId: string,
    newExerciseId: string,
    newExerciseName: string,
    newWeight?: number
  ) => {
    return createModification.mutateAsync({
      training_day_name: dayName,
      modification_type: 'replace_exercise',
      original_exercise_id: originalExerciseId,
      new_exercise_id: newExerciseId,
      new_exercise_name: newExerciseName,
      new_weight: newWeight,
    });
  }, [createModification]);

  // Helper: Log exercise addition
  const logExerciseAddition = useCallback(async (
    dayName: string,
    exerciseId: string,
    exerciseName: string,
    orderIndex: number,
    targetWeight?: number,
    targetReps?: number,
    setsCount?: number
  ) => {
    return createModification.mutateAsync({
      training_day_name: dayName,
      modification_type: 'add_exercise',
      new_exercise_id: exerciseId,
      new_exercise_name: exerciseName,
      order_index: orderIndex,
      new_weight: targetWeight,
      target_reps: targetReps,
      new_sets_count: setsCount,
    });
  }, [createModification]);

  // Helper: Log exercise deletion
  const logExerciseDeletion = useCallback(async (
    dayName: string,
    exerciseId: string
  ) => {
    return createModification.mutateAsync({
      training_day_name: dayName,
      modification_type: 'delete_exercise',
      original_exercise_id: exerciseId,
    });
  }, [createModification]);

  // Helper: Log weight change
  const logWeightChange = useCallback(async (
    dayName: string,
    exerciseId: string,
    newWeight: number
  ) => {
    return createModification.mutateAsync({
      training_day_name: dayName,
      modification_type: 'change_weight',
      original_exercise_id: exerciseId,
      new_weight: newWeight,
    });
  }, [createModification]);

  // Helper: Log sets count change
  const logSetsChange = useCallback(async (
    dayName: string,
    exerciseId: string,
    newSetsCount: number
  ) => {
    return createModification.mutateAsync({
      training_day_name: dayName,
      modification_type: 'change_sets',
      original_exercise_id: exerciseId,
      new_sets_count: newSetsCount,
    });
  }, [createModification]);

  return {
    useModificationsForDay,
    allModifications: allModificationsQuery.data || [],
    isLoadingAll: allModificationsQuery.isLoading,
    createModification: createModification.mutateAsync,
    deactivateModification: deactivateModification.mutateAsync,
    deleteModification: deleteModification.mutateAsync,
    // Convenience helpers
    logExerciseReplacement,
    logExerciseAddition,
    logExerciseDeletion,
    logWeightChange,
    logSetsChange,
    isLogging: createModification.isPending,
  };
}
