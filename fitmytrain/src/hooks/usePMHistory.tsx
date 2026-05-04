import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface PMUpdateLog {
  id: string;
  user_id: string;
  exercise_id: string;
  old_1rm: number;
  new_1rm: number;
  reason: string;
  created_at: string;
}

export function usePMHistory() {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ['pm-update-log', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await (supabase as any)
        .from('pm_update_log')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data as PMUpdateLog[];
    },
    enabled: !!user,
  });

  const getHistoryForExercise = (exerciseId: string): PMUpdateLog[] => {
    return (query.data || []).filter(log => log.exercise_id === exerciseId);
  };

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    getHistoryForExercise,
  };
}
