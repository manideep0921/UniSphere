import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants/site";

/**
 * Builds canonical + hreflang alternate URLs for a locale-prefixed public
 * page. `path` is the route without its locale prefix, e.g. "/stations"
 * or "/stations/sri-sai-restaurant-amadabakula" — pass "" for the home page.
 */
export function localeAlternates(path: string, currentLocale: string) {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";

  return {
    canonical: `${SITE_URL}/${currentLocale}${normalizedPath}`,
    languages: Object.fromEntries(
      routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${normalizedPath}`]),
    ),
  };
}
