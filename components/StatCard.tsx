"use client";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StatCard({
  label,
  value,
  change,
  prefix = "",
  suffix = "",
  mono = true,
  size = "md",
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  const valueSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-[#81c784] uppercase tracking-wider font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className={`
            font-bold text-[#e8f5e9]
            ${valueSizes[size]}
            ${mono ? "font-mono" : ""}
          `}
        >
          {prefix}{value}{suffix}
        </span>
        {change !== undefined && (
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-[#4caf50]" : isNegative ? "text-[#ef5350]" : "text-[#81c784]"
            }`}
          >
            {isPositive ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </div>
  );
}
