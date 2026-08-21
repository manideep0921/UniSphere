"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Amenity } from "@/types/database";

export async function listStationAmenities(stationId: string): Promise<Amenity[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_amenities")
    .select("amenities(*)")
    .eq("station_id", stationId);

  if (error) throw error;
  return ((data ?? []) as unknown as { amenities: Amenity }[]).map((row) => row.amenities);
}

export async function assignAmenityToStation(stationId: string, amenityId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("station_amenities")
    .upsert(
      { station_id: stationId, amenity_id: amenityId },
      { onConflict: "station_id,amenity_id" },
    );

  if (error) throw error;
  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
}

export async function unassignAmenityFromStation(stationId: string, amenityId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("station_amenities")
    .delete()
    .eq("station_id", stationId)
    .eq("amenity_id", amenityId);

  if (error) throw error;
  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
}
