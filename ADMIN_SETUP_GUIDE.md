# Admin Authentication Setup Guide

Your restaurant website admin authentication requires proper setup in Supabase. Follow these steps to fix the login issue.

## Problem Summary
The admin login is failing because:
1. The admin account might not exist in Supabase Authentication
2. OR the account exists but doesn't have the 'admin' role assigned in the database

## Step-by-Step Solution

### Step 1: Check Supabase Project
1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project: **lacxafvxgsowdoczpbuw**
3. Navigate to **Authentication** > **Users**

### Step 2: Create Admin Account (if it doesn't exist)
If you don't see `admin@restaurant.com` in the users list:

1. Click **"Add user"**
2. Enter:
   - **Email**: `admin@restaurant.com`
   - **Password**: `admin123`
3. Click **"Create user"**
4. Note the user's **UUID** (you'll need it next)

### Step 3: Assign Admin Role
If the admin account exists but login still fails:

1. Navigate to **SQL Editor**
2. Run this command (replace `<USER_ID>` with the actual UUID from Step 2):

```sql
-- First, remove any existing roles for this user
DELETE FROM public.user_roles 
WHERE user_id = '<USER_ID>';

-- Then add the admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('<USER_ID>', 'admin');
```

### Step 4: Verify Setup
1. Go back to your app at `/login`
2. Click **"Auto-fill Demo Credentials"** to fill in: `admin@restaurant.com` / `admin123`
3. Click **Sign In**
4. You should now have access to the **Admin Dashboard** at `/admin`

## Troubleshooting

### Login succeeds but can't access Admin Dashboard
This means the user is authenticated but doesn't have the admin role:
- Go to Supabase SQL Editor and run the commands in Step 3
- Make sure you're using the correct USER_ID (UUID)

### Still can't log in
1. Check that the Supabase environment variables are set:
   - `VITE_SUPABASE_URL` should be set in your dev server
   - `VITE_SUPABASE_PUBLISHABLE_KEY` should be set
2. Try creating a new account first through the signup page
3. Then follow Step 3 to assign it the admin role

### Email Verification Issues
By default, Supabase may require email verification. If you need to bypass this:
1. Go to **Authentication** > **Providers** > **Email**
2. Toggle off **"Confirm email"** (for development only)

## Admin Account Requirements

An admin account needs:
- ✅ Valid email in `auth.users` table (created via Supabase)
- ✅ Valid password (created via Supabase)
- ✅ Entry in `user_roles` table with `role = 'admin'`
- ✅ Entry in `profiles` table with their information

The trigger `handle_new_user()` automatically creates the profile and user_roles entry when a new user signs up.

## Admin Dashboard Access

Once logged in as admin, you can access:
- **URL**: `/admin`
- **Features**: 
  - Manage dishes
  - Manage tables
  - Approve/reject reviews
  - Manage FAQs
  - View and update orders
  - View reservations
  - View all users

## Future: Automated Admin Creation

To make admin creation automated in the future, consider:
1. Creating a server-side endpoint with Supabase service role key
2. Adding an admin UI to manage user roles
3. Setting up automated tests that verify admin access

## Need Help?

- Check the recent migrations in `supabase/migrations/`
- Verify your Supabase project is properly connected
- Review the auth flow in `src/context/AuthContext.tsx`
