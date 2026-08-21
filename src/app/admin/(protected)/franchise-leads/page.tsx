import { listFranchiseLeadsForAdmin } from "@/actions/franchise";
import { PageHeader } from "@/components/admin/page-header";
import { FranchiseLeadsManager } from "@/components/admin/franchise-leads-manager";

export const metadata = { title: "Franchise Leads" };

export default async function AdminFranchiseLeadsPage() {
  const leads = await listFranchiseLeadsForAdmin();

  return (
    <div>
      <PageHeader title="Franchise Leads" description="Track and update franchise enquiries." />
      <div className="mt-6">
        <FranchiseLeadsManager leads={leads} />
      </div>
    </div>
  );
}
