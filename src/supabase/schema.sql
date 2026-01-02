-- Enable required extension
create extension if not exists "uuid-ossp";

-- =========================
-- TABLES
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id),
  name text not null,
  role text not null default 'user',
  phone text
);

create table if not exists public.donors (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  blood_group text not null,
  city text not null,
  available boolean default true,
  phone text
);

create table if not exists public.requests (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  blood_group text not null,
  city text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.camp_notice (
  id integer primary key,
  notice text
);

-- =========================
-- ADMIN HELPER FUNCTION
-- =========================

create or replace function is_admin()
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- =========================
-- ENABLE RLS
-- =========================

alter table profiles enable row level security;
alter table donors enable row level security;
alter table requests enable row level security;
alter table camp_notice enable row level security;

-- =========================
-- PROFILES POLICIES
-- =========================

create policy "profiles_insert_own"
on profiles
for insert
with check (auth.uid() = id);

create policy "profiles_select_own"
on profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on profiles
for update
using (auth.uid() = id);

create policy "Admin can read all profiles"
on profiles
for select
using (is_admin());

-- =========================
-- DONORS POLICIES
-- =========================

create policy "donors_public_read"
on donors
for select
using (true);

create policy "donors_insert_own"
on donors
for insert
with check (auth.uid() = user_id);

create policy "donors_update_own"
on donors
for update
using (auth.uid() = user_id);

create policy "Admin can read all donors"
on donors
for select
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin can manage donors"
on donors
for all
using (is_admin())
with check (is_admin());

create policy "Admin can delete donors"
on donors
for delete
using (is_admin());

-- =========================
-- REQUESTS POLICIES
-- =========================

create policy "User can create request"
on requests
for insert
with check (auth.uid() = user_id);

create policy "requests_select_own"
on requests
for select
using (auth.uid() = user_id);

create policy "Admin can read all requests"
on requests
for select
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

create policy "Admin can update requests"
on requests
for update
using (
  exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role = 'admin'
  )
);

-- =========================
-- CAMP NOTICE (PUBLIC READ)
-- =========================

create policy "Public can read camp notices"
on camp_notice
for select
using (true);

create policy "Admin can manage camp notices"
on camp_notice
for all
using (is_admin())
with check (is_admin());
