"use client";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

export default function ProgressBar({
  value,
  color = "#14591D",
  height = 6,
  showLabel = false,
  animated = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full flex items-center gap-3">
      <div
        className="flex-1 rounded-full bg-[#1e3320] overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`h-full rounded-full ${animated ? "transition-all duration-700 ease-out" : ""}`}
          style={{
            width: `${clampedValue}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            boxShadow: `0 0 8px ${color}66`,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-[#81c784] w-8 text-right">
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
