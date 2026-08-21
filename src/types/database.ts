export type StationStatus =
  | "operational"
  | "temporarily_unavailable"
  | "under_maintenance"
  | "coming_soon";

export type TranslationStatus = "draft" | "reviewed";
export type ChargerType = "AC" | "DC";
export type DiscountType = "percentage" | "flat";
export type CouponStatus = "draft" | "active" | "expired" | "disabled";
export type FeedbackStatus = "new" | "reviewed" | "hidden";
export type FranchiseLeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "rejected";
export type MediaCategory =
  | "station"
  | "charger"
  | "equipment"
  | "infrastructure"
  | "amenity"
  | "hero";
export type SiteSettingValueType = "text" | "url" | "json";

export type Admin = {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: string;
  created_at: string;
  updated_at: string;
}

export type Station = {
  id: string;
  slug: string;
  name_en: string;
  name_te: string | null;
  description_en: string | null;
  description_te: string | null;
  address: string;
  city: string;
  state: string;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  google_maps_url: string | null;
  operating_hours: string;
  status: StationStatus;
  charger_count: number;
  connector_count: number;
  charger_type: string | null;
  charger_manufacturer: string | null;
  equipment_supplier: string | null;
  equipment_integrator: string | null;
  charging_network: string | null;
  supported_platforms: string[];
  translation_status: TranslationStatus;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type Equipment = {
  id: string;
  manufacturer: string;
  supplier: string | null;
  model: string | null;
  power_rating: string | null;
  charger_type: ChargerType | null;
  output_voltage: string | null;
  connector_type: string | null;
  number_of_connectors: number | null;
  communication_protocol: string | null;
  authentication_methods: string[];
  display: string | null;
  emergency_button: boolean;
  ip_rating: string | null;
  cooling_method: string | null;
  protection_features: string[];
  cable_length: string | null;
  installation_method: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StationEquipment = {
  id: string;
  station_id: string;
  equipment_id: string;
  quantity: number;
  created_at: string;
}

export type Service = {
  id: string;
  slug: string;
  title_en: string;
  title_te: string | null;
  description_en: string | null;
  description_te: string | null;
  icon: string | null;
  image_url: string | null;
  features_en: string[];
  features_te: string[];
  is_active: boolean;
  display_order: number;
  translation_status: TranslationStatus;
  created_at: string;
  updated_at: string;
}

export type Amenity = {
  id: string;
  name_en: string;
  name_te: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export type StationAmenity = {
  id: string;
  station_id: string;
  amenity_id: string;
  created_at: string;
}

export type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  discount_type: DiscountType;
  discount_value: number;
  valid_from: string;
  valid_until: string | null;
  usage_limit: number | null;
  status: CouponStatus;
  created_at: string;
  updated_at: string;
}

export type Feedback = {
  id: string;
  station_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  rating: number;
  message: string;
  status: FeedbackStatus;
  is_featured: boolean;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

export type FranchiseLead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  preferred_location: string | null;
  has_land: boolean;
  property_type: string | null;
  investment_range: string | null;
  message: string | null;
  status: FranchiseLeadStatus;
  created_at: string;
  updated_at: string;
}

export type Media = {
  id: string;
  category: MediaCategory;
  station_id: string | null;
  equipment_id: string | null;
  storage_path: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export type SiteSetting = {
  id: string;
  key: string;
  value_en: string | null;
  value_te: string | null;
  value_type: SiteSettingValueType;
  created_at: string;
  updated_at: string;
}

// Minimal Supabase `Database` generic — hand-maintained to match the SQL
// migrations in supabase/migrations. Regenerate with the Supabase CLI
// (`supabase gen types typescript`) once a live project exists if you'd
// rather keep this in sync automatically.
type Table<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admins: Table<Admin>;
      stations: Table<Station>;
      equipment: Table<Equipment>;
      station_equipment: Table<StationEquipment>;
      services: Table<Service>;
      amenities: Table<Amenity>;
      station_amenities: Table<StationAmenity>;
      coupons: Table<Coupon>;
      feedback: Table<Feedback>;
      franchise_leads: Table<FranchiseLead>;
      media: Table<Media>;
      site_settings: Table<SiteSetting>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
