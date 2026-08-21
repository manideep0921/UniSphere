import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { localeAlternates } from "@/lib/seo";

import { listStations } from "@/actions/stations";
import { StationsFilter } from "@/components/stations/stations-filter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "stations" });
  return { title: t("title"), description: t("subtitle"), alternates: localeAlternates("/stations", locale) };
}

export default async function StationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stations");
  const stations = await listStations();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10">
        <StationsFilter stations={stations} />
      </div>
    </div>
  );
}
