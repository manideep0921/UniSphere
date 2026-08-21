import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "../../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Login | RM EV Services",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-screen items-center justify-center bg-muted/30">
        {children}
      </body>
    </html>
  );
}
