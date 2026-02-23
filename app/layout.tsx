import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

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
      <body className="bg-bg text-text-primary min-h-screen">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
