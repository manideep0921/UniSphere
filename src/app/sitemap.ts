import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants/site";
import { createClient } from "@/lib/supabase/server";

const STATIC_PATHS = [
  "",
  "/about",
  "/stations",
  "/services",
  "/technology",
  "/franchise",
  "/offers",
  "/feedback",
  "/contact",
  "/privacy-policy",
  "/terms",
];

function withLocales(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PATHS.flatMap((path) => withLocales(path));

  let stationEntries: MetadataRoute.Sitemap = [];
  try {
    const supabase = await createClient();
    const { data: stations } = await supabase
      .from("stations")
      .select("slug, updated_at")
      .eq("is_active", true);

    stationEntries = (stations ?? []).flatMap((station) =>
      withLocales(`/stations/${station.slug}`, new Date(station.updated_at)),
    );
  } catch {
    // Supabase not configured yet at build time — ship the static pages only.
  }

  return [...staticEntries, ...stationEntries];
}
