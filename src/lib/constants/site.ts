export const SITE_NAME = "RM EV Services";
export const SITE_NAME_SHORT = "RM EV Services Pvt. Ltd.";

export const SITE_DESCRIPTION =
  "RM EV Services operates and equips EV charging stations across Telangana, with franchise opportunities for partners.";

// No production domain has been assigned yet (Section 18). Set
// NEXT_PUBLIC_SITE_URL once one exists — everything else (sitemap,
// canonical URLs, OG tags) reads from it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/stations", key: "stations" },
  { href: "/services", key: "services" },
  { href: "/technology", key: "technology" },
  { href: "/franchise", key: "franchise" },
  { href: "/offers", key: "offers" },
  { href: "/contact", key: "contact" },
] as const;

export const STATION_STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "destructive" | "secondary"
> = {
  operational: "success",
  temporarily_unavailable: "warning",
  under_maintenance: "warning",
  coming_soon: "secondary",
};
