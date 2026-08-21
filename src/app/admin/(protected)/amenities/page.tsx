import { listAmenities } from "@/actions/amenities";
import { PageHeader } from "@/components/admin/page-header";
import { AmenitiesManager } from "@/components/admin/amenities-manager";

export const metadata = { title: "Amenities" };

export default async function AdminAmenitiesPage() {
  const amenities = await listAmenities();

  return (
    <div>
      <PageHeader title="Amenities" description="Manage the amenities catalog stations can offer." />
      <div className="mt-6">
        <AmenitiesManager amenities={amenities} />
      </div>
    </div>
  );
}
