-- 20260107000000_admin_permissions.sql

-- NOTA: Como la aplicación ahora usa 'createAdminClient' (Service Role Key) para las acciones del servidor críticas (actualizar stock, eliminar productos),
-- las políticas RLS siguientes son opcionales pero recomendadas para permitir consultas directas desde el cliente si fuera necesario en el futuro.

-- Enable RLS just in case it wasn't
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow ALL operations for authenticated users (Admin access proxy)
-- Si ya existen políticas similares, esto podría ser redundante pero asegura el acceso.

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admin All Products'
    ) THEN
        CREATE POLICY "Admin All Products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'product_variants' AND policyname = 'Admin All Variants'
    ) THEN
        CREATE POLICY "Admin All Variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Admin All Images'
    ) THEN
        CREATE POLICY "Admin All Images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admin All Categories'
    ) THEN
        CREATE POLICY "Admin All Categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END
$$;
