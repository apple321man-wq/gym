import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
  goal: 'muscle_gain' | 'cutting' | 'recomposition' | 'maintenance';
  experience: 'beginner' | 'intermediate' | 'advanced';
  weekly_trainings: number;
  selected_days: number[];
  created_at: string;
  updated_at: string;
  onboarding_completed?: boolean;
}

export type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
export type ProfileUpdate = Partial<Omit<ProfileInsert, 'user_id'>>;

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });

  const createProfile = useMutation({
    mutationFn: async (profile: Omit<ProfileInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось создать профиль',
      });
      if (import.meta.env.DEV) {
        console.error('Profile creation error:', error);
      }
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось обновить профиль',
      });
      if (import.meta.env.DEV) {
        console.error('Profile update error:', error);
      }
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    error: profileQuery.error,
    createProfile: createProfile.mutateAsync,
    updateProfile: updateProfile.mutateAsync,
    isCreating: createProfile.isPending,
    isUpdating: updateProfile.isPending,
  };
}
