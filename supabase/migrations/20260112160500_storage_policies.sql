-- 1. Create 'collections' table if it doesn't exist (re-iterating just in case, though previous migration might cover it)
-- The user prompt specifically asked for this SQL to be applied.
-- Focusing on the storage policies part which is new/specific in the prompt.

-- 4. Configure Storage Bucket (for images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Configure Storage Perms
DO $$
BEGIN
    -- Public Read
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access"
          ON storage.objects FOR SELECT
          USING ( bucket_id = 'products' );
    END IF;

    -- Authenticated Upload
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated Upload'
    ) THEN
        CREATE POLICY "Authenticated Upload"
          ON storage.objects FOR INSERT
          TO authenticated
          WITH CHECK ( bucket_id = 'products' );
    END IF;

    -- Authenticated Update/Delete
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated Admin Access'
    ) THEN
         CREATE POLICY "Authenticated Admin Access"
          ON storage.objects FOR ALL
          TO authenticated
          USING ( bucket_id = 'products' );
    END IF;
END $$;
