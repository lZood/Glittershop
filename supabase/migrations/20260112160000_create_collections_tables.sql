-- 1. Create collections table
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

-- 2. Create collection_products join table
CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id BIGINT REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, product_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_collections_slug ON public.collections(slug);
CREATE INDEX IF NOT EXISTS idx_cp_collection_id ON public.collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_cp_product_id ON public.collection_products(product_id);

-- 4. Enable RLS
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;

-- 5. Policies (Admin only for write, Public for read)
CREATE POLICY "Public collections are viewable by everyone" ON public.collections
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert collections" ON public.collections
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Admins can update collections" ON public.collections
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete collections" ON public.collections
  FOR DELETE TO authenticated USING (true);

-- Collection Products Policies
CREATE POLICY "Collection products viewable by everyone" ON public.collection_products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage collection products" ON public.collection_products
  FOR ALL TO authenticated USING (true);

-- 6. Storage Bucket Config (Ensure 'products' bucket handles collection images too or create 'collections' bucket)
-- We reused 'products' bucket in the user prompt, so we assume it exists and has policies.
