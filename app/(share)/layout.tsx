import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "AI Video Feed",
  description: "Latest AI video launches from top platforms",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text-primary min-h-screen">
        {/* No sidebar - direct children rendering */}
        {children}
      </body>
    </html>
  );
}
