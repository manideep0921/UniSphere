import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { getSiteSettings } from "@/actions/settings";
import { Card, CardContent } from "@/components/ui/card";
import type { SiteSetting } from "@/types/database";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  const settings = await getSiteSettings().catch(
    () => ({}) as Record<string, SiteSetting>,
  );
  const whatsapp = settings.whatsapp_number?.value_en;
  const phone = settings.contact_phone?.value_en;
  const email = settings.contact_email?.value_en;

  const channels = [
    {
      icon: MessageCircle,
      label: t("whatsapp"),
      value: whatsapp,
      href: whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : undefined,
    },
    { icon: Phone, label: t("phone"), value: phone, href: phone ? `tel:${phone}` : undefined },
    { icon: Mail, label: t("email"), value: email, href: email ? `mailto:${email}` : undefined },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {channels.map((channel) => (
          <Card key={channel.label}>
            <CardContent className="flex flex-col items-start gap-2 pt-6">
              <channel.icon className="size-6 text-primary" />
              <p className="font-medium">{channel.label}</p>
              {channel.value ? (
                <a href={channel.href} className="text-sm text-primary hover:underline">
                  {channel.value}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{t("notConfiguredYet")}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
