import { notFound } from "next/navigation";

import { getStationById } from "@/actions/stations";
import { listEquipmentForAdmin } from "@/actions/equipment";
import { listStationEquipment } from "@/actions/station-equipment";
import { listAmenities } from "@/actions/amenities";
import { listStationAmenities } from "@/actions/station-amenities";
import { listMedia } from "@/actions/media";
import { PageHeader } from "@/components/admin/page-header";
import { StationForm } from "@/components/admin/station-form";
import { StationEquipmentTab } from "@/components/admin/station-equipment-tab";
import { StationAmenitiesTab } from "@/components/admin/station-amenities-tab";
import { StationMediaTab } from "@/components/admin/station-media-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = { title: "Edit Station" };

export default async function EditStationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await getStationById(id);
  if (!station) notFound();

  const [allEquipment, assignedEquipment, allAmenities, assignedAmenities, media] =
    await Promise.all([
      listEquipmentForAdmin(),
      listStationEquipment(station.id),
      listAmenities(),
      listStationAmenities(station.id),
      listMedia({ stationId: station.id }),
    ]);

  return (
    <div>
      <PageHeader title={station.name_en} description="Manage this station's details, equipment, amenities, and photos." />

      <Tabs defaultValue="details" className="mt-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="amenities">Amenities</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="max-w-3xl">
          <StationForm station={station} />
        </TabsContent>

        <TabsContent value="equipment">
          <StationEquipmentTab
            stationId={station.id}
            allEquipment={allEquipment}
            assigned={assignedEquipment}
          />
        </TabsContent>

        <TabsContent value="amenities">
          <StationAmenitiesTab
            stationId={station.id}
            allAmenities={allAmenities}
            assigned={assignedAmenities}
          />
        </TabsContent>

        <TabsContent value="media">
          <StationMediaTab stationId={station.id} media={media} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
