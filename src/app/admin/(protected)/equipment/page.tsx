import { listEquipmentForAdmin } from "@/actions/equipment";
import { PageHeader } from "@/components/admin/page-header";
import { EquipmentManager } from "@/components/admin/equipment-manager";

export const metadata = { title: "Equipment" };

export default async function AdminEquipmentPage() {
  const equipment = await listEquipmentForAdmin();

  return (
    <div>
      <PageHeader
        title="Equipment"
        description="Manage the charger/equipment catalog shown on the Technology page and assignable to stations."
      />
      <div className="mt-6">
        <EquipmentManager equipment={equipment} />
      </div>
    </div>
  );
}
