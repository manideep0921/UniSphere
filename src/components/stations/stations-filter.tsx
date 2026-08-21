"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StationCard } from "@/components/stations/station-card";
import type { Station, StationStatus } from "@/types/database";

const STATUSES: StationStatus[] = [
  "operational",
  "temporarily_unavailable",
  "under_maintenance",
  "coming_soon",
];

export function StationsFilter({ stations }: { stations: Station[] }) {
  const t = useTranslations("stations");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(
    () => (status === "all" ? stations : stations.filter((s) => s.status === status)),
    [stations, status],
  );

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{t("filterStatus")}</span>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(
                  s === "operational"
                    ? "statusOperational"
                    : s === "temporarily_unavailable"
                      ? "statusUnavailable"
                      : s === "under_maintenance"
                        ? "statusMaintenance"
                        : "statusComingSoon",
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">{t("noStations")}</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}
