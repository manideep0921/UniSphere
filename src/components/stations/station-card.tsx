import { useLocale, useTranslations } from "next-intl";
import { MapPin, Zap } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StationStatusBadge } from "@/components/stations/station-status-badge";
import type { Station } from "@/types/database";

export function StationCard({ station }: { station: Station }) {
  const t = useTranslations("stations");
  const locale = useLocale();
  const name = locale === "te" && station.name_te ? station.name_te : station.name_en;

  return (
    <Link href={`/stations/${station.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold leading-tight">{name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {station.city}, {station.state}
            </p>
          </div>
          <StationStatusBadge status={station.status} />
        </CardHeader>
        <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Zap className="size-4 text-primary" />
            {station.charger_count} {t("chargerCount")}
          </span>
          <span>
            {station.connector_count} {t("connectorCount")}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
