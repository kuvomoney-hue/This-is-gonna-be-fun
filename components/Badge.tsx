"use client";

type BadgeVariant =
  | "online"
  | "offline"
  | "approved"
  | "rejected"
  | "long"
  | "short"
  | "choppy"
  | "trending"
  | "volatile"
  | "bullish"
  | "bearish"
  | "neutral"
  | "running"
  | "stopped";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  pulse?: boolean;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  online:    "bg-[#14591D]/30 text-[#4caf50] border border-[#4caf50]/30",
  offline:   "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30",
  approved:  "bg-[#14591D]/40 text-[#4caf50] border border-[#4caf50]/40",
  rejected:  "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30",
  long:      "bg-[#14591D]/40 text-[#4caf50] border border-[#4caf50]/40",
  short:     "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30",
  choppy:    "bg-yellow-900/20 text-yellow-400 border border-yellow-600/30",
  trending:  "bg-[#14591D]/40 text-[#4caf50] border border-[#4caf50]/40",
  volatile:  "bg-orange-900/20 text-orange-400 border border-orange-600/30",
  bullish:   "bg-[#14591D]/40 text-[#4caf50] border border-[#4caf50]/40",
  bearish:   "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30",
  neutral:   "bg-[#1e3320]/60 text-[#81c784] border border-[#1e3320]",
  running:   "bg-[#14591D]/40 text-[#4caf50] border border-[#4caf50]/40",
  stopped:   "bg-[#ef5350]/10 text-[#ef5350] border border-[#ef5350]/30",
};

const variantLabels: Partial<Record<BadgeVariant, string>> = {
  online:   "Online",
  offline:  "Offline",
  approved: "Approved",
  rejected: "Rejected",
  long:     "Long",
  short:    "Short",
  choppy:   "Choppy",
  trending: "Trending",
  volatile: "Volatile",
  bullish:  "Bullish",
  bearish:  "Bearish",
  neutral:  "Neutral",
  running:  "Running",
  stopped:  "Stopped",
};

export default function Badge({ variant, label, pulse = false, size = "sm" }: BadgeProps) {
  const displayLabel = label ?? variantLabels[variant] ?? variant;
  const showDot = ["online", "running", "approved", "trending", "bullish"].includes(variant);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1"}
        ${variantStyles[variant]}
      `}
    >
      {showDot && (
        <span className={`relative flex h-1.5 w-1.5 ${pulse ? "animate-pulse" : ""}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {displayLabel}
    </span>
  );
}
