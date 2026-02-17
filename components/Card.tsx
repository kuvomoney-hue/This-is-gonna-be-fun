"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  noPadding?: boolean;
}

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-[#111811] border border-[#1e3320] rounded-xl
        card-hover
        ${noPadding ? "" : "p-5"}
        ${className}
      `}
    >
      {(title || action) && (
        <div className={`flex items-center justify-between ${noPadding ? "px-5 pt-5" : ""} mb-4`}>
          <div>
            {title && (
              <h2 className="text-[#e8f5e9] font-semibold text-sm uppercase tracking-wider">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[#81c784] text-xs mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
