import { listFeedbackForAdmin } from "@/actions/feedback";
import { PageHeader } from "@/components/admin/page-header";
import { FeedbackManager } from "@/components/admin/feedback-manager";

export const metadata = { title: "Feedback" };

export default async function AdminFeedbackPage() {
  const feedback = await listFeedbackForAdmin();

  return (
    <div>
      <PageHeader
        title="Feedback"
        description="Moderate customer feedback and choose which reviews appear as testimonials on the home page."
      />
      <div className="mt-6">
        <FeedbackManager feedback={feedback} />
      </div>
    </div>
  );
}
