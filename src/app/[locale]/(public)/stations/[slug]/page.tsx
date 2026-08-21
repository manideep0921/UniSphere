import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

import { getStationBySlug } from "@/actions/stations";
import { listStationEquipment } from "@/actions/station-equipment";
import { listStationAmenities } from "@/actions/station-amenities";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StationStatusBadge } from "@/components/stations/station-status-badge";
import { EquipmentSpecCard } from "@/components/equipment/equipment-spec-card";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { SITE_URL } from "@/lib/constants/site";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const station = await getStationBySlug(slug);
  if (!station) return {};

  return {
    title: station.name_en,
    description: station.description_en ?? undefined,
    alternates: localeAlternates(`/stations/${slug}`, locale),
  };
}

export default async function StationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stations");
  const tc = await getTranslations("common");

  const station = await getStationBySlug(slug);
  if (!station) notFound();

  const [equipment, amenities] = await Promise.all([
    listStationEquipment(station.id),
    listStationAmenities(station.id),
  ]);

  const name = locale === "te" && station.name_te ? station.name_te : station.name_en;
  const description =
    locale === "te" && station.description_te ? station.description_te : station.description_en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    name,
    description: description ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: station.address,
      addressLocality: station.city,
      addressRegion: station.state,
    },
    ...(station.latitude && station.longitude
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: station.latitude,
            longitude: station.longitude,
          },
        }
      : {}),
    url: `${SITE_URL}/stations/${station.slug}`,
    openingHours: station.operating_hours,
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/stations"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("backToStations")}
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            {station.address}, {station.city}, {station.state}
          </p>
        </div>
        <StationStatusBadge status={station.status} />
      </div>

      {description && <p className="mt-6 leading-relaxed text-muted-foreground">{description}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        {station.google_maps_url && (
          <Button asChild>
            <a href={station.google_maps_url} target="_blank" rel="noopener noreferrer">
              <MapPin className="size-4" />
              {t("getDirections")}
            </a>
          </Button>
        )}
        <Button variant="outline" disabled>
          <Clock className="size-4" />
          {station.operating_hours}
        </Button>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{t("specifications")}</h2>
        <Card className="mt-4">
          <CardContent className="grid gap-x-6 gap-y-2 pt-6 sm:grid-cols-2">
            <SpecRow label={t("chargerCount")} value={station.charger_count} />
            <SpecRow label={t("connectorCount")} value={station.connector_count} />
            <SpecRow label={t("chargerType")} value={station.charger_type} fallback={tc("notSpecified")} />
            <SpecRow label={t("operatingHours")} value={station.operating_hours} />
            <SpecRow label="Charger Manufacturer" value={station.charger_manufacturer} fallback={tc("notSpecified")} />
            <SpecRow label="Equipment Supplier" value={station.equipment_supplier} fallback={tc("notSpecified")} />
            <SpecRow label="Equipment Integrator" value={station.equipment_integrator} fallback={tc("notSpecified")} />
            <SpecRow label="Charging Network" value={station.charging_network} fallback={tc("notSpecified")} />
          </CardContent>
        </Card>
      </section>

      {amenities.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{t("amenities")}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {amenities.map((amenity) => {
              const label = locale === "te" && amenity.name_te ? amenity.name_te : amenity.name_en;
              return (
                <span
                  key={amenity.id}
                  className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm"
                >
                  <DynamicIcon name={amenity.icon} className="size-4 text-primary" />
                  {label}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {equipment.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">{t("equipment")}</h2>
          <div className="mt-4 grid gap-5">
            {equipment.map((row) => (
              <div key={row.id}>
                <p className="mb-2 text-sm text-muted-foreground">Quantity: {row.quantity}</p>
                <EquipmentSpecCard equipment={row.equipment} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SpecRow({
  label,
  value,
  fallback,
}: {
  label: string;
  value: string | number | null;
  fallback?: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value ?? fallback}</span>
    </div>
  );
}
