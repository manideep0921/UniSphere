import { PageHeader } from "@/components/admin/page-header";
import { StationForm } from "@/components/admin/station-form";

export const metadata = { title: "New Station" };

export default function NewStationPage() {
  return (
    <div>
      <PageHeader title="New Station" description="Create a new charging station." />
      <div className="mt-6 max-w-3xl">
        <StationForm />
      </div>
    </div>
  );
}
