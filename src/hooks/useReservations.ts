import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Database } from '@/integrations/supabase/types';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];

export function useReservations() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select(`
          *,
          restaurant_tables (
            table_number,
            total_seats
          )
        `)
        .order('reservation_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservation: ReservationInsert) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useTableAvailability(date: string, time: string) {
  return useQuery({
    queryKey: ['table_availability', date, time],
    queryFn: async () => {
      // Get all tables
      const { data: tables, error: tablesError } = await supabase
        .from('restaurant_tables')
        .select('*')
        .eq('is_available', true);
      
      if (tablesError) throw tablesError;

      // Get reservations for the given date
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select('table_id, party_size')
        .eq('reservation_date', date)
        .neq('status', 'cancelled');
      
      if (reservationsError) throw reservationsError;

      // Calculate booked seats per table
      const bookedSeatsMap = new Map<string, number>();
      reservations?.forEach(r => {
        const current = bookedSeatsMap.get(r.table_id) || 0;
        bookedSeatsMap.set(r.table_id, current + r.party_size);
      });

      // Return tables with availability info
      return tables?.map(table => ({
        ...table,
        booked_seats: bookedSeatsMap.get(table.id) || 0,
        available_seats: table.total_seats - (bookedSeatsMap.get(table.id) || 0),
      }));
    },
    enabled: !!date,
  });
}
