"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Command Center",
    emoji: "🏠",
    activeColor: "bg-primary text-text-primary shadow-glow-green",
    accentColor: "text-text-secondary hover:bg-surface2 hover:text-text-primary",
    dotColor: "",
  },
  {
    href: "/trading",
    label: "Trading",
    emoji: "📈",
    activeColor: "bg-primary text-text-primary shadow-glow-green",
    accentColor: "text-primary-bright/70 hover:bg-surface2 hover:text-primary-bright",
    dotColor: "bg-primary-bright",
  },
  {
    href: "/rendyr",
    label: "Rendyr",
    emoji: "🎬",
    activeColor: "bg-primary text-text-primary shadow-glow-green",
    accentColor: "text-primary-bright/70 hover:bg-surface2 hover:text-primary-bright",
    dotColor: "bg-primary-bright",
  },
  {
    href: "/woof",
    label: "Way of Woof",
    emoji: "🐾",
    activeColor: "bg-wow-navy text-wow-cream shadow-glow-navy",
    accentColor: "text-wow-purple/70 hover:bg-surface2 hover:text-wow-purple",
    dotColor: "bg-wow-purple",
  },
  {
    href: "/tasks",
    label: "Tasks",
    emoji: "✅",
    activeColor: "bg-wow-amber/20 text-wow-amber shadow-glow-amber border border-wow-amber/30",
    accentColor: "text-wow-amber/60 hover:bg-surface2 hover:text-wow-amber",
    dotColor: "bg-wow-amber",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-surface border-r border-border z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-sm shadow-glow-green">
              🎯
            </div>
            <div>
              <h1 className="text-text-primary font-bold text-sm leading-tight">
                Mission Control
              </h1>
              <p className="text-text-secondary text-xs">Big Papa</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, emoji, activeColor, accentColor, dotColor }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150
                  ${isActive ? activeColor : accentColor}
                `}
              >
                <span className="text-base">{emoji}</span>
                <span className="flex-1">{label}</span>
                {!isActive && dotColor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} opacity-60`} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-bright opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-bright" />
            </span>
            <span className="text-xs text-text-secondary">Systems Online</span>
          </div>
          <p className="text-xs text-border mt-1 font-mono">v2.0.0</p>
        </div>
      </aside>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40">
        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map(({ href, label, emoji }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const activeText =
              href === "/woof" ? "text-wow-purple" :
              href === "/tasks" ? "text-wow-amber" :
              "text-primary-bright";
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg
                  transition-all duration-150
                  ${isActive ? activeText : "text-text-secondary"}
                `}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-[9px] font-medium leading-tight text-center">
                  {label === "Command Center" ? "Home" :
                   label === "Way of Woof" ? "Woof" : label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
