"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { replyToFeedback, toggleFeedbackFeatured, updateFeedbackStatus } from "@/actions/feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Feedback, FeedbackStatus } from "@/types/database";

const STATUS_VARIANT: Record<FeedbackStatus, "secondary" | "success" | "destructive"> = {
  new: "secondary",
  reviewed: "success",
  hidden: "destructive",
};

export function FeedbackManager({ feedback }: { feedback: Feedback[] }) {
  const router = useRouter();

  return (
    <div className="grid gap-4">
      {feedback.length === 0 && (
        <p className="text-muted-foreground">No feedback submitted yet.</p>
      )}
      {feedback.map((item) => (
        <FeedbackRow key={item.id} item={item} onChange={() => router.refresh()} />
      ))}
    </div>
  );
}

function FeedbackRow({ item, onChange }: { item: Feedback; onChange: () => void }) {
  const [reply, setReply] = useState(item.admin_reply ?? "");
  const [savingReply, setSavingReply] = useState(false);

  async function handleStatusChange(status: FeedbackStatus) {
    try {
      await updateFeedbackStatus(item.id, status);
      onChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function handleFeaturedToggle(checked: boolean) {
    try {
      await toggleFeedbackFeatured(item.id, checked);
      toast.success(checked ? "Marked as featured testimonial" : "Removed from testimonials");
      onChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function handleReply() {
    setSavingReply(true);
    try {
      await replyToFeedback(item.id, reply);
      toast.success("Reply saved");
      onChange();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSavingReply(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{item.name}</p>
              <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
            </div>
            <div className="mt-1 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3.5 ${i < item.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {[item.email, item.phone].filter(Boolean).join(" · ") || "No contact info provided"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Select value={item.status} onValueChange={(v) => handleStatusChange(v as FeedbackStatus)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={item.is_featured} onCheckedChange={handleFeaturedToggle} />
              <span className="text-sm text-muted-foreground">Featured</span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm">{item.message}</p>

        <div className="mt-4 space-y-2">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write an internal/admin reply..."
            rows={2}
          />
          <Button size="sm" variant="outline" onClick={handleReply} disabled={savingReply}>
            {savingReply ? "Saving..." : "Save Reply"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
