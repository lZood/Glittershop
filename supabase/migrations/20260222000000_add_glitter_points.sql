-- Migration: Add Glitter Points and Membership Tiers
-- Description: Adds points and tier columns to profiles table.

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS glitter_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'bronze' CHECK (membership_tier IN ('bronze', 'plata', 'oro'));

-- Add index for performance if we eventually query by tier
CREATE INDEX IF NOT EXISTS idx_profiles_membership_tier ON public.profiles(membership_tier);

-- Atomic function to increment points
CREATE OR REPLACE FUNCTION public.increment_glitter_points(p_user_id UUID, p_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET glitter_points = COALESCE(glitter_points, 0) + p_amount
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
