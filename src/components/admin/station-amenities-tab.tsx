"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { assignAmenityToStation, unassignAmenityFromStation } from "@/actions/station-amenities";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import type { Amenity } from "@/types/database";

export function StationAmenitiesTab({
  stationId,
  allAmenities,
  assigned,
}: {
  stationId: string;
  allAmenities: Amenity[];
  assigned: Amenity[];
}) {
  const router = useRouter();
  const assignedIds = new Set(assigned.map((a) => a.id));

  async function handleToggle(amenityId: string, checked: boolean) {
    try {
      if (checked) {
        await assignAmenityToStation(stationId, amenityId);
      } else {
        await unassignAmenityFromStation(stationId, amenityId);
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {allAmenities.map((amenity) => (
        <label
          key={amenity.id}
          className="flex items-center gap-3 rounded-md border border-border p-3"
        >
          <Checkbox
            checked={assignedIds.has(amenity.id)}
            onCheckedChange={(checked) => handleToggle(amenity.id, checked === true)}
          />
          <DynamicIcon name={amenity.icon} className="size-4 text-primary" />
          <Label className="font-normal">{amenity.name_en}</Label>
        </label>
      ))}
    </div>
  );
}
