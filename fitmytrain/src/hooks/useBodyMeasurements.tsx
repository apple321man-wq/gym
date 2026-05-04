import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BodyMeasurement {
  id: string;
  user_id: string;
  measured_at: string;
  weight: number | null;
  body_fat: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps_left: number | null;
  biceps_right: number | null;
  thigh_left: number | null;
  thigh_right: number | null;
  notes: string | null;
  created_at: string;
}

export type BodyMeasurementInsert = Omit<BodyMeasurement, 'id' | 'user_id' | 'created_at'>;

export function useBodyMeasurements() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const measurementsQuery = useQuery({
    queryKey: ['body-measurements', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('measured_at', { ascending: false });
      
      if (error) throw error;
      return data as BodyMeasurement[];
    },
    enabled: !!user,
  });

  const addMeasurement = useMutation({
    mutationFn: async (measurement: BodyMeasurementInsert) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('body_measurements')
        .insert({
          ...measurement,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as BodyMeasurement;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements', user?.id] });
    },
  });

  const deleteMeasurement = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['body-measurements', user?.id] });
    },
  });

  return {
    measurements: measurementsQuery.data || [],
    isLoading: measurementsQuery.isLoading,
    error: measurementsQuery.error,
    addMeasurement: addMeasurement.mutateAsync,
    deleteMeasurement: deleteMeasurement.mutateAsync,
    isAdding: addMeasurement.isPending,
  };
}
