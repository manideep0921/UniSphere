"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Service } from "@/types/database";

export async function listActiveServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listServicesForAdmin(): Promise<Service[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export type ServiceInput = Omit<Service, "id" | "created_at" | "updated_at">;

export async function createService(input: Partial<ServiceInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin.from("services").insert(input).select().single();
  if (error) throw error;

  revalidatePath("/[locale]/services", "page");
  revalidatePath("/admin/services");
  return data;
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("services")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/[locale]/services", "page");
  revalidatePath("/admin/services");
  return data;
}

export async function deleteService(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("services").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/[locale]/services", "page");
  revalidatePath("/admin/services");
}

export async function reorderServices(orderedIds: string[]) {
  await requireAdmin();
  const admin = createAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      admin.from("services").update({ display_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/[locale]/services", "page");
  revalidatePath("/admin/services");
}
