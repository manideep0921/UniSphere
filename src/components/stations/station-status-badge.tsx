import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { STATION_STATUS_VARIANT } from "@/lib/constants/site";
import type { StationStatus } from "@/types/database";

const STATUS_KEY: Record<StationStatus, string> = {
  operational: "statusOperational",
  temporarily_unavailable: "statusUnavailable",
  under_maintenance: "statusMaintenance",
  coming_soon: "statusComingSoon",
};

export function StationStatusBadge({ status }: { status: StationStatus }) {
  const t = useTranslations("stations");

  return (
    <Badge variant={STATION_STATUS_VARIANT[status] ?? "secondary"}>
      {t(STATUS_KEY[status] ?? "statusOperational")}
    </Badge>
  );
}
