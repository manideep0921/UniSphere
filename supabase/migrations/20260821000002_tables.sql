-- =========================================================================
-- admins
-- =========================================================================
create table public.admins (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  is_active boolean not null default true,
  role text not null default 'admin', -- reserved for future RBAC
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.admins
  for each row execute function public.set_updated_at();

-- =========================================================================
-- stations
-- =========================================================================
create table public.stations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_te text,
  description_en text,
  description_te text,
  address text not null,
  city text not null,
  state text not null,
  district text,
  latitude double precision,
  longitude double precision,
  google_maps_url text,
  operating_hours text not null default '24 hours',
  status text not null default 'operational'
    check (status in ('operational', 'temporarily_unavailable', 'under_maintenance', 'coming_soon')),
  charger_count integer not null default 0,
  connector_count integer not null default 0,
  charger_type text,
  charger_manufacturer text,
  equipment_supplier text,
  equipment_integrator text,
  charging_network text,
  supported_platforms text[] not null default '{}',
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'reviewed')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index stations_status_idx on public.stations (status);
create index stations_city_idx on public.stations (city);

create trigger set_updated_at before update on public.stations
  for each row execute function public.set_updated_at();

-- =========================================================================
-- equipment
-- =========================================================================
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  manufacturer text not null,
  supplier text,
  model text,
  power_rating text,
  charger_type text check (charger_type in ('AC', 'DC')),
  output_voltage text,
  connector_type text,
  number_of_connectors integer,
  communication_protocol text,
  authentication_methods text[] not null default '{}',
  display text,
  emergency_button boolean not null default false,
  ip_rating text,
  cooling_method text,
  protection_features text[] not null default '{}',
  cable_length text,
  installation_method text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.equipment
  for each row execute function public.set_updated_at();

-- =========================================================================
-- station_equipment (junction)
-- =========================================================================
create table public.station_equipment (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations (id) on delete cascade,
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamptz not null default now(),
  unique (station_id, equipment_id)
);

create index station_equipment_station_idx on public.station_equipment (station_id);
create index station_equipment_equipment_idx on public.station_equipment (equipment_id);

-- =========================================================================
-- services
-- =========================================================================
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_te text,
  description_en text,
  description_te text,
  icon text,
  image_url text,
  features_en text[] not null default '{}',
  features_te text[] not null default '{}',
  is_active boolean not null default true,
  display_order integer not null default 0,
  translation_status text not null default 'draft'
    check (translation_status in ('draft', 'reviewed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_display_order_idx on public.services (display_order);

create trigger set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- =========================================================================
-- amenities
-- =========================================================================
create table public.amenities (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_te text,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.amenities
  for each row execute function public.set_updated_at();

-- =========================================================================
-- station_amenities (junction)
-- =========================================================================
create table public.station_amenities (
  id uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations (id) on delete cascade,
  amenity_id uuid not null references public.amenities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (station_id, amenity_id)
);

create index station_amenities_station_idx on public.station_amenities (station_id);
create index station_amenities_amenity_idx on public.station_amenities (amenity_id);

-- =========================================================================
-- coupons
-- =========================================================================
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage', 'flat')),
  discount_value numeric(10, 2) not null,
  valid_from date not null default current_date,
  valid_until date,
  usage_limit integer,
  status text not null default 'draft'
    check (status in ('draft', 'active', 'expired', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index coupons_status_idx on public.coupons (status);

create trigger set_updated_at before update on public.coupons
  for each row execute function public.set_updated_at();

-- =========================================================================
-- feedback
-- =========================================================================
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  station_id uuid references public.stations (id) on delete set null,
  name text not null,
  email text,
  phone text,
  rating integer not null check (rating between 1 and 5),
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'hidden')),
  is_featured boolean not null default false,
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index feedback_status_idx on public.feedback (status);
create index feedback_featured_idx on public.feedback (is_featured);
create index feedback_station_idx on public.feedback (station_id);

create trigger set_updated_at before update on public.feedback
  for each row execute function public.set_updated_at();

-- =========================================================================
-- franchise_leads
-- =========================================================================
create table public.franchise_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  city text,
  state text,
  preferred_location text,
  has_land boolean not null default false,
  property_type text,
  investment_range text,
  message text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'converted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index franchise_leads_status_idx on public.franchise_leads (status);

create trigger set_updated_at before update on public.franchise_leads
  for each row execute function public.set_updated_at();

-- =========================================================================
-- media
-- =========================================================================
create table public.media (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('station', 'charger', 'equipment', 'infrastructure', 'amenity', 'hero')),
  station_id uuid references public.stations (id) on delete cascade,
  equipment_id uuid references public.equipment (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index media_station_idx on public.media (station_id);
create index media_equipment_idx on public.media (equipment_id);
create index media_category_idx on public.media (category);

-- =========================================================================
-- site_settings
-- =========================================================================
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_en text,
  value_te text,
  value_type text not null default 'text' check (value_type in ('text', 'url', 'json')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
