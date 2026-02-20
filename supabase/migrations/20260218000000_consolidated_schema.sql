-- Consolidated Migration Script
-- Generated: 2026-02-18
-- Description: Rebuilds the entire database schema, policies, storage, and triggers from scratch.
-- WARNING: This script drops existing tables. Run on a fresh or to-be-wiped database.

-- 0. Cleanup - EXPLICTLY DROP EVERYTHING FIRST
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.collection_products CASCADE;
DROP TABLE IF EXISTS public.product_images CASCADE;
DROP TABLE IF EXISTS public.product_variants CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.addresses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- 2. Tables (in dependency order)

-- 2.1 Profiles (Extends auth.users)
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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow individual user access to their own profile"
ON public.profiles FOR SELECT USING ((auth.jwt() ->> 'sub')::uuid = id);

CREATE POLICY "Allow users to insert their own profile"
ON public.profiles FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub')::uuid = id);

CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE USING ((auth.jwt() ->> 'sub')::uuid = id);

-- 3. Helper Functions (Now safe to create as profiles exists)

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function: Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$;

-- Function: Check if current user is admin
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

-- 4. Triggers for Profiles
-- Trigger: Sync User Email
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET email = NEW.email WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_email_trigger
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();

-- Trigger: Handle New User
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email, dob, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.email,
    (NEW.raw_user_meta_data ->> 'dob')::date,
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to categories"
ON public.categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow admin to insert categories"
ON public.categories FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Allow admin to update categories"
ON public.categories FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Allow admin to delete categories"
ON public.categories FOR DELETE TO authenticated USING (public.is_admin());

-- 4. Collections
CREATE TABLE IF NOT EXISTS public.collections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Collections"
ON public.collections FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can insert collections"
ON public.collections FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update collections"
ON public.collections FOR UPDATE TO authenticated USING (public.is_admin());

CREATE POLICY "Admins can delete collections"
ON public.collections FOR DELETE TO authenticated USING (public.is_admin());

-- 5. Products
CREATE TABLE IF NOT EXISTS public.products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  category_id BIGINT REFERENCES public.categories(id),
  collection_id BIGINT REFERENCES public.collections(id), -- legacy field
  slug TEXT UNIQUE,
  is_active BOOLEAN DEFAULT FALSE,
  cost_price NUMERIC(10, 2),
  tags TEXT[] DEFAULT '{}',
  size_guide_type TEXT DEFAULT 'none',
  care_instructions TEXT,
  video TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Active Products"
ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admin All Products"
ON public.products FOR ALL TO authenticated USING (public.is_admin());

-- 6. Product Variants
CREATE TABLE IF NOT EXISTS public.product_variants (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    color TEXT,
    size TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    price_adjustment NUMERIC(10, 2) DEFAULT 0,
    color_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants (product_id);
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Variants"
ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin All Variants"
ON public.product_variants FOR ALL TO authenticated USING (public.is_admin());

CREATE TRIGGER update_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. Product Images
CREATE TABLE IF NOT EXISTS public.product_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    color TEXT,
    storage_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Images"
ON public.product_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin All Images"
ON public.product_images FOR ALL TO authenticated USING (public.is_admin());

-- 8. Collection Products (Join Table)
CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id BIGINT REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cp_collection_id ON public.collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_cp_product_id ON public.collection_products(product_id);

ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collection products viewable by everyone"
ON public.collection_products FOR SELECT USING (true);

CREATE POLICY "Admins can manage collection products"
ON public.collection_products FOR ALL TO authenticated USING (public.is_admin());

-- 9. Addresses (With Mexican fields)
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  street TEXT NOT NULL, -- Calle
  exterior_number TEXT,
  interior_number TEXT,
  neighborhood TEXT, -- Colonia
  delivery_instructions TEXT, -- Referencias
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'MX' NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON public.addresses(user_id);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses"
ON public.addresses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
ON public.addresses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
ON public.addresses FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
ON public.addresses FOR DELETE USING (auth.uid() = user_id);

-- 10. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', 
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- TODO: Add specific policies for orders if user needs to read/create

-- 11. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 12. Reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    variant_sku TEXT, 
    variant_color TEXT,
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

CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read approved reviews" ON public.reviews
FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON public.reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.reviews
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all reviews" ON public.reviews
FOR ALL TO authenticated USING (public.is_admin());

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 13. Storage Configuration
-- Create 'products' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Drop existing to avoid conflicts during re-run
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Admin Access" ON storage.objects;

-- Public Read
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Authenticated Upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'products' );

-- Admins Manage (Update/Delete)
CREATE POLICY "Authenticated Admin Access"
ON storage.objects FOR ALL TO authenticated
USING ( bucket_id = 'products' AND public.is_admin() );

-- End of Script
