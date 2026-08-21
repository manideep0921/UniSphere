import { listSettingsForAdmin } from "@/actions/settings";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsManager } from "@/components/admin/settings-manager";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await listSettingsForAdmin();

  return (
    <div>
      <PageHeader title="Settings" description="Site-wide marketing copy and contact details." />
      <div className="mt-6">
        <SettingsManager settings={settings} />
      </div>
    </div>
  );
}
