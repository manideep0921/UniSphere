"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Coupon } from "@/types/database";

export async function listActiveOffers(): Promise<Coupon[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listOffersForAdmin(): Promise<Coupon[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export type CouponInput = Omit<Coupon, "id" | "created_at" | "updated_at">;

export async function createOffer(input: Partial<CouponInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.from("coupons").insert(input).select().single();
  if (error) throw error;

  revalidatePath("/[locale]/offers", "page");
  revalidatePath("/admin/offers");
  return data;
}

export async function updateOffer(id: string, input: Partial<CouponInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("coupons")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/[locale]/offers", "page");
  revalidatePath("/admin/offers");
  return data;
}

export async function deactivateOffer(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("coupons").update({ status: "disabled" }).eq("id", id);
  if (error) throw error;

  revalidatePath("/[locale]/offers", "page");
  revalidatePath("/admin/offers");
}
