"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isShareRoute = pathname?.startsWith("/share");

  if (isShareRoute) {
    // Shareable routes: no sidebar, full width
    return <>{children}</>;
  }

  // Normal routes: sidebar + offset main
  return (
    <>
      <Sidebar />
      {/* Desktop: offset for sidebar; Mobile: offset for bottom tab bar */}
      <main className="md:ml-60 mb-16 md:mb-0 min-h-screen">
        {children}
      </main>
    </>
  );
}
