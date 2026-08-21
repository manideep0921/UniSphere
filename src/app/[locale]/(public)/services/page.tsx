import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { listActiveServices } from "@/actions/services";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Check } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const services = await listActiveServices();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {services.map((service) => {
          const title = locale === "te" && service.title_te ? service.title_te : service.title_en;
          const description =
            locale === "te" && service.description_te
              ? service.description_te
              : service.description_en;
          const features =
            locale === "te" && service.features_te.length > 0
              ? service.features_te
              : service.features_en;

          return (
            <Card key={service.id}>
              <CardContent className="pt-6">
                <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <DynamicIcon name={service.icon} className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">{title}</h2>
                {description && (
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                )}
                {features.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
