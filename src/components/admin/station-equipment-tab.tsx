"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  assignEquipmentToStation,
  unassignEquipmentFromStation,
  updateStationEquipmentQuantity,
} from "@/actions/station-equipment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Equipment, StationEquipment } from "@/types/database";

export function StationEquipmentTab({
  stationId,
  allEquipment,
  assigned,
}: {
  stationId: string;
  allEquipment: Equipment[];
  assigned: (StationEquipment & { equipment: Equipment })[];
}) {
  const router = useRouter();
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [assigning, setAssigning] = useState(false);

  const unassignedEquipment = allEquipment.filter(
    (item) => !assigned.some((row) => row.equipment_id === item.id),
  );

  async function handleAssign() {
    if (!selectedEquipmentId) return;
    setAssigning(true);
    try {
      await assignEquipmentToStation(stationId, selectedEquipmentId, quantity);
      toast.success("Equipment assigned");
      setSelectedEquipmentId("");
      setQuantity(1);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setAssigning(false);
    }
  }

  async function handleQuantityChange(equipmentId: string, value: number) {
    try {
      await updateStationEquipmentQuantity(stationId, equipmentId, value);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  async function handleRemove(equipmentId: string) {
    try {
      await unassignEquipmentFromStation(stationId, equipmentId);
      toast.success("Equipment removed");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56">
          <Select value={selectedEquipmentId} onValueChange={setSelectedEquipmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select equipment to assign" />
            </SelectTrigger>
            <SelectContent>
              {unassignedEquipment.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.manufacturer} {item.model ?? ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={handleAssign} disabled={!selectedEquipmentId || assigning}>
          {assigning ? "Assigning..." : "Assign"}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Equipment</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assigned.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                {row.equipment.manufacturer} {row.equipment.model ?? ""}
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  defaultValue={row.quantity}
                  className="w-20"
                  onBlur={(e) => handleQuantityChange(row.equipment_id, Number(e.target.value))}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleRemove(row.equipment_id)}>
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
