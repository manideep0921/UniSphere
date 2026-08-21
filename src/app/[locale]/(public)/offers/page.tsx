import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { localeAlternates } from "@/lib/seo";
import { Tag } from "lucide-react";

import { listActiveOffers } from "@/actions/offers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers" });
  return { title: t("title"), description: t("subtitle"), alternates: localeAlternates("/offers", locale) };
}

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("offers");
  const offers = await listActiveOffers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>

      {offers.length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">{t("noOffers")}</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader className="flex-row items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tag className="size-4 text-primary" />
                  <CardTitle>{offer.title}</CardTitle>
                </div>
                <Badge>
                  {offer.discount_type === "percentage"
                    ? `${offer.discount_value}%`
                    : `₹${offer.discount_value}`}
                </Badge>
              </CardHeader>
              <CardContent>
                {offer.description && (
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="rounded-md bg-muted px-2 py-1 font-mono">{offer.code}</span>
                  {offer.valid_until && (
                    <span className="text-muted-foreground">
                      {t("validUntil")} {new Date(offer.valid_until).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
