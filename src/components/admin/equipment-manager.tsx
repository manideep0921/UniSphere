"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createEquipment, deleteEquipment, updateEquipment } from "@/actions/equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import type { ChargerType, Equipment } from "@/types/database";

function splitList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function EquipmentManager({ equipment }: { equipment: Equipment[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [saving, setSaving] = useState(false);
  const [chargerType, setChargerType] = useState<ChargerType | "">("");
  const [emergencyButton, setEmergencyButton] = useState(false);

  function openCreate() {
    setEditing(null);
    setChargerType("");
    setEmergencyButton(false);
    setOpen(true);
  }

  function openEdit(item: Equipment) {
    setEditing(item);
    setChargerType(item.charger_type ?? "");
    setEmergencyButton(item.emergency_button);
    setOpen(true);
  }

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    const values = {
      manufacturer: String(formData.get("manufacturer") ?? ""),
      supplier: String(formData.get("supplier") ?? "") || null,
      model: String(formData.get("model") ?? "") || null,
      power_rating: String(formData.get("power_rating") ?? "") || null,
      charger_type: chargerType || null,
      output_voltage: String(formData.get("output_voltage") ?? "") || null,
      connector_type: String(formData.get("connector_type") ?? "") || null,
      number_of_connectors: formData.get("number_of_connectors")
        ? Number(formData.get("number_of_connectors"))
        : null,
      communication_protocol: String(formData.get("communication_protocol") ?? "") || null,
      authentication_methods: splitList(formData.get("authentication_methods")),
      display: String(formData.get("display") ?? "") || null,
      emergency_button: emergencyButton,
      ip_rating: String(formData.get("ip_rating") ?? "") || null,
      cooling_method: String(formData.get("cooling_method") ?? "") || null,
      protection_features: splitList(formData.get("protection_features")),
      cable_length: String(formData.get("cable_length") ?? "") || null,
      installation_method: String(formData.get("installation_method") ?? "") || null,
      is_active: true,
    };

    try {
      if (editing) {
        await updateEquipment(editing.id, values);
        toast.success("Equipment updated");
      } else {
        await createEquipment(values);
        toast.success("Equipment created");
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
    if (!confirm("Delete this equipment?")) return;
    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted");
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
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Equipment" : "New Equipment"}</DialogTitle>
            </DialogHeader>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" name="manufacturer" defaultValue={editing?.manufacturer} required />
                </div>
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" name="supplier" defaultValue={editing?.supplier ?? ""} />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" defaultValue={editing?.model ?? ""} />
                </div>
                <div>
                  <Label>Charger Type</Label>
                  <Select value={chargerType || undefined} onValueChange={(v) => setChargerType(v as ChargerType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AC">AC</SelectItem>
                      <SelectItem value="DC">DC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="power_rating">Power Rating</Label>
                  <Input
                    id="power_rating"
                    name="power_rating"
                    placeholder="e.g. 120 kW / 180 kW / 240 kW"
                    defaultValue={editing?.power_rating ?? ""}
                  />
                </div>
                <div>
                  <Label htmlFor="output_voltage">Output Voltage</Label>
                  <Input id="output_voltage" name="output_voltage" defaultValue={editing?.output_voltage ?? ""} />
                </div>
                <div>
                  <Label htmlFor="connector_type">Connector Type</Label>
                  <Input id="connector_type" name="connector_type" defaultValue={editing?.connector_type ?? ""} />
                </div>
                <div>
                  <Label htmlFor="number_of_connectors">Number of Connectors</Label>
                  <Input
                    id="number_of_connectors"
                    name="number_of_connectors"
                    type="number"
                    min={0}
                    defaultValue={editing?.number_of_connectors ?? ""}
                  />
                </div>
                <div>
                  <Label htmlFor="communication_protocol">Communication Protocol</Label>
                  <Input
                    id="communication_protocol"
                    name="communication_protocol"
                    placeholder="e.g. OCPP 1.6 (LAN / 4G / 5G)"
                    defaultValue={editing?.communication_protocol ?? ""}
                  />
                </div>
                <div>
                  <Label htmlFor="display">Display</Label>
                  <Input id="display" name="display" placeholder="e.g. 7 inch" defaultValue={editing?.display ?? ""} />
                </div>
                <div>
                  <Label htmlFor="ip_rating">IP Rating</Label>
                  <Input id="ip_rating" name="ip_rating" defaultValue={editing?.ip_rating ?? ""} />
                </div>
                <div>
                  <Label htmlFor="cooling_method">Cooling Method</Label>
                  <Input id="cooling_method" name="cooling_method" defaultValue={editing?.cooling_method ?? ""} />
                </div>
                <div>
                  <Label htmlFor="cable_length">Cable Length</Label>
                  <Input id="cable_length" name="cable_length" defaultValue={editing?.cable_length ?? ""} />
                </div>
                <div>
                  <Label htmlFor="installation_method">Installation Method</Label>
                  <Input
                    id="installation_method"
                    name="installation_method"
                    defaultValue={editing?.installation_method ?? ""}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="authentication_methods">Authentication Methods (comma-separated)</Label>
                <Input
                  id="authentication_methods"
                  name="authentication_methods"
                  placeholder="Manual, RFID, Mobile App"
                  defaultValue={editing?.authentication_methods.join(", ") ?? ""}
                />
              </div>
              <div>
                <Label htmlFor="protection_features">Protection Features (comma-separated)</Label>
                <Input
                  id="protection_features"
                  name="protection_features"
                  placeholder="Over voltage, Short circuit, ..."
                  defaultValue={editing?.protection_features.join(", ") ?? ""}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={emergencyButton} onCheckedChange={setEmergencyButton} id="emergency_button" />
                <Label htmlFor="emergency_button" className="font-normal">
                  Has emergency button
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
            <TableHead>Manufacturer</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Power Rating</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipment.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.manufacturer}</TableCell>
              <TableCell>{item.model ?? "—"}</TableCell>
              <TableCell>{item.charger_type ?? "—"}</TableCell>
              <TableCell>{item.power_rating ?? "—"}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
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
