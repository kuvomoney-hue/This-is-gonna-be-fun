export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean minimal wrapper - no sidebar, no navigation
  return <div className="min-h-screen">{children}</div>;
}
