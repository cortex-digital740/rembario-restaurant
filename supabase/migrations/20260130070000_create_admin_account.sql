-- This migration ensures the admin account has the correct role
-- Note: The auth.users entry for admin@restaurant.com must be created through 
-- Supabase UI or the signup process first. This migration will add the admin role.

-- Step 1: Create or update admin user with admin role
-- This function handles the admin role assignment safely
CREATE OR REPLACE FUNCTION public.ensure_admin_role(admin_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID for the admin email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = admin_email
  LIMIT 1;

  -- If user exists, ensure they have admin role
  IF admin_user_id IS NOT NULL THEN
    -- First, delete any existing user role to avoid unique constraint violation
    DELETE FROM public.user_roles
    WHERE user_id = admin_user_id;

    -- Now insert the admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin');
  END IF;
END;
$$;

-- Step 2: Try to ensure admin role for the default admin email
SELECT public.ensure_admin_role('admin@restaurant.com');

-- Step 3: Clean up the helper function
DROP FUNCTION IF EXISTS public.ensure_admin_role(TEXT);
