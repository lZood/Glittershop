-- supabase/migrations/20240730120000_initial_schema.sql

-- 1. Create a table for public user profiles
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  dob timestamp with time zone,
  role text DEFAULT 'user', -- 'user' or 'admin'
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create tables for the e-commerce functionality
CREATE TABLE public.categories (
    id bigserial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories." ON public.categories FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);


CREATE TABLE public.collections (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    description text,
    hero_image_url text,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collections are viewable by everyone." ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admins can manage collections." ON public.collections FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

CREATE TABLE public.products (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    description text,
    price numeric(10, 2) NOT NULL,
    original_price numeric(10, 2),
    stock integer NOT NULL DEFAULT 0,
    
    category_id bigint REFERENCES public.categories(id),
    
    -- Product details
    materials text,
    sizes text,
    gems text,
    dimensions text,
    care_instructions text,
    origin text,
    available_colors text[], -- Array to store available colors/metals

    -- Rating
    rating numeric(2, 1) DEFAULT 0.0,
    reviews_count integer DEFAULT 0,
    
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products." ON public.products FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);


CREATE TABLE public.product_images (
    id bigserial PRIMARY KEY,
    product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url text NOT NULL,
    alt_text text,
    display_order integer DEFAULT 0, -- Use to order images, 0 for primary
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product images are viewable by everyone." ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage product images." ON public.product_images FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);


CREATE TABLE public.collection_products (
    collection_id bigint NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
    product_id bigint NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, product_id)
);
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Collection-product links are viewable by everyone." ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "Admins can manage collection-product links." ON public.collection_products FOR ALL USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Seed initial data
INSERT INTO public.categories (name) VALUES ('Anillos'), ('Collares'), ('Pulseras'), ('Aretes'), ('Broches');
INSERT INTO public.collections (name, description) VALUES 
('Luz de Luna', 'Capturando la magia del cielo nocturno.'),
('Verano Mediterráneo', 'La calidez del sol y la brisa del mar en cada joya.'),
('Geometría Urbana', 'Líneas limpias y diseños audaces para la ciudad.');

-- Set up Realtime!
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.product_images;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collection_products;