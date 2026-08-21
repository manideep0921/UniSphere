import { listServicesForAdmin } from "@/actions/services";
import { PageHeader } from "@/components/admin/page-header";
import { ServicesManager } from "@/components/admin/services-manager";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await listServicesForAdmin();

  return (
    <div>
      <PageHeader title="Services" description="Manage the services shown on the public Services page." />
      <div className="mt-6">
        <ServicesManager services={services} />
      </div>
    </div>
  );
}
