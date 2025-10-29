
-- Habilitar RLS para la tabla de categorías si aún no está habilitado
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Permitir a los usuarios autenticados leer todas las categorías
CREATE POLICY "Allow authenticated read access to categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

-- Permitir a los usuarios administradores insertar nuevas categorías
CREATE POLICY "Allow admin to insert categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Permitir a los usuarios administradores actualizar categorías
CREATE POLICY "Allow admin to update categories"
ON public.categories
FOR UPDATE
TO authenticated
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Permitir a los usuarios administradores eliminar categorías
CREATE POLICY "Allow admin to delete categories"
ON public.categories
FOR DELETE
TO authenticated
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
