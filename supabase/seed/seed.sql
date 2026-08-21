-- Seed data for RM EV Services.
-- Only facts confirmed in the project brief (Section 17) are populated;
-- anything not confirmed is left as an empty string / null so the admin
-- UI can flag it and staff can fill it in later (Section 18).

-- =========================================================================
-- Station: Sri Sai Restaurant
-- =========================================================================
insert into public.stations (
  slug, name_en, name_te, address, city, state, district,
  google_maps_url, operating_hours, status,
  charger_count, connector_count, charger_type,
  charger_manufacturer, equipment_supplier, equipment_integrator, charging_network,
  supported_platforms, translation_status, is_active
) values (
  'sri-sai-restaurant-amadabakula',
  'Sri Sai Restaurant EV Charging Station',
  null, -- Telugu name pending translation review
  'Sri Sai Restaurant, Amadabakula Village, Kothakota Mandal',
  'Wanaparthy',
  'Telangana',
  'Wanaparthy',
  'https://maps.app.goo.gl/xetohA4vFzsA3adz7?g_st=ac',
  '24 hours',
  'operational',
  3,
  8,
  'DC',
  'SLNS',
  'Lekha Solutions',
  null,
  null,
  '{}',
  'draft',
  true
);

-- =========================================================================
-- Equipment: DC charger installed at Sri Sai Restaurant
-- =========================================================================
insert into public.equipment (
  manufacturer, supplier, model, power_rating, charger_type,
  output_voltage, connector_type, number_of_connectors,
  communication_protocol, authentication_methods,
  display, emergency_button, ip_rating, cooling_method,
  protection_features, cable_length, installation_method, is_active
) values (
  'SLNS',
  'Lekha Solutions',
  null,
  '120 kW / 180 kW / 240 kW',
  'DC',
  '200-1000V DC',
  null,
  8,
  'OCPP 1.6 (LAN / 4G / 5G)',
  array['Manual', 'RFID', 'Mobile App'],
  '7 inch',
  true,
  'IP54',
  'Fan cooling',
  array['Over voltage', 'Under voltage', 'Short circuit', 'Leakage current', 'Over temperature', 'Over current'],
  '5m',
  'Stand-alone',
  true
);

insert into public.station_equipment (station_id, equipment_id, quantity)
select s.id, e.id, 3
from public.stations s, public.equipment e
where s.slug = 'sri-sai-restaurant-amadabakula'
  and e.manufacturer = 'SLNS' and e.model is null
limit 1;

-- =========================================================================
-- Amenities catalog (not yet linked to any station — link from
-- /admin/stations once confirmed on-site).
-- =========================================================================
insert into public.amenities (name_en, name_te, icon) values
  ('Restroom', 'రెస్ట్‌రూమ్', 'toilet'),
  ('Seating Area', 'కూర్చునే ప్రదేశం', 'armchair'),
  ('Food & Beverages', 'ఆహారం & పానీయాలు', 'utensils'),
  ('Parking', 'పార్కింగ్', 'circle-parking'),
  ('CCTV Surveillance', 'సీసీటీవీ నిఘా', 'camera'),
  ('24x7 Security', '24x7 భద్రత', 'shield-check'),
  ('Drinking Water', 'తాగునీరు', 'glass-water'),
  ('Waiting Lounge', 'వెయిటింగ్ లాంజ్', 'sofa');

-- =========================================================================
-- Services catalog
-- =========================================================================
insert into public.services (slug, title_en, description_en, icon, features_en, is_active, display_order, translation_status) values
  (
    'ev-charging-station-setup',
    'EV Charging Station Setup',
    'End-to-end planning, equipment supply, and installation of DC/AC EV charging stations.',
    'zap',
    array['Site assessment', 'Equipment supply', 'Installation & commissioning'],
    true, 1, 'draft'
  ),
  (
    'franchise-partnership',
    'Franchise Partnership',
    'Host an RM EV Services charging station on your property under our franchise model.',
    'handshake',
    array['Franchise onboarding support', 'Equipment provided by RM EV Services', 'Ongoing operational support'],
    true, 2, 'draft'
  ),
  (
    'equipment-supply',
    'EV Charging Equipment Supply',
    'Supply of DC/AC chargers and supporting infrastructure for operators and property owners.',
    'battery-charging',
    array['DC & AC chargers', 'OCPP-compliant hardware', 'Multiple power ratings'],
    true, 3, 'draft'
  ),
  (
    'maintenance-support',
    'Maintenance & Support',
    'Ongoing maintenance and technical support for installed charging infrastructure.',
    'wrench',
    array['Preventive maintenance', 'Remote diagnostics support', 'On-site service visits'],
    true, 4, 'draft'
  );

-- =========================================================================
-- Site settings — admin-editable marketing copy. Values intentionally
-- left blank where not confirmed (Section 18); fill in via /admin/settings.
-- =========================================================================
insert into public.site_settings (key, value_en, value_te, value_type) values
  ('whatsapp_number', '', '', 'text'),
  ('hero_tagline_en', 'Reliable EV charging infrastructure across Telangana.', null, 'text'),
  ('why_choose_us_en', 'RM EV Services operates and equips EV charging stations, with a franchise model for partners who want to host a station on their property.', null, 'text'),
  ('contact_email', '', null, 'text'),
  ('contact_phone', '', null, 'text');
