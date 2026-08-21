"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateFranchiseLeadStatus } from "@/actions/franchise";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FranchiseLead, FranchiseLeadStatus } from "@/types/database";

const STATUS_VARIANT: Record<FranchiseLeadStatus, "secondary" | "warning" | "success" | "destructive"> = {
  new: "secondary",
  contacted: "warning",
  qualified: "warning",
  converted: "success",
  rejected: "destructive",
};

const STATUSES: FranchiseLeadStatus[] = ["new", "contacted", "qualified", "converted", "rejected"];

export function FranchiseLeadsManager({ leads }: { leads: FranchiseLead[] }) {
  const router = useRouter();

  async function handleStatusChange(id: string, status: FranchiseLeadStatus) {
    try {
      await updateFranchiseLeadStatus(id, status);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  if (leads.length === 0) {
    return <p className="text-muted-foreground">No franchise enquiries yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Has Land</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>{lead.name}</TableCell>
            <TableCell>
              <div className="text-sm">{lead.phone}</div>
              {lead.email && <div className="text-xs text-muted-foreground">{lead.email}</div>}
            </TableCell>
            <TableCell>
              {[lead.preferred_location, lead.city, lead.state].filter(Boolean).join(", ") || "—"}
            </TableCell>
            <TableCell>
              <Badge variant={lead.has_land ? "success" : "secondary"}>
                {lead.has_land ? "Yes" : "No"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[lead.status]}>{lead.status}</Badge>
                <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v as FranchiseLeadStatus)}>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
