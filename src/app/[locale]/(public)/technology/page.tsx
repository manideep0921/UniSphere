import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { listEquipment } from "@/actions/equipment";
import { EquipmentSpecCard } from "@/components/equipment/equipment-spec-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "technology" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");
  const equipment = await listEquipment();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {equipment.map((item) => (
          <EquipmentSpecCard key={item.id} equipment={item} />
        ))}
      </div>
    </div>
  );
}
