"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { Equipment, StationEquipment } from "@/types/database";

export async function listStationEquipment(
  stationId: string,
): Promise<(StationEquipment & { equipment: Equipment })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("station_equipment")
    .select("*, equipment(*)")
    .eq("station_id", stationId);

  if (error) throw error;
  return (data ?? []) as unknown as (StationEquipment & { equipment: Equipment })[];
}

export async function assignEquipmentToStation(
  stationId: string,
  equipmentId: string,
  quantity = 1,
) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("station_equipment")
    .upsert(
      { station_id: stationId, equipment_id: equipmentId, quantity },
      { onConflict: "station_id,equipment_id" },
    );

  if (error) throw error;
  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
}

export async function unassignEquipmentFromStation(stationId: string, equipmentId: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("station_equipment")
    .delete()
    .eq("station_id", stationId)
    .eq("equipment_id", equipmentId);

  if (error) throw error;
  revalidatePath("/admin/stations");
  revalidatePath("/[locale]/stations", "page");
}

export async function updateStationEquipmentQuantity(
  stationId: string,
  equipmentId: string,
  quantity: number,
) {
  await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("station_equipment")
    .update({ quantity })
    .eq("station_id", stationId)
    .eq("equipment_id", equipmentId);

  if (error) throw error;
  revalidatePath("/admin/stations");
}
