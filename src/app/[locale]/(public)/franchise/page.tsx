import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { ClipboardList, MessageSquare, Handshake, Zap } from "lucide-react";

import { FranchiseForm } from "@/components/franchise/franchise-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "franchise" });
  return { title: t("title"), description: t("subtitle") };
}

const STEPS = [
  { icon: MessageSquare, title: "Submit an Enquiry", body: "Tell us about your property and location." },
  { icon: ClipboardList, title: "Site Evaluation", body: "We assess feasibility for your property." },
  { icon: Zap, title: "Equipment & Setup", body: "We supply and install the charging equipment." },
  { icon: Handshake, title: "Go Live", body: "Your station opens as part of the RM EV Services network." },
];

export default async function FranchisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("franchise");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{t("subtitle")}</p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">{t("processTitle")}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-xl border border-border p-5">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <step.icon className="mt-4 size-5 text-primary" />
              <h3 className="mt-2 font-medium">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 max-w-2xl">
        <FranchiseForm />
      </section>
    </div>
  );
}
