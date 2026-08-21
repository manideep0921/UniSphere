import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants/site";

export function Footer() {
  const t = useTranslations("nav");
  const tf = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </span>
            {SITE_NAME}
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{tf("tagline")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{tf("quickLinks")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-foreground">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{tf("legal")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/privacy-policy" className="hover:text-foreground">
                {tf("privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-foreground">
                {tf("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {year} {SITE_NAME}. {tf("rightsReserved")}
      </div>
    </footer>
  );
}
