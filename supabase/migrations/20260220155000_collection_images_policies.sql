-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('collection_images', 'collection_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public reading
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access for collection images'
    ) THEN
        CREATE POLICY "Public Access for collection images"
          ON storage.objects FOR SELECT
          USING ( bucket_id = 'collection_images' );
    END IF;

    -- Authenticated Upload
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated Upload for collection images'
    ) THEN
        CREATE POLICY "Authenticated Upload for collection images"
          ON storage.objects FOR INSERT
          TO authenticated
          WITH CHECK ( bucket_id = 'collection_images' );
    END IF;

    -- Authenticated Update/Delete
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated Admin Access for collection images'
    ) THEN
         CREATE POLICY "Authenticated Admin Access for collection images"
          ON storage.objects FOR ALL
          TO authenticated
          USING ( bucket_id = 'collection_images' );
    END IF;
END $$;
