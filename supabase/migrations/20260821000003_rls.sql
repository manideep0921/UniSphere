-- Enable RLS on every table. Application writes normally go through
-- server actions using the service-role key (which bypasses RLS), but
-- these policies keep the anon/authenticated keys safe by default in
-- case they are ever used directly from the client.

alter table public.admins enable row level security;
alter table public.stations enable row level security;
alter table public.equipment enable row level security;
alter table public.station_equipment enable row level security;
alter table public.services enable row level security;
alter table public.amenities enable row level security;
alter table public.station_amenities enable row level security;
alter table public.coupons enable row level security;
alter table public.feedback enable row level security;
alter table public.franchise_leads enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------
-- admins: admins may read their own row (used for auth/session checks);
-- no client-side writes.
-- ---------------------------------------------------------------------
create policy "admins can read own row" on public.admins
  for select using (id = auth.uid());

-- ---------------------------------------------------------------------
-- stations: public reads active rows; admins manage everything.
-- ---------------------------------------------------------------------
create policy "public can read active stations" on public.stations
  for select using (is_active = true);

create policy "admins can read all stations" on public.stations
  for select using (public.is_admin());

create policy "admins can write stations" on public.stations
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- equipment: public reads active rows (technology page); admins manage.
-- ---------------------------------------------------------------------
create policy "public can read active equipment" on public.equipment
  for select using (is_active = true);

create policy "admins can read all equipment" on public.equipment
  for select using (public.is_admin());

create policy "admins can write equipment" on public.equipment
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- station_equipment: public read (join table, no sensitive data), admin write.
-- ---------------------------------------------------------------------
create policy "public can read station_equipment" on public.station_equipment
  for select using (true);

create policy "admins can write station_equipment" on public.station_equipment
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- services: public reads active rows; admins manage.
-- ---------------------------------------------------------------------
create policy "public can read active services" on public.services
  for select using (is_active = true);

create policy "admins can read all services" on public.services
  for select using (public.is_admin());

create policy "admins can write services" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- amenities: public read, admin write.
-- ---------------------------------------------------------------------
create policy "public can read amenities" on public.amenities
  for select using (true);

create policy "admins can write amenities" on public.amenities
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- station_amenities: public read, admin write.
-- ---------------------------------------------------------------------
create policy "public can read station_amenities" on public.station_amenities
  for select using (true);

create policy "admins can write station_amenities" on public.station_amenities
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- coupons: public reads active offers only; admins manage everything.
-- ---------------------------------------------------------------------
create policy "public can read active coupons" on public.coupons
  for select using (status = 'active');

create policy "admins can read all coupons" on public.coupons
  for select using (public.is_admin());

create policy "admins can write coupons" on public.coupons
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- feedback: anyone may submit; public may read featured+reviewed
-- testimonials; admins moderate everything.
-- ---------------------------------------------------------------------
create policy "public can submit feedback" on public.feedback
  for insert with check (true);

create policy "public can read featured feedback" on public.feedback
  for select using (is_featured = true and status = 'reviewed');

create policy "admins can read all feedback" on public.feedback
  for select using (public.is_admin());

create policy "admins can update feedback" on public.feedback
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins can delete feedback" on public.feedback
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- franchise_leads: anyone may submit; only admins may read/manage.
-- ---------------------------------------------------------------------
create policy "public can submit franchise leads" on public.franchise_leads
  for insert with check (true);

create policy "admins can read franchise leads" on public.franchise_leads
  for select using (public.is_admin());

create policy "admins can update franchise leads" on public.franchise_leads
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admins can delete franchise leads" on public.franchise_leads
  for delete using (public.is_admin());

-- ---------------------------------------------------------------------
-- media: public read, admin write.
-- ---------------------------------------------------------------------
create policy "public can read media" on public.media
  for select using (true);

create policy "admins can write media" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- site_settings: public read, admin write.
-- ---------------------------------------------------------------------
create policy "public can read site_settings" on public.site_settings
  for select using (true);

create policy "admins can write site_settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
