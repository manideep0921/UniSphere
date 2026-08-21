import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return { title: t("title"), alternates: localeAlternates("/terms", locale) };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("terms");

  const sections = [
    { title: t("purposeTitle"), body: t("purposeBody") },
    { title: t("accuracyTitle"), body: t("accuracyBody") },
    { title: t("conductTitle"), body: t("conductBody") },
    { title: t("liabilityTitle"), body: t("liabilityBody") },
    { title: t("changesTitle"), body: t("changesBody") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("updated")}: 21 August 2026
      </p>
      <p className="mt-6 leading-relaxed text-muted-foreground">{t("intro")}</p>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
