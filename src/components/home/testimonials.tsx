import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Feedback } from "@/types/database";

export function Testimonials({ feedback }: { feedback: Feedback[] }) {
  const t = useTranslations("home");

  if (feedback.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold sm:text-3xl">{t("testimonialsTitle")}</h2>
      <p className="mt-1 text-muted-foreground">{t("testimonialsSubtitle")}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {feedback.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${i < item.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">&ldquo;{item.message}&rdquo;</p>
              <p className="mt-3 text-sm font-medium text-muted-foreground">— {item.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
