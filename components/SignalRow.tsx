"use client";

import Badge from "./Badge";
import { Signal } from "@/lib/mockData";

interface SignalRowProps {
  signal: Signal;
  isLast?: boolean;
}

export default function SignalRow({ signal, isLast = false }: SignalRowProps) {
  return (
    <tr
      className={`
        group transition-colors hover:bg-primary/5
        ${!isLast ? "border-b border-border" : ""}
      `}
    >
      <td className="px-4 py-3 text-xs font-mono text-text-secondary whitespace-nowrap">
        {signal.time}
      </td>
      <td className="px-4 py-3">
        <Badge variant={signal.direction.toLowerCase() as "long" | "short"} />
      </td>
      <td className="px-4 py-3 text-sm font-mono text-text-primary">
        ${signal.price.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-surface2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${signal.score}%`,
                backgroundColor:
                  signal.score >= 50 ? "#22C55E" :
                  signal.score >= 30 ? "#B8A830" :
                  "#EF4444",
              }}
            />
          </div>
          <span className="text-xs font-mono text-text-primary">{signal.score}/100</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={signal.decision.toLowerCase() as "approved" | "rejected"} />
      </td>
      <td className="px-4 py-3 text-xs text-text-secondary max-w-xs">
        {signal.reasons.join(" · ")}
      </td>
    </tr>
  );
}
