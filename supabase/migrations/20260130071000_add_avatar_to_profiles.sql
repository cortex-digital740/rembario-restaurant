-- Add avatar_url column to profiles table for profile pictures
ALTER TABLE public.profiles
ADD COLUMN avatar_url TEXT;

-- Create an index on avatar_url for faster queries
CREATE INDEX idx_profiles_avatar_url ON public.profiles(avatar_url) WHERE avatar_url IS NOT NULL;
