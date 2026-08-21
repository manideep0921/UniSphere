import { Zap, Tag, MessageSquare, Users } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Dashboard" };

async function getMetrics() {
  const supabase = await createClient();

  const [stations, operationalStations, offers, newFeedback, newLeads] = await Promise.all([
    supabase.from("stations").select("id", { count: "exact", head: true }),
    supabase
      .from("stations")
      .select("id", { count: "exact", head: true })
      .eq("status", "operational"),
    supabase.from("coupons").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("feedback").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("franchise_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return {
    totalStations: stations.count ?? 0,
    operationalStations: operationalStations.count ?? 0,
    activeOffers: offers.count ?? 0,
    newFeedback: newFeedback.count ?? 0,
    newLeads: newLeads.count ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const metrics = await getMetrics();

  const cards = [
    {
      label: "Stations",
      value: `${metrics.operationalStations} / ${metrics.totalStations}`,
      hint: "Operational / Total",
      icon: Zap,
    },
    { label: "Active Offers", value: metrics.activeOffers, icon: Tag },
    { label: "New Feedback", value: metrics.newFeedback, icon: MessageSquare },
    { label: "New Franchise Leads", value: metrics.newLeads, icon: Users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your RM EV Services content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <card.icon className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {"hint" in card && card.hint && (
                <p className="text-xs text-muted-foreground">{card.hint}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
