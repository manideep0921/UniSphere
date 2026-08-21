import { useTranslations } from "next-intl";
import { BatteryCharging, ShieldCheck, Handshake, Headset } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function WhyChooseUs() {
  const t = useTranslations("home");

  const points = [
    { icon: BatteryCharging, title: "Reliable Charging", body: "High-power DC chargers built for uptime." },
    { icon: ShieldCheck, title: "Safety First", body: "Equipment with layered electrical protection." },
    { icon: Handshake, title: "Franchise Support", body: "We equip your property, you host the station." },
    { icon: Headset, title: "Responsive Support", body: "Maintenance and technical support you can count on." },
  ];

  return (
    <section className="bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">{t("whyTitle")}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <Card key={point.title}>
              <CardContent className="pt-6">
                <point.icon className="size-6 text-primary" />
                <h3 className="mt-3 font-semibold">{point.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{point.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
