"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createAmenity, deleteAmenity, updateAmenity } from "@/actions/amenities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import type { Amenity } from "@/types/database";

export function AmenitiesManager({ amenities }: { amenities: Amenity[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [saving, setSaving] = useState(false);

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(amenity: Amenity) {
    setEditing(amenity);
    setOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const values = {
      name_en: String(formData.get("name_en") ?? ""),
      name_te: String(formData.get("name_te") ?? "") || null,
      icon: String(formData.get("icon") ?? "") || null,
    };

    try {
      if (editing) {
        await updateAmenity(editing.id, values);
        toast.success("Amenity updated");
      } else {
        await createAmenity(values);
        toast.success("Amenity created");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this amenity?")) return;
    try {
      await deleteAmenity(id);
      toast.success("Amenity deleted");
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
              Add Amenity
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Amenity" : "New Amenity"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name_en">Name (English)</Label>
                <Input id="name_en" name="name_en" defaultValue={editing?.name_en} required />
              </div>
              <div>
                <Label htmlFor="name_te">Name (Telugu)</Label>
                <Input id="name_te" name="name_te" defaultValue={editing?.name_te ?? ""} />
              </div>
              <div>
                <Label htmlFor="icon">Icon (lucide kebab-case, e.g. &quot;circle-parking&quot;)</Label>
                <Input id="icon" name="icon" defaultValue={editing?.icon ?? ""} />
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
            <TableHead>Icon</TableHead>
            <TableHead>Name (EN)</TableHead>
            <TableHead>Name (TE)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {amenities.map((amenity) => (
            <TableRow key={amenity.id}>
              <TableCell>
                <DynamicIcon name={amenity.icon} className="size-4 text-primary" />
              </TableCell>
              <TableCell>{amenity.name_en}</TableCell>
              <TableCell>{amenity.name_te ?? "—"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(amenity)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(amenity.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
