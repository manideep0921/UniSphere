"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { deleteMedia, uploadMedia } from "@/actions/media";
import { getMediaPublicUrl } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Media } from "@/types/database";

export function StationMediaTab({ stationId, media }: { stationId: string; media: Media[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await uploadMedia({ file, category: "station", stationId, displayOrder: media.length });
      toast.success("Image uploaded");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string, storagePath: string) {
    if (!confirm("Delete this image?")) return;
    try {
      await deleteMedia(id, storagePath);
      toast.success("Image deleted");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Button asChild variant="outline" disabled={uploading}>
          <label className="cursor-pointer">
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload Image"}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </Button>
        <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP, or AVIF. Max 5MB.</p>
      </div>

      {media.length === 0 ? (
        <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border">
              <div className="relative aspect-square">
                <Image
                  src={getMediaPublicUrl(item.storage_path)}
                  alt={item.alt_text ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id, item.storage_path)}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-4 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
