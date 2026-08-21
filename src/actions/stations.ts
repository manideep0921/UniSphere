"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Station, StationStatus } from "@/types/database";

export async function listStations(): Promise<Station[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function listStationsForAdmin(): Promise<Station[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function getStationBySlug(slug: string): Promise<Station | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getStationById(id: string): Promise<Station | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stations")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type StationInput = Omit<
  Station,
  "id" | "created_at" | "updated_at"
>;

export async function createStation(input: Partial<StationInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("stations")
    .insert(input)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/[locale]/stations", "page");
  revalidatePath("/admin/stations");
  return data;
}

export async function updateStation(id: string, input: Partial<StationInput>) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("stations")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/[locale]/stations", "page");
  revalidatePath(`/[locale]/stations/${data.slug}`, "page");
  revalidatePath("/admin/stations");
  return data;
}

export async function deactivateStation(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("stations")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/[locale]/stations", "page");
  revalidatePath("/admin/stations");
}

export async function updateStationStatus(id: string, status: StationStatus) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("stations").update({ status }).eq("id", id);

  if (error) throw error;

  revalidatePath("/[locale]/stations", "page");
  revalidatePath("/admin/stations");
}
