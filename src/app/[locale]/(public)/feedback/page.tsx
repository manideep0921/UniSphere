import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { listStations } from "@/actions/stations";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "feedback" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stations = await listStations();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <FeedbackForm stations={stations} />
    </div>
  );
}
