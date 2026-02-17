"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  CheckSquare,
  FolderOpen,
  Bot,
  Video,
} from "lucide-react";

const navItems = [
  { href: "/",         label: "Dashboard", icon: LayoutDashboard },
  { href: "/trading",  label: "Trading",   icon: TrendingUp },
  { href: "/tasks",    label: "Tasks",     icon: CheckSquare },
  { href: "/projects", label: "Projects",  icon: FolderOpen },
  { href: "/scout",    label: "Scout",     icon: Bot },
  { href: "/videos",   label: "AI Videos", icon: Video },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-[#111811] border-r border-[#1e3320] z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-[#1e3320]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14591D] flex items-center justify-center text-sm">
              🎯
            </div>
            <div>
              <h1 className="text-[#e8f5e9] font-bold text-sm leading-tight">
                Rendyr Mission Control
              </h1>
              <p className="text-[#81c784] text-xs">Big Papa</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${
                    isActive
                      ? "bg-[#14591D] text-[#e8f5e9] shadow-[0_0_12px_rgba(20,89,29,0.4)]"
                      : "text-[#81c784] hover:bg-[#1e3320] hover:text-[#e8f5e9]"
                  }
                `}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1e3320]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf50] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4caf50]" />
            </span>
            <span className="text-xs text-[#81c784]">Scout Online</span>
          </div>
          <p className="text-xs text-[#1e3320] mt-1 font-mono">v0.1.0</p>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111811] border-t border-[#1e3320] z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg
                  transition-all duration-150
                  ${isActive ? "text-[#4caf50]" : "text-[#81c784]"}
                `}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
