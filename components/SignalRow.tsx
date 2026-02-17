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
        group transition-colors hover:bg-[#14591D]/10
        ${!isLast ? "border-b border-[#1e3320]" : ""}
      `}
    >
      <td className="px-4 py-3 text-xs font-mono text-[#81c784] whitespace-nowrap">
        {signal.time}
      </td>
      <td className="px-4 py-3">
        <Badge variant={signal.direction.toLowerCase() as "long" | "short"} />
      </td>
      <td className="px-4 py-3 text-sm font-mono text-[#e8f5e9]">
        ${signal.price.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-[#1e3320] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${signal.score}%`,
                backgroundColor: signal.score >= 50 ? "#4caf50" : signal.score >= 30 ? "#ffa726" : "#ef5350",
              }}
            />
          </div>
          <span className="text-xs font-mono text-[#e8f5e9]">{signal.score}/100</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={signal.decision.toLowerCase() as "approved" | "rejected"} />
      </td>
      <td className="px-4 py-3 text-xs text-[#81c784] max-w-xs">
        {signal.reasons.join(" · ")}
      </td>
    </tr>
  );
}
