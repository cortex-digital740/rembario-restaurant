-- Fix reservations table phone exposure by separating policies
-- Drop the existing combined SELECT policy
DROP POLICY IF EXISTS "Users can view own reservations, admins all" ON public.reservations;

-- Create a restrictive policy for users to view ONLY their own reservations
CREATE POLICY "Users can view own reservations"
ON public.reservations
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a separate permissive policy for admins to view all reservations
CREATE POLICY "Admins can view all reservations"
ON public.reservations
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (public.is_admin());