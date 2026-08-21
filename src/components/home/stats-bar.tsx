import { useTranslations } from "next-intl";

export function StatsBar({
  stationCount,
  chargerCount,
  connectorCount,
}: {
  stationCount: number;
  chargerCount: number;
  connectorCount: number;
}) {
  const t = useTranslations("home");

  const stats = [
    { label: t("statsStations"), value: stationCount },
    { label: t("statsChargers"), value: chargerCount },
    { label: t("statsConnectors"), value: connectorCount },
    { label: t("statsAvailability"), value: "24/7" },
  ];

  return (
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
