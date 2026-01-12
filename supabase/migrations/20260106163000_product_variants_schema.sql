-- Migration: 20260106163000_product_variants_schema.sql

-- 0.0 Ensure base tables exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  dob DATE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure categories RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);


-- 0. Ensure helper function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role
    FROM public.profiles
    WHERE id = (auth.jwt() ->> 'sub')::uuid
  ) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Update 'products' table with new fields
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2),
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS size_guide_type TEXT DEFAULT 'none',
ADD COLUMN IF NOT EXISTS care_instructions TEXT,
ADD COLUMN IF NOT EXISTS video TEXT;

-- Index for slug lookups (critical for performance)
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);

-- 2. Create 'product_variants' table
CREATE TABLE IF NOT EXISTS public.product_variants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    color TEXT,
    size TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for product_id to speed up variant fetch
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants (product_id);

-- Enable RLS for variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Policies for product_variants (mirroring products/categories usually)
-- Allow anyone to read active variants (public access)
CREATE POLICY "Allow public read access to variants"
ON public.product_variants
FOR SELECT
USING (true);

-- Allow admins to manage variants
CREATE POLICY "Allow admin to manage variants"
ON public.product_variants
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- 3. Update 'product_images' table
CREATE TABLE IF NOT EXISTS public.product_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    color TEXT, -- Added directly in creation if new
    storage_path TEXT
);

-- Ensure columns exist if table already existed but without them
ALTER TABLE public.product_images
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- Update RLS for product_images (if needed, assuming existing ones cover general access, but ensure admin can update)
-- Existing policies might be "Allow admin to manage..." which covers the new columns.

-- 4. Trigger for updated_at on product_variants
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
