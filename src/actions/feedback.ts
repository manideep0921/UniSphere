"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { feedbackSchema, type FeedbackInput } from "@/lib/validations/feedback";
import type { Feedback, FeedbackStatus } from "@/types/database";

export type FeedbackFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof FeedbackInput, string>>;
};

export async function submitFeedback(
  input: FeedbackInput,
): Promise<FeedbackFormState> {
  const parsed = feedbackSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: FeedbackFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FeedbackInput;
      fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please check the form and try again.", fieldErrors };
  }

  const requestHeaders = await headers();
  const remoteIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();

  const verified = await verifyTurnstileToken(parsed.data.turnstileToken, remoteIp);
  if (!verified) {
    return { status: "error", message: "Verification failed. Please try again." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("feedback").insert({
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    station_id: parsed.data.stationId || null,
    rating: parsed.data.rating,
    message: parsed.data.message,
  });

  if (error) {
    console.error("Failed to insert feedback", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/[locale]", "page");
  revalidatePath("/admin/feedback");
  return { status: "success" };
}

export async function listFeaturedFeedback(): Promise<Feedback[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "reviewed")
    .order("created_at", { ascending: false })
    .limit(9);

  if (error) throw error;
  return data ?? [];
}

export async function listFeedbackForAdmin(): Promise<Feedback[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("feedback").update({ status }).eq("id", id);
  if (error) throw error;

  revalidatePath("/[locale]", "page");
  revalidatePath("/admin/feedback");
}

export async function toggleFeedbackFeatured(id: string, isFeatured: boolean) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("feedback")
    .update({ is_featured: isFeatured })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/[locale]", "page");
  revalidatePath("/admin/feedback");
}

export async function replyToFeedback(id: string, adminReply: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("feedback")
    .update({ admin_reply: adminReply, status: "reviewed" })
    .eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/feedback");
}
