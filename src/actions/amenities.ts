"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Amenity } from "@/types/database";

export async function listAmenities(): Promise<Amenity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("amenities").select("*").order("name_en");

  if (error) throw error;
  return data ?? [];
}

export type AmenityInput = Omit<Amenity, "id" | "created_at" | "updated_at">;

export async function createAmenity(input: Partial<AmenityInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.from("amenities").insert(input).select().single();
  if (error) throw error;

  revalidatePath("/admin/amenities");
  return data;
}

export async function updateAmenity(id: string, input: Partial<AmenityInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("amenities")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/admin/amenities");
  return data;
}

export async function deleteAmenity(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("amenities").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/amenities");
}
