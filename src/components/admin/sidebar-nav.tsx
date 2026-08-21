"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Zap,
  Wrench,
  ListChecks,
  Sparkles,
  Tag,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stations", label: "Stations", icon: Zap },
  { href: "/admin/equipment", label: "Equipment", icon: Wrench },
  { href: "/admin/services", label: "Services", icon: ListChecks },
  { href: "/admin/amenities", label: "Amenities", icon: Sparkles },
  { href: "/admin/offers", label: "Offers", icon: Tag },
  { href: "/admin/feedback", label: "Feedback", icon: MessageSquare },
  { href: "/admin/franchise-leads", label: "Franchise Leads", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {LINKS.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
              active && "bg-secondary text-secondary-foreground",
            )}
          >
            <link.icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
