import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Faq = Database['public']['Tables']['faqs']['Row'];
type FaqInsert = Database['public']['Tables']['faqs']['Insert'];
type FaqUpdate = Database['public']['Tables']['faqs']['Update'];

export function useFaqs(onlyActive = true) {
  return useQuery({
    queryKey: ['faqs', onlyActive],
    queryFn: async () => {
      let query = supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (onlyActive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Faq[];
    },
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (faq: FaqInsert) => {
      const { data, error } = await supabase
        .from('faqs')
        .insert(faq)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FaqUpdate }) => {
      const { data, error } = await supabase
        .from('faqs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
    },
  });
}
