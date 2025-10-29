-- supabase/migrations/20240730120000_initial_schema.sql

-- 1. Create profiles table to store user data
CREATE TABLE public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text UNIQUE,
  dob timestamp with time zone,
  role text DEFAULT 'user'
);
-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to everyone
CREATE POLICY "Allow public read access" ON public.profiles
  FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (((auth.jwt() ->> 'sub'::text))::uuid = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE USING (((auth.jwt() ->> 'sub'::text))::uuid = id) WITH CHECK (((auth.jwt() ->> 'sub'::text))::uuid = id);


-- 2. Create categories table
CREATE TABLE public.categories (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text
);
-- Set up RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage categories" ON public.categories FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = ((auth.jwt() ->> 'sub'::text))::uuid AND role = 'admin'
  ));


-- 3. Create collections table
CREATE TABLE public.collections (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text
);
-- Set up RLS for collections
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage collections" ON public.collections FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = ((auth.jwt() ->> 'sub'::text))::uuid AND role = 'admin'
  ));


-- 4. Create products table
CREATE TABLE public.products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  original_price numeric(10, 2),
  stock integer DEFAULT 0,
  category_id bigint REFERENCES public.categories(id),
  rating numeric(2, 1) DEFAULT 0.0,
  reviews_count integer DEFAULT 0,
  
  -- Detailed fields from product page
  materials text,
  dimensions text,
  care_instructions text,
  origin text,
  available_colors text[], -- Array to hold color variants
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);
-- Set up RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage products" ON public.products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = ((auth.jwt() ->> 'sub'::text))::uuid AND role = 'admin'
  ));


-- 5. Create product_images table for multiple images per product
CREATE TABLE public.product_images (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    display_order smallint DEFAULT 0
);
-- Set up RLS for product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage product images" ON public.product_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = ((auth.jwt() ->> 'sub'::text))::uuid AND role = 'admin'
  ));


-- 6. Create collection_products join table
CREATE TABLE public.collection_products (
  collection_id bigint NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);
-- Set up RLS for collection_products
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "Allow admin to manage collection products" ON public.collection_products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = ((auth.jwt() ->> 'sub'::text))::uuid AND role = 'admin'
  ));

-- Function to update the 'updated_at' column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update 'updated_at' on product update
CREATE TRIGGER on_product_update
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
