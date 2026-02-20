-- Enable public read access for Products, Product Images, and Collections
-- This allows published products to be seen by unauthenticated users (anon).

-- PRODUCTS
-- Allow public (anon + authenticated) to read ACTIVE products
-- We drop to avoid error if re-run, though standard migrations run once.
DROP POLICY IF EXISTS "Public Read Active Products" ON products;

CREATE POLICY "Public Read Active Products" ON products
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- PRODUCT IMAGES
-- Allow public to read all product images
DROP POLICY IF EXISTS "Public Read Images" ON product_images;

CREATE POLICY "Public Read Images" ON product_images
FOR SELECT
TO anon, authenticated
USING (true);

-- COLLECTIONS
-- Allow public to read collections
DROP POLICY IF EXISTS "Public Read Collections" ON collections;

CREATE POLICY "Public Read Collections" ON collections
FOR SELECT
TO anon, authenticated
USING (true);

-- CATEGORIES
-- Ensure public read access just in case
DROP POLICY IF EXISTS "Public Read Categories Safety" ON categories;

CREATE POLICY "Public Read Categories Safety" ON categories
FOR SELECT
TO anon, authenticated
USING (true);

-- PRODUCT VARIANTS (Already existed in previous migration but good to ensure uniqueness)
-- If "Allow public read access to variants" exists, this is redundant but harmless if we use a new name or just leave it.
-- We'll skip variants as it was covered in 20260106163000 but I'll add a safety one just in case that migration didn't run or was modified.
DROP POLICY IF EXISTS "Public Read Variants Safety" ON product_variants;

CREATE POLICY "Public Read Variants Safety" ON product_variants
FOR SELECT
TO anon, authenticated
USING (true);
