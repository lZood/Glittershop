-- supabase/migrations/20240730120000_initial_schema.sql

-- 1. Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE,
  dob DATE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Ensure email in profiles is always in sync with auth.users
CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER sync_email_trigger
AFTER UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.sync_user_email();


-- 2. Create categories table
CREATE TABLE public.categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create collections table
CREATE TABLE public.collections (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create products table
CREATE TABLE public.products (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  category_id BIGINT REFERENCES public.categories(id),
  collection_id BIGINT REFERENCES public.collections(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create product_images table
CREATE TABLE public.product_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create orders table
CREATE TABLE public.orders (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- e.g., pending, paid, shipped, delivered, cancelled
    shipping_address JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create order_items table
CREATE TABLE public.order_items (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL
);

-- 8. Function to create a profile for a new user
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
    'user' -- Default role for new users
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Trigger to call the function on new user sign-up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 11. Create Policies for 'profiles' table
-- Allow users to see their own profile
CREATE POLICY "Allow individual user access to their own profile"
ON public.profiles
FOR SELECT
USING ((auth.jwt() ->> 'sub')::uuid = id);

-- Allow users to create their own profile
CREATE POLICY "Allow users to insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'sub')::uuid = id);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile"
ON public.profiles
FOR UPDATE
USING ((auth.jwt() ->> 'sub')::uuid = id);

-- 12. Create Policies for 'categories' table
-- Allow anyone authenticated to read categories
CREATE POLICY "Allow authenticated read access to categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

-- Helper function to check for admin role
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

-- Allow admins to insert new categories
CREATE POLICY "Allow admin to insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- Allow admins to update categories
CREATE POLICY "Allow admin to update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Allow admins to delete categories
CREATE POLICY "Allow admin to delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING (public.is_admin());



-- TODO: Add policies for other tables (collections, products, etc.) as needed.
-- For example, you'll need policies for admins to manage products, and for users to manage their own orders.
