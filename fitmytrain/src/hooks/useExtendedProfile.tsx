import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { calculateAutoFatigue } from '@/lib/exerciseOrderingAlgorithm';
import { FatigueLevel, EquipmentType, InjuryArea } from '@/types/exercise-metadata';
import { MuscleGroup } from '@/types/training';

export function useFatigueLevel() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['fatigue-level', user?.id],
    queryFn: async (): Promise<FatigueLevel> => {
      if (!user) return 'low';

      // Get training history for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('training_days')
        .select('date, is_completed')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .lte('date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      const history = (data || []).map(d => ({
        date: d.date,
        completed: d.is_completed,
      }));

      return calculateAutoFatigue(history);
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export interface ExtendedProfile {
  injuries: InjuryArea[];
  priorityMuscles: MuscleGroup[];
  equipment: EquipmentType[];
}

export function useExtendedProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ['extended-profile', user?.id],
    queryFn: async (): Promise<ExtendedProfile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('injuries, priority_muscles, equipment')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        injuries: (data.injuries || []) as InjuryArea[],
        priorityMuscles: (data.priority_muscles || []) as MuscleGroup[],
        equipment: (data.equipment || ['barbell', 'dumbbells', 'machines', 'cables', 'bodyweight']) as EquipmentType[],
      };
    },
    enabled: !!user,
  });

  const updateExtendedProfile = useMutation({
    mutationFn: async (updates: Partial<ExtendedProfile>) => {
      if (!user) throw new Error('Not authenticated');

      const dbUpdates: Record<string, unknown> = {};
      if (updates.injuries !== undefined) {
        dbUpdates.injuries = updates.injuries;
      }
      if (updates.priorityMuscles !== undefined) {
        dbUpdates.priority_muscles = updates.priorityMuscles;
      }
      if (updates.equipment !== undefined) {
        dbUpdates.equipment = updates.equipment;
      }

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extended-profile', user?.id] });
      toast({
        title: 'Сохранено',
        description: 'Настройки профиля обновлены',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
      });
    },
  });

  return {
    extendedProfile: query.data,
    isLoading: query.isLoading,
    updateExtendedProfile: updateExtendedProfile.mutateAsync,
    isUpdating: updateExtendedProfile.isPending,
  };
}
