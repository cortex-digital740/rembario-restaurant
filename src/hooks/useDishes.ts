import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Dish = Database['public']['Tables']['dishes']['Row'];
type DishInsert = Database['public']['Tables']['dishes']['Insert'];
type DishUpdate = Database['public']['Tables']['dishes']['Update'];

export function useDishes() {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Dish[];
    },
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (dish: DishInsert) => {
      const { data, error } = await supabase
        .from('dishes')
        .insert(dish)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: DishUpdate }) => {
      const { data, error } = await supabase
        .from('dishes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dishes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });
}
