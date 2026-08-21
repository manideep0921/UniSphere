import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { StationCard } from "@/components/stations/station-card";
import type { Station } from "@/types/database";

export function StationsPreview({ stations }: { stations: Station[] }) {
  const t = useTranslations("home");

  if (stations.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{t("stationsPreviewTitle")}</h2>
          <p className="mt-1 text-muted-foreground">{t("stationsPreviewSubtitle")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/stations">
            {t("viewAllStations")}
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stations.slice(0, 3).map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </section>
  );
}
