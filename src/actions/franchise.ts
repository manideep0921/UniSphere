"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { franchiseLeadSchema, type FranchiseLeadInput } from "@/lib/validations/franchise";
import type { FranchiseLead, FranchiseLeadStatus } from "@/types/database";

export type FranchiseFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof FranchiseLeadInput, string>>;
};

export async function submitFranchiseLead(
  input: FranchiseLeadInput,
): Promise<FranchiseFormState> {
  const parsed = franchiseLeadSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors: FranchiseFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FranchiseLeadInput;
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
  const { error } = await admin.from("franchise_leads").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    city: parsed.data.city || null,
    state: parsed.data.state || null,
    preferred_location: parsed.data.preferredLocation || null,
    has_land: parsed.data.hasLand,
    property_type: parsed.data.propertyType || null,
    investment_range: parsed.data.investmentRange || null,
    message: parsed.data.message || null,
  });

  if (error) {
    console.error("Failed to insert franchise lead", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  revalidatePath("/admin/franchise-leads");
  return { status: "success" };
}

export async function listFranchiseLeadsForAdmin(): Promise<FranchiseLead[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("franchise_leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function updateFranchiseLeadStatus(id: string, status: FranchiseLeadStatus) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("franchise_leads").update({ status }).eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/franchise-leads");
}
