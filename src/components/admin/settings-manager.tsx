"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateSiteSetting } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SiteSetting } from "@/types/database";

const FRIENDLY_LABELS: Record<string, string> = {
  whatsapp_number: "WhatsApp Number (E.164, no +)",
  hero_tagline_en: "Home Hero Tagline (English)",
  why_choose_us_en: "Why Choose Us (English)",
  contact_email: "Contact Email",
  contact_phone: "Contact Phone",
};

export function SettingsManager({ settings }: { settings: SiteSetting[] }) {
  return (
    <div className="grid gap-4">
      {settings.map((setting) => (
        <SettingRow key={setting.id} setting={setting} />
      ))}
    </div>
  );
}

function SettingRow({ setting }: { setting: SiteSetting }) {
  const [valueEn, setValueEn] = useState(setting.value_en ?? "");
  const [valueTe, setValueTe] = useState(setting.value_te ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteSetting(setting.key, { value_en: valueEn, value_te: valueTe });
      toast.success("Setting saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{FRIENDLY_LABELS[setting.key] ?? setting.key}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${setting.key}-en`}>Value (English)</Label>
          <Input id={`${setting.key}-en`} value={valueEn} onChange={(e) => setValueEn(e.target.value)} />
        </div>
        <div>
          <Label htmlFor={`${setting.key}-te`}>Value (Telugu)</Label>
          <Input id={`${setting.key}-te`} value={valueTe} onChange={(e) => setValueTe(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
