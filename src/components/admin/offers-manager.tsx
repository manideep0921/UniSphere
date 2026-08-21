"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Ban } from "lucide-react";
import { toast } from "sonner";

import { createOffer, deactivateOffer, updateOffer } from "@/actions/offers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Coupon, CouponStatus, DiscountType } from "@/types/database";

const STATUS_VARIANT: Record<CouponStatus, "success" | "secondary" | "warning" | "destructive"> = {
  draft: "secondary",
  active: "success",
  expired: "warning",
  disabled: "destructive",
};

export function OffersManager({ offers }: { offers: Coupon[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<CouponStatus>("draft");
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");

  function openCreate() {
    setEditing(null);
    setStatus("draft");
    setDiscountType("percentage");
    setOpen(true);
  }

  function openEdit(offer: Coupon) {
    setEditing(offer);
    setStatus(offer.status);
    setDiscountType(offer.discount_type);
    setOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const values = {
      code: String(formData.get("code") ?? "").toUpperCase(),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      discount_type: discountType,
      discount_value: Number(formData.get("discount_value") ?? 0),
      valid_from: String(formData.get("valid_from") ?? "") || new Date().toISOString().slice(0, 10),
      valid_until: String(formData.get("valid_until") ?? "") || null,
      usage_limit: formData.get("usage_limit") ? Number(formData.get("usage_limit")) : null,
      status,
    };

    try {
      if (editing) {
        await updateOffer(editing.id, values);
        toast.success("Offer updated");
      } else {
        await createOffer(values);
        toast.success("Offer created");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this offer?")) return;
    try {
      await deactivateOffer(id);
      toast.success("Offer deactivated");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Add Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Offer" : "New Offer"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" name="code" defaultValue={editing?.code} required />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editing?.title} required />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editing?.description ?? ""} rows={2} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Discount Type</Label>
                  <Select value={discountType} onValueChange={(v) => setDiscountType(v as DiscountType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <Input
                    id="discount_value"
                    name="discount_value"
                    type="number"
                    step="0.01"
                    defaultValue={editing?.discount_value}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="valid_from">Valid From</Label>
                  <Input
                    id="valid_from"
                    name="valid_from"
                    type="date"
                    defaultValue={editing?.valid_from ?? new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div>
                  <Label htmlFor="valid_until">Valid Until</Label>
                  <Input id="valid_until" name="valid_until" type="date" defaultValue={editing?.valid_until ?? ""} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="usage_limit">Usage Limit (optional)</Label>
                  <Input id="usage_limit" name="usage_limit" type="number" defaultValue={editing?.usage_limit ?? ""} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as CouponStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell className="font-mono">{offer.code}</TableCell>
              <TableCell>{offer.title}</TableCell>
              <TableCell>
                {offer.discount_type === "percentage" ? `${offer.discount_value}%` : `₹${offer.discount_value}`}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[offer.status]}>{offer.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(offer)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeactivate(offer.id)}>
                  <Ban className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
