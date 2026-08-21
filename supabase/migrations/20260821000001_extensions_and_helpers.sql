-- Extensions
create extension if not exists pgcrypto;

-- updated_at trigger helper, reused by every table below
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Returns true when the current auth.uid() belongs to an active admin.
-- SECURITY DEFINER avoids recursive RLS lookups against admins itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins
    where id = auth.uid() and is_active = true
  );
$$;
