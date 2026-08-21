import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function FranchiseCta() {
  const t = useTranslations("home");

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t("franchiseCtaTitle")}</h2>
          <p className="mt-2 max-w-xl text-primary-foreground/90">{t("franchiseCtaSubtitle")}</p>
        </div>
        <Button asChild size="lg" variant="secondary" className="shrink-0">
          <Link href="/franchise">
            {t("franchiseCtaButton")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
