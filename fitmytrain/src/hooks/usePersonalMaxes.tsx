import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { EXERCISE_WEIGHT_COEFFICIENTS, BASE_PM_EXERCISES } from '@/lib/weightConversion';

export interface PersonalMax {
  id: string;
  user_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number | null;
  achieved_at: string;
  created_at: string;
  updated_at: string;
}

// Динамический маппинг: строится автоматически из EXERCISE_WEIGHT_COEFFICIENTS
function findBaseExerciseForPM(exerciseId: string): string | null {
  // Если это само базовое упражнение — вернуть его
  if ((BASE_PM_EXERCISES as readonly string[]).includes(exerciseId)) {
    return exerciseId;
  }
  const coef = EXERCISE_WEIGHT_COEFFICIENTS[exerciseId];
  if (coef) return coef.baseExercise;
  return null;
}

export function usePersonalMaxes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const personalMaxesQuery = useQuery({
    queryKey: ['personal-maxes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('personal_maxes')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });
      
      if (error) throw error;
      return data as PersonalMax[];
    },
    enabled: !!user,
  });

  const upsertPersonalMax = useMutation({
    mutationFn: async (pm: { 
      exercise_id: string; 
      weight: number; 
      reps: number;
      achieved_at?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Check if exists
      const { data: existing } = await supabase
        .from('personal_maxes')
        .select('id')
        .eq('user_id', user.id)
        .eq('exercise_id', pm.exercise_id)
        .maybeSingle();

      if (existing) {
        // Update
        const { data, error } = await supabase
          .from('personal_maxes')
          .update({
            weight: pm.weight,
            reps: pm.reps,
            achieved_at: pm.achieved_at || new Date().toISOString().split('T')[0],
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('personal_maxes')
          .insert({
            user_id: user.id,
            exercise_id: pm.exercise_id,
            weight: pm.weight,
            reps: pm.reps,
            achieved_at: pm.achieved_at || new Date().toISOString().split('T')[0],
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-maxes', user?.id] });
    },
  });

  // Получить ПМ для упражнения (с учётом маппинга базовых упражнений)
  const getPersonalMax = useCallback((exerciseId: string): PersonalMax | null => {
    const data = personalMaxesQuery.data;
    if (!data) return null;
    
    // Сначала ищем точное совпадение
    const directMatch = data.find(pm => pm.exercise_id === exerciseId);
    if (directMatch) return directMatch;
    
    // Если нет прямого совпадения, ищем базовое упражнение через маппинг
    const baseExerciseId = findBaseExerciseForPM(exerciseId);
    if (baseExerciseId) {
      return data.find(pm => pm.exercise_id === baseExerciseId) || null;
    }
    
    return null;
  }, [personalMaxesQuery.data]);

  return {
    personalMaxes: personalMaxesQuery.data || [],
    isLoading: personalMaxesQuery.isLoading,
    error: personalMaxesQuery.error,
    upsertPersonalMax: upsertPersonalMax.mutateAsync,
    getPersonalMax,
    isUpserting: upsertPersonalMax.isPending,
  };
}
