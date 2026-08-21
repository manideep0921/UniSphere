"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { submitFranchiseLead } from "@/actions/franchise";
import { franchiseLeadSchema, type FranchiseLeadInput } from "@/lib/validations/franchise";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";

export function FranchiseForm() {
  const t = useTranslations("franchise");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FranchiseLeadInput>({
    resolver: zodResolver(franchiseLeadSchema),
    defaultValues: { hasLand: false, turnstileToken: "" },
  });

  const hasLand = watch("hasLand");

  async function onSubmit(values: FranchiseLeadInput) {
    setServerError(null);
    const result = await submitFranchiseLead(values);

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
        <CardTitle>{t("formTitle")}</CardTitle>
        <CardDescription>{t("formSubtitle")}</CardDescription>
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
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="preferredLocation">{t("preferredLocation")}</Label>
              <Input id="preferredLocation" {...register("preferredLocation")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="city">{t("city")}</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div>
              <Label htmlFor="state">{t("state")}</Label>
              <Input id="state" {...register("state")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="propertyType">{t("propertyType")}</Label>
              <Input id="propertyType" {...register("propertyType")} />
            </div>
            <div>
              <Label htmlFor="investmentRange">{t("investmentRange")}</Label>
              <Input
                id="investmentRange"
                placeholder={t("investmentRangeContactUs")}
                {...register("investmentRange")}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="hasLand"
              checked={hasLand}
              onCheckedChange={(checked) => setValue("hasLand", checked === true)}
            />
            <Label htmlFor="hasLand" className="font-normal">
              {t("hasLand")}
            </Label>
          </div>

          <div>
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea id="message" rows={4} {...register("message")} />
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
