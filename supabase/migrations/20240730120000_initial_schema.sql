-- Crear la tabla de perfiles de usuario
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  email text unique,
  dob timestamp with time zone,
  role text default 'user'
);

-- Habilitar RLS
alter table profiles enable row level security;

-- Política: Los usuarios pueden ver todos los perfiles (público)
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- Política: Los usuarios pueden insertar su propio perfil
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

-- Política: Los usuarios pueden actualizar su propio perfil
create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Crear tabla de categorías
create table categories (
  id bigserial primary key,
  name text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table categories enable row level security;

-- Política: Cualquiera puede ver las categorías
create policy "Categories are viewable by everyone."
  on categories for select
  using ( true );


-- Crear tabla de colecciones
create table collections (
  id bigserial primary key,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table collections enable row level security;

-- Política: Cualquiera puede ver las colecciones
create policy "Collections are viewable by everyone."
  on collections for select
  using ( true );


-- Crear tabla de productos
create table products (
  id bigserial primary key,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  stock integer default 0,
  sku text,
  
  -- Campos de detalles
  materials text,
  sizes text[],
  gems text[],
  dimensions text,
  care_instructions text,
  origin text,
  
  -- Relaciones
  category_id bigint references categories(id),
  
  -- Campos de valoración
  rating numeric(2, 1) default 0.0,
  reviews_count integer default 0,

  -- Otros campos
  available_colors text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table products enable row level security;

-- Política: Cualquiera puede ver los productos
create policy "Products are viewable by everyone."
  on products for select
  using ( true );


-- Crear tabla de imágenes de productos
create table product_images (
  id bigserial primary key,
  product_id bigint not null references products(id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order smallint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table product_images enable row level security;

-- Política: Cualquiera puede ver las imágenes de productos
create policy "Product images are viewable by everyone."
  on product_images for select
  using ( true );


-- Crear tabla de unión para productos y colecciones (relación muchos a muchos)
create table collection_products (
  collection_id bigint not null references collections(id) on delete cascade,
  product_id bigint not null references products(id) on delete cascade,
  primary key (collection_id, product_id)
);


-- Habilitar RLS
alter table collection_products enable row level security;

-- Política: Cualquiera puede ver las relaciones entre colecciones y productos
create policy "Collection-product links are viewable by everyone."
  on collection_products for select
  using ( true );
