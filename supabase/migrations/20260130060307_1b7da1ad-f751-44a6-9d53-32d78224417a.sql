-- Fix profiles table phone exposure by separating policies
-- Drop the existing combined policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create a policy for users to view ONLY their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a separate permissive policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (public.is_admin());