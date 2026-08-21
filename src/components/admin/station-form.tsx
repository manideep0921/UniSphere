"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createStation, updateStation, type StationInput } from "@/actions/stations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Station, StationStatus, TranslationStatus } from "@/types/database";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function StationForm({ station }: { station?: Station }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<StationStatus>(station?.status ?? "operational");
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>(
    station?.translation_status ?? "draft",
  );
  const [isActive, setIsActive] = useState(station?.is_active ?? true);

  async function handleSubmit(formData: FormData) {
    setSaving(true);

    const nameEn = String(formData.get("name_en") ?? "");
    const values: Partial<StationInput> = {
      slug: station?.slug || slugify(String(formData.get("slug") ?? nameEn)),
      name_en: nameEn,
      name_te: String(formData.get("name_te") ?? "") || null,
      description_en: String(formData.get("description_en") ?? "") || null,
      description_te: String(formData.get("description_te") ?? "") || null,
      address: String(formData.get("address") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      district: String(formData.get("district") ?? "") || null,
      latitude: formData.get("latitude") ? Number(formData.get("latitude")) : null,
      longitude: formData.get("longitude") ? Number(formData.get("longitude")) : null,
      google_maps_url: String(formData.get("google_maps_url") ?? "") || null,
      operating_hours: String(formData.get("operating_hours") ?? "24 hours"),
      status,
      charger_count: Number(formData.get("charger_count") ?? 0),
      connector_count: Number(formData.get("connector_count") ?? 0),
      charger_type: String(formData.get("charger_type") ?? "") || null,
      charger_manufacturer: String(formData.get("charger_manufacturer") ?? "") || null,
      equipment_supplier: String(formData.get("equipment_supplier") ?? "") || null,
      equipment_integrator: String(formData.get("equipment_integrator") ?? "") || null,
      charging_network: String(formData.get("charging_network") ?? "") || null,
      translation_status: translationStatus,
      is_active: isActive,
    };

    try {
      if (station) {
        await updateStation(station.id, values);
        toast.success("Station updated");
        router.refresh();
      } else {
        const created = await createStation(values);
        toast.success("Station created");
        router.push(`/admin/stations/${created.id}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name_en">Name (English)</Label>
          <Input id="name_en" name="name_en" defaultValue={station?.name_en} required />
        </div>
        <div>
          <Label htmlFor="name_te">Name (Telugu)</Label>
          <Input id="name_te" name="name_te" defaultValue={station?.name_te ?? ""} />
        </div>
        {!station && (
          <div className="sm:col-span-2">
            <Label htmlFor="slug">Slug (leave blank to auto-generate)</Label>
            <Input id="slug" name="slug" placeholder="auto-generated-from-name" />
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="description_en">Description (English)</Label>
          <Textarea id="description_en" name="description_en" defaultValue={station?.description_en ?? ""} rows={3} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="description_te">Description (Telugu)</Label>
          <Textarea id="description_te" name="description_te" defaultValue={station?.description_te ?? ""} rows={3} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input id="address" name="address" defaultValue={station?.address} required />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" defaultValue={station?.city} required />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" name="state" defaultValue={station?.state} required />
        </div>
        <div>
          <Label htmlFor="district">District</Label>
          <Input id="district" name="district" defaultValue={station?.district ?? ""} />
        </div>
        <div>
          <Label htmlFor="google_maps_url">Google Maps URL</Label>
          <Input id="google_maps_url" name="google_maps_url" defaultValue={station?.google_maps_url ?? ""} />
        </div>
        <div>
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" name="latitude" type="number" step="any" defaultValue={station?.latitude ?? ""} />
        </div>
        <div>
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" name="longitude" type="number" step="any" defaultValue={station?.longitude ?? ""} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="operating_hours">Operating Hours</Label>
          <Input id="operating_hours" name="operating_hours" defaultValue={station?.operating_hours ?? "24 hours"} />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as StationStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="temporarily_unavailable">Temporarily Unavailable</SelectItem>
              <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
              <SelectItem value="coming_soon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="charger_count">Charger Count</Label>
          <Input id="charger_count" name="charger_count" type="number" min={0} defaultValue={station?.charger_count ?? 0} />
        </div>
        <div>
          <Label htmlFor="connector_count">Connector Count</Label>
          <Input
            id="connector_count"
            name="connector_count"
            type="number"
            min={0}
            defaultValue={station?.connector_count ?? 0}
          />
        </div>
        <div>
          <Label htmlFor="charger_type">Charger Type</Label>
          <Input id="charger_type" name="charger_type" placeholder="AC / DC" defaultValue={station?.charger_type ?? ""} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="charger_manufacturer">Charger Manufacturer</Label>
          <Input
            id="charger_manufacturer"
            name="charger_manufacturer"
            defaultValue={station?.charger_manufacturer ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="equipment_supplier">Equipment Supplier</Label>
          <Input id="equipment_supplier" name="equipment_supplier" defaultValue={station?.equipment_supplier ?? ""} />
        </div>
        <div>
          <Label htmlFor="equipment_integrator">Equipment Integrator</Label>
          <Input
            id="equipment_integrator"
            name="equipment_integrator"
            defaultValue={station?.equipment_integrator ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="charging_network">Charging Network</Label>
          <Input id="charging_network" name="charging_network" defaultValue={station?.charging_network ?? ""} />
        </div>
      </section>
      <p className="-mt-4 text-xs text-muted-foreground">
        Charger manufacturer and equipment supplier are independently editable — they are not
        confirmed to be the same entity, so avoid merging them.
      </p>

      <section className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} id="is_active" />
          <Label htmlFor="is_active" className="font-normal">
            Active (visible on public site)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Label className="font-normal">Translation status:</Label>
          <Select value={translationStatus} onValueChange={(v) => setTranslationStatus(v as TranslationStatus)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : station ? "Save Changes" : "Create Station"}
      </Button>
    </form>
  );
}
