-- Create addresses table
create table if not exists addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text default 'MX' not null,
  phone text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table addresses enable row level security;

-- Create policies
create policy "Users can view their own addresses"
  on addresses for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own addresses"
  on addresses for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own addresses"
  on addresses for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own addresses"
  on addresses for delete
  using ( auth.uid() = user_id );

-- Create indexes
create index addresses_user_id_idx on addresses(user_id);
