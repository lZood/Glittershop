-- Fix missing updated_at columns that cause trigger errors

-- 1. Ensure product_variants has updated_at
ALTER TABLE public.product_variants 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Ensure product_images has updated_at (just in case)
ALTER TABLE public.product_images 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
