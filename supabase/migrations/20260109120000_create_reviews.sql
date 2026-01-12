-- Migration: 20260109120000_create_reviews.sql

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    variant_sku TEXT, -- Link to specific purchase
    variant_color TEXT, -- Snapshot of variant details
    variant_size TEXT, 
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT,
    media_urls TEXT[] DEFAULT '{}',
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);

-- RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Public Read (Approved only)
CREATE POLICY "Public read approved reviews" ON public.reviews
FOR SELECT USING (is_approved = true);

-- 2. Authenticated Users Create
-- Allow users to insert if they are the user_id (handled by app logic, but good enforce)
CREATE POLICY "Users can create reviews" ON public.reviews
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON public.reviews
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- 4. Admins have full access
-- Read all (including unapproved)
CREATE POLICY "Admins read all reviews" ON public.reviews
FOR SELECT TO authenticated 
USING (public.is_admin());

-- Update/Delete
CREATE POLICY "Admins manage all reviews" ON public.reviews
FOR ALL TO authenticated 
USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
