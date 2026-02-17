import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Rendyr Mission Control",
  description: "Personal command center for Big Papa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f0a] text-[#e8f5e9] min-h-screen">
        <Sidebar />
        {/* Desktop: offset for sidebar; Mobile: offset for bottom tab bar */}
        <main className="md:ml-60 mb-16 md:mb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
