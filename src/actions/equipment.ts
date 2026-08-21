"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Equipment } from "@/types/database";

export async function listEquipment(): Promise<Equipment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listEquipmentForAdmin(): Promise<Equipment[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type EquipmentInput = Omit<Equipment, "id" | "created_at" | "updated_at">;

export async function createEquipment(input: Partial<EquipmentInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.from("equipment").insert(input).select().single();
  if (error) throw error;

  revalidatePath("/[locale]/technology", "page");
  revalidatePath("/admin/equipment");
  return data;
}

export async function updateEquipment(id: string, input: Partial<EquipmentInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("equipment")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/[locale]/technology", "page");
  revalidatePath("/admin/equipment");
  return data;
}

export async function deleteEquipment(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("equipment").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/[locale]/technology", "page");
  revalidatePath("/admin/equipment");
}
