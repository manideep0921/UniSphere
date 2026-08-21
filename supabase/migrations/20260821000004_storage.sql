-- Public bucket for station/equipment/hero imagery. Admin-only writes,
-- served publicly via Supabase's CDN URL (NEXT_PUBLIC_SUPABASE_URL/storage/...).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public can read media bucket" on storage.objects
  for select using (bucket_id = 'media');

create policy "admins can upload to media bucket" on storage.objects
  for insert with check (bucket_id = 'media' and public.is_admin());

create policy "admins can update media bucket" on storage.objects
  for update using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "admins can delete from media bucket" on storage.objects
  for delete using (bucket_id = 'media' and public.is_admin());
