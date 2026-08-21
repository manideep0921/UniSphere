import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Geist } from "next/font/google";
import { Zap, LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { logoutAdmin } from "@/actions/admin-auth";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import "../../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Admin | RM EV Services", template: "%s | RM EV Services Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-muted/30">
        <div className="flex min-h-screen">
          <aside className="hidden w-64 shrink-0 border-r border-border bg-background p-4 lg:block">
            <div className="flex items-center gap-2 px-2 py-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Zap className="size-4" />
              </span>
              RM EV Admin
            </div>
            <div className="mt-6">
              <SidebarNav />
            </div>
          </aside>

          <div className="flex-1">
            <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3">
              <p className="text-sm text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium text-foreground">{admin.full_name}</span>
              </p>
              <form action={logoutAdmin}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="size-4" />
                  Log out
                </Button>
              </form>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
