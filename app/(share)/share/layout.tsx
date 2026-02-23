import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video Feed",
  description: "Latest AI video launches from top platforms",
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
