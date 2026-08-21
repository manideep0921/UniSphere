import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Equipment } from "@/types/database";


function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  const t = useTranslations("common");
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || t("notSpecified")}</span>
    </div>
  );
}

export function EquipmentSpecCard({ equipment }: { equipment: Equipment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>
            {equipment.manufacturer}
            {equipment.model ? ` — ${equipment.model}` : ""}
          </span>
          {equipment.charger_type && <Badge variant="outline">{equipment.charger_type}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SpecRow label="Supplier" value={equipment.supplier} />
        <SpecRow label="Power Rating" value={equipment.power_rating} />
        <SpecRow label="Output Voltage" value={equipment.output_voltage} />
        <SpecRow label="Connectors" value={equipment.number_of_connectors} />
        <SpecRow label="Communication" value={equipment.communication_protocol} />
        <SpecRow
          label="Authentication"
          value={equipment.authentication_methods.join(", ") || null}
        />
        <SpecRow label="Display" value={equipment.display} />
        <SpecRow label="Emergency Button" value={equipment.emergency_button ? "Yes" : "No"} />
        <SpecRow label="IP Rating" value={equipment.ip_rating} />
        <SpecRow label="Cooling" value={equipment.cooling_method} />
        <SpecRow
          label="Protection Features"
          value={equipment.protection_features.join(", ") || null}
        />
        <SpecRow label="Cable Length" value={equipment.cable_length} />
        <SpecRow label="Installation" value={equipment.installation_method} />
      </CardContent>
    </Card>
  );
}
