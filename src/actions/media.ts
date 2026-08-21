"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Media, MediaCategory } from "@/types/database";

const BUCKET = "media";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function listMedia(filter: {
  stationId?: string;
  equipmentId?: string;
  category?: MediaCategory;
}): Promise<Media[]> {
  const supabase = await createClient();
  let query = supabase.from("media").select("*").order("display_order", { ascending: true });

  if (filter.stationId) query = query.eq("station_id", filter.stationId);
  if (filter.equipmentId) query = query.eq("equipment_id", filter.equipmentId);
  if (filter.category) query = query.eq("category", filter.category);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function uploadMedia(input: {
  file: File;
  category: MediaCategory;
  stationId?: string;
  equipmentId?: string;
  altText?: string;
  displayOrder?: number;
}) {
  await requireAdmin();

  if (!ALLOWED_TYPES.includes(input.file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or AVIF images are allowed.");
  }
  if (input.file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Images must be 5MB or smaller.");
  }

  const admin = createAdminClient();
  const extension = input.file.name.split(".").pop() ?? "jpg";
  const storagePath = `${input.category}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(storagePath, input.file, { contentType: input.file.type });

  if (uploadError) throw uploadError;

  const { data, error } = await admin
    .from("media")
    .insert({
      category: input.category,
      station_id: input.stationId ?? null,
      equipment_id: input.equipmentId ?? null,
      storage_path: storagePath,
      alt_text: input.altText ?? null,
      display_order: input.displayOrder ?? 0,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
  return data;
}

export async function deleteMedia(id: string, storagePath: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error: storageError } = await admin.storage.from(BUCKET).remove([storagePath]);
  if (storageError) throw storageError;

  const { error } = await admin.from("media").delete().eq("id", id);
  if (error) throw error;

  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
}

export async function reorderMedia(orderedIds: string[]) {
  await requireAdmin();
  const admin = createAdminClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      admin.from("media").update({ display_order: index }).eq("id", id),
    ),
  );

  revalidatePath("/admin/stations");
}

export function getMediaPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
