"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2, Star } from "lucide-react";

import { submitFeedback } from "@/actions/feedback";
import { feedbackSchema, type FeedbackInput } from "@/lib/validations/feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import { cn } from "@/lib/utils";
import type { Station } from "@/types/database";

export function FeedbackForm({ stations }: { stations: Station[] }) {
  const t = useTranslations("feedback");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { rating: 5, turnstileToken: "" },
  });

  const rating = watch("rating");

  async function onSubmit(values: FeedbackInput) {
    setServerError(null);
    const result = await submitFeedback(values);

    if (result.status === "success") {
      setSubmitted(true);
      return;
    }

    setServerError(result.message ?? "Something went wrong.");
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <h3 className="text-xl font-semibold">{t("successTitle")}</h3>
          <p className="mt-2 text-muted-foreground">{t("successMessage")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">{t("name")}</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            {stations.length > 0 && (
              <div>
                <Label>{t("station")}</Label>
                <Select onValueChange={(value) => setValue("stationId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("station")} />
                  </SelectTrigger>
                  <SelectContent>
                    {stations.map((station) => (
                      <SelectItem key={station.id} value={station.id}>
                        {station.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <Label>{t("rating")}</Label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue("rating", value)}
                  aria-label={`${value} star`}
                >
                  <Star
                    className={cn(
                      "size-7 transition-colors",
                      value <= rating ? "fill-primary text-primary" : "text-muted-foreground",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea id="message" rows={4} {...register("message")} />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
          </div>

          <TurnstileWidget onVerify={(token) => setValue("turnstileToken", token)} />
          {errors.turnstileToken && (
            <p className="text-xs text-destructive">{errors.turnstileToken.message}</p>
          )}

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
