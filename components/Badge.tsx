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
  online:   "bg-primary/30 text-primary-bright border border-primary-bright/30",
  offline:  "bg-danger/10 text-danger border border-danger/30",
  approved: "bg-primary/30 text-primary-bright border border-primary-bright/30",
  rejected: "bg-danger/10 text-danger border border-danger/30",
  long:     "bg-primary/30 text-primary-bright border border-primary-bright/30",
  short:    "bg-danger/10 text-danger border border-danger/30",
  choppy:   "bg-wow-amber/10 text-wow-amber border border-wow-amber/30",
  trending: "bg-primary/30 text-primary-bright border border-primary-bright/30",
  volatile: "bg-orange-900/20 text-orange-400 border border-orange-600/30",
  bullish:  "bg-primary/30 text-primary-bright border border-primary-bright/30",
  bearish:  "bg-danger/10 text-danger border border-danger/30",
  neutral:  "bg-surface2 text-text-secondary border border-border",
  running:  "bg-primary/30 text-primary-bright border border-primary-bright/30",
  stopped:  "bg-danger/10 text-danger border border-danger/30",
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
