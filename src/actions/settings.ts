"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { SiteSetting } from "@/types/database";

export async function getSiteSettings(): Promise<Record<string, SiteSetting>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*");

  if (error) throw error;
  return Object.fromEntries((data ?? []).map((setting) => [setting.key, setting]));
}

export async function getSiteSetting(key: string): Promise<SiteSetting | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function listSettingsForAdmin(): Promise<SiteSetting[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").order("key");

  if (error) throw error;
  return data ?? [];
}

export async function updateSiteSetting(
  key: string,
  values: { value_en?: string | null; value_te?: string | null },
) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("site_settings")
    .update(values)
    .eq("key", key);

  if (error) throw error;

  revalidatePath("/[locale]", "page");
  revalidatePath("/admin/settings");
}
