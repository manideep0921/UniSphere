"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createService, deleteService, updateService } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import type { Service } from "@/types/database";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(true);

  function openCreate() {
    setEditing(null);
    setIsActive(true);
    setOpen(true);
  }

  function openEdit(service: Service) {
    setEditing(service);
    setIsActive(service.is_active);
    setOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const titleEn = String(formData.get("title_en") ?? "");
    const values = {
      slug: editing?.slug ?? slugify(titleEn),
      title_en: titleEn,
      title_te: String(formData.get("title_te") ?? "") || null,
      description_en: String(formData.get("description_en") ?? "") || null,
      description_te: String(formData.get("description_te") ?? "") || null,
      icon: String(formData.get("icon") ?? "") || null,
      features_en: String(formData.get("features_en") ?? "")
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      is_active: isActive,
    };

    try {
      if (editing) {
        await updateService(editing.id, values);
        toast.success("Service updated");
      } else {
        await createService({ ...values, display_order: services.length });
        toast.success("Service created");
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
    if (!confirm("Delete this service?")) return;
    try {
      await deleteService(id);
      toast.success("Service deleted");
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
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Service" : "New Service"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title_en">Title (English)</Label>
                  <Input id="title_en" name="title_en" defaultValue={editing?.title_en} required />
                </div>
                <div>
                  <Label htmlFor="title_te">Title (Telugu)</Label>
                  <Input id="title_te" name="title_te" defaultValue={editing?.title_te ?? ""} />
                </div>
              </div>
              <div>
                <Label htmlFor="description_en">Description (English)</Label>
                <Textarea
                  id="description_en"
                  name="description_en"
                  defaultValue={editing?.description_en ?? ""}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="description_te">Description (Telugu)</Label>
                <Textarea
                  id="description_te"
                  name="description_te"
                  defaultValue={editing?.description_te ?? ""}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (lucide kebab-case, e.g. &quot;zap&quot;)</Label>
                <Input id="icon" name="icon" defaultValue={editing?.icon ?? ""} />
              </div>
              <div>
                <Label htmlFor="features_en">Features (one per line)</Label>
                <Textarea
                  id="features_en"
                  name="features_en"
                  defaultValue={editing?.features_en.join("\n") ?? ""}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} id="is_active" />
                <Label htmlFor="is_active" className="font-normal">
                  Active (visible on public site)
                </Label>
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
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <DynamicIcon name={service.icon} className="size-4 text-primary" />
              </TableCell>
              <TableCell>{service.title_en}</TableCell>
              <TableCell>
                <Badge variant={service.is_active ? "success" : "secondary"}>
                  {service.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
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
