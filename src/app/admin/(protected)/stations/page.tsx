import Link from "next/link";
import { Plus } from "lucide-react";

import { listStationsForAdmin } from "@/actions/stations";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { STATION_STATUS_VARIANT } from "@/lib/constants/site";

export const metadata = { title: "Stations" };

export default async function AdminStationsPage() {
  const stations = await listStationsForAdmin();

  return (
    <div>
      <PageHeader
        title="Stations"
        description="Manage charging stations, their equipment, amenities, and media."
        action={
          <Button asChild>
            <Link href="/admin/stations/new">
              <Plus className="size-4" />
              Add Station
            </Link>
          </Button>
        }
      />

      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Chargers</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/admin/stations/${station.id}`} className="font-medium hover:underline">
                  {station.name_en}
                </Link>
              </TableCell>
              <TableCell>{station.city}</TableCell>
              <TableCell>
                <Badge variant={STATION_STATUS_VARIANT[station.status] ?? "secondary"}>
                  {station.status.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell>{station.charger_count}</TableCell>
              <TableCell>
                <Badge variant={station.is_active ? "success" : "secondary"}>
                  {station.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
