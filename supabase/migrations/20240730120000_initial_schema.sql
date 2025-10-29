-- supabase/migrations/20240730120000_initial_schema.sql

-- 1. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    dob DATE,
    role TEXT DEFAULT 'user' NOT NULL
);

-- 2. Create categories table
CREATE TABLE public.categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create collections table
CREATE TABLE public.collections (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL UNIQUE,
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
    stock INT DEFAULT 0,
    category_id BIGINT REFERENCES public.categories(id),
    rating NUMERIC(2, 1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    materials TEXT,
    sizes TEXT,
    gems TEXT,
    dimensions TEXT,
    care_instructions TEXT,
    origin TEXT,
    available_colors TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create product_images table
CREATE TABLE public.product_images (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. Create collection_products junction table
CREATE TABLE public.collection_products (
    collection_id BIGINT NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, product_id)
);

-- 7. Set up Row Level Security (RLS)
-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies
-- Profiles: Users can see their own profile, and authenticated users can create their own profile. Admins can see all.
CREATE POLICY "Allow individual read access" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to create their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow admin full access" ON public.profiles FOR ALL USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Public tables: Everyone can read categories, collections, and products.
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.product_images FOR SELECT USING (true);


-- Admin policies: Only admins can write to categories, collections, and products.
CREATE POLICY "Allow admin write access" ON public.categories FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin write access" ON public.collections FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin write access" ON public.products FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin write access" ON public.collection_products FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin write access" ON public.product_images FOR INSERT WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');


CREATE POLICY "Allow admin update access" ON public.categories FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin update access" ON public.collections FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin update access" ON public.products FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin update access" ON public.collection_products FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin update access" ON public.product_images FOR UPDATE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Allow admin delete access" ON public.categories FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin delete access" ON public.collections FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin delete access" ON public.products FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin delete access" ON public.collection_products FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Allow admin delete access" ON public.product_images FOR DELETE USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
