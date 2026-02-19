"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  noPadding?: boolean;
  glow?: "green" | "navy" | "purple" | "amber" | "none";
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
  noPadding = false,
  glow = "none",
}: CardProps) {
  const glowClass =
    glow === "green"  ? "shadow-glow-green border-primary-bright/20" :
    glow === "navy"   ? "shadow-glow-navy border-wow-navy/40" :
    glow === "purple" ? "shadow-glow-purple border-wow-purple/30" :
    glow === "amber"  ? "shadow-glow-amber border-wow-amber/30" :
    "";

  return (
    <div
      className={`
        bg-surface border border-border rounded-xl
        card-hover
        ${glowClass}
        ${noPadding ? "" : "p-5"}
        ${className}
      `}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between ${noPadding ? "px-5 pt-5" : ""} mb-4`}>
          <div>
            {title && (
              <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-text-secondary text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
