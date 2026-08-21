import { listOffersForAdmin } from "@/actions/offers";
import { PageHeader } from "@/components/admin/page-header";
import { OffersManager } from "@/components/admin/offers-manager";

export const metadata = { title: "Offers" };

export default async function AdminOffersPage() {
  const offers = await listOffersForAdmin();

  return (
    <div>
      <PageHeader title="Offers" description="Manage coupons and offers shown on the public Offers page." />
      <div className="mt-6">
        <OffersManager offers={offers} />
      </div>
    </div>
  );
}
