create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin_user(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
  );
$$;

create table if not exists public.products (
  id text primary key,
  title text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  tag text not null default '',
  size_tag text not null default 'col-span-1 row-span-1',
  primary_image text not null,
  gallery text[] not null default '{}'::text[],
  categories text[] not null default '{}'::text[],
  scent_top text not null default 'Unscented',
  scent_mid text not null default 'Unscented',
  scent_base text not null default 'Unscented',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_sort_idx
  on public.products (sort_order, created_at desc);

create index if not exists products_active_idx
  on public.products (is_active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists handle_products_updated_at on public.products;

create trigger handle_products_updated_at
before update on public.products
for each row
execute procedure public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Admins can read their own admin row" on public.admin_users;
create policy "Admins can read their own admin row"
on public.admin_users
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products
for select
using (is_active = true);

drop policy if exists "Admins can view all products" on public.products;
create policy "Admins can view all products"
on public.products
for select
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin_user(auth.uid()))
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin_user(auth.uid()));

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update
set public = excluded.public;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects
for select
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and public.is_admin_user(auth.uid())
);

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin_user(auth.uid())
)
with check (
  bucket_id = 'product-images'
  and public.is_admin_user(auth.uid())
);

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and public.is_admin_user(auth.uid())
);

-- Create a Supabase Auth user first, then promote that user into admin_users:
-- insert into public.admin_users (user_id, email)
-- select id, email
-- from auth.users
-- where email = 'admin@example.com';
