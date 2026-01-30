import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Review = Database['public']['Tables']['reviews']['Row'];

export type ReviewWithProfile = Review & {
  profiles?: { full_name: string; avatar_url?: string | null } | null;
};

export function useReviews(onlyApproved = true) {
  return useQuery({
    queryKey: ['reviews', onlyApproved],
    queryFn: async (): Promise<ReviewWithProfile[]> => {
      // Fetch reviews first
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (onlyApproved) {
        query = query.eq('status', 'approved');
      }
      
      const { data: reviews, error: reviewsError } = await query;
      
      if (reviewsError) throw reviewsError;
      if (!reviews || reviews.length === 0) return [];

      // Get unique user IDs from reviews
      const userIds = [...new Set(reviews.map(r => r.user_id))];
      
      // Fetch profiles for those users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('user_id', userIds);

      if (profilesError) {
        console.warn('Could not fetch profiles:', profilesError);
        // Return reviews without profile data
        return reviews.map(review => ({
          ...review,
          profiles: null,
        }));
      }

      // Create a map of user_id -> profile
      const profileMap = new Map(
        profiles?.map(p => [p.user_id, { full_name: p.full_name }]) || []
      );

      // Map reviews with their profiles
      return reviews.map(review => ({
        ...review,
        profiles: profileMap.get(review.user_id) || null,
      }));
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          rating,
          comment,
          status: 'pending',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { 
      id: string; 
      status: Database['public']['Enums']['review_status'];
    }) => {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
