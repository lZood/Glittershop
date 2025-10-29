-- Function to get user role
create or replace function get_user_role(user_id uuid)
returns text
language sql
security definer
set search_path = public
as $$
  select role from profiles where id = user_id;
$$;

-- Add RLS policies for categories
create policy "Allow authenticated users to read categories" on public.categories
  for select
  to authenticated
  using (true);

create policy "Allow admins to create categories" on public.categories
  for insert
  to authenticated
  with check (get_user_role(auth.uid()) = 'admin');

create policy "Allow admins to update categories" on public.categories
  for update
  to authenticated
  using (get_user_role(auth.uid()) = 'admin');

create policy "Allow admins to delete categories" on public.categories
  for delete
  to authenticated
  using (get_user_role(auth.uid()) = 'admin');
