import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface WeightLog {
  id: string;
  user_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  logged_at: string;
  created_at: string;
  is_confirmed: boolean;
}

export function useWeightLogs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const weightLogsQuery = useQuery({
    queryKey: ['weight-logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });
      
      if (error) throw error;
      return data as WeightLog[];
    },
    enabled: !!user,
  });

  const logWeight = useMutation({
    mutationFn: async (log: { 
      exercise_id: string; 
      weight: number; 
      reps: number;
      logged_at?: string;
      is_confirmed?: boolean;
      rir?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: user.id,
          exercise_id: log.exercise_id,
          weight: log.weight,
          reps: log.reps,
          logged_at: log.logged_at || new Date().toISOString().split('T')[0],
          is_confirmed: log.is_confirmed ?? false,
          rir: log.rir ?? null,
        } as any)
        .select()
        .single();

      if (error) throw error;
      return data as WeightLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weight-logs', user?.id] });
    },
  });

  const confirmLogsByDate = async (loggedAt: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('weight_logs')
      .update({ is_confirmed: true } as any)
      .eq('user_id', user.id)
      .eq('logged_at', loggedAt)
      .eq('is_confirmed', false);
    
    if (error) throw error;
    queryClient.invalidateQueries({ queryKey: ['weight-logs', user?.id] });
  };

  const getLogsForExercise = (exerciseId: string): WeightLog[] => {
    const data = weightLogsQuery.data;
    if (!data) return [];
    return data
      .filter(log => log.exercise_id === exerciseId)
      .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());
  };

  const getConfirmedLogsForExercise = (exerciseId: string): WeightLog[] => {
    const data = weightLogsQuery.data;
    if (!data) return [];
    return data
      .filter(log => log.exercise_id === exerciseId && log.is_confirmed)
      .sort((a, b) => new Date(a.logged_at).getTime() - new Date(b.logged_at).getTime());
  };

  const getLastLoggedWeight = (exerciseId: string): number | null => {
    const logs = getLogsForExercise(exerciseId);
    if (logs.length === 0) return null;
    return logs[logs.length - 1].weight;
  };

  const getExercisesWithLogs = (): string[] => {
    const data = weightLogsQuery.data;
    if (!data) return [];
    // Only return exercises with confirmed logs
    return [...new Set(data.filter(log => log.is_confirmed).map(log => log.exercise_id))];
  };

  return {
    weightLogs: weightLogsQuery.data || [],
    isLoading: weightLogsQuery.isLoading,
    error: weightLogsQuery.error,
    logWeight: logWeight.mutateAsync,
    getLogsForExercise,
    getConfirmedLogsForExercise,
    getLastLoggedWeight,
    getExercisesWithLogs,
    confirmLogsByDate,
    isLogging: logWeight.isPending,
  };
}
