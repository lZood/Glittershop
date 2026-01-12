
-- Create a new storage bucket for products if it doesn't exist
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Set up security policies for the 'products' bucket

-- 1. Allow public read access to everyone
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'products' );

-- 2. Allow authenticated users to upload images
create policy "Authenticated Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'products' );

-- 3. Allow authenticated users to update their images (optional but good)
create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'products' );

-- 4. Allow authenticated users to delete images
create policy "Authenticated Delete"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'products' );
