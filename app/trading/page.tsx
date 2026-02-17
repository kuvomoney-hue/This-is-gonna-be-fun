"use client";

import Card from "@/components/Card";
import Badge from "@/components/Badge";
import SignalRow from "@/components/SignalRow";
import {
  accountHistory,
  tradingStats,
  signals,
  contextFilter,
  activePosition,
} from "@/lib/mockData";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111811] border border-[#1e3320] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-[#81c784]">{label}</p>
        <p className="text-sm font-mono font-bold text-[#e8f5e9]">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const trendVariant = (t: "BULLISH" | "BEARISH" | "NEUTRAL") =>
  t === "BULLISH" ? "bullish" : t === "BEARISH" ? "bearish" : "neutral";

export default function TradingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">Trading</h1>
        <p className="text-[#81c784] text-sm mt-1">BTC/USD · Scout Signal Engine</p>
      </div>

      {/* Account Value Chart */}
      <Card title="Account Value" subtitle="Since bot launch">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accountHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3320" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#81c784", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#81c784", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={499} stroke="#1e3320" strokeDasharray="4 4" label={{ value: "Start $499", fill: "#81c784", fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#1a7a27"
                strokeWidth={2.5}
                dot={{ fill: "#14591D", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#4caf50", r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Trades", value: tradingStats.totalTrades },
          { label: "Win Rate", value: `${tradingStats.winRate}%` },
          { label: "Avg Win", value: `+${tradingStats.avgWin}%`, positive: true },
          { label: "Avg Loss", value: `${tradingStats.avgLoss}%`, negative: true },
          { label: "Total Fees", value: `$${tradingStats.totalFees}`, dim: true },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className="text-xs text-[#81c784] uppercase tracking-wider mb-1">{s.label}</p>
            <p
              className={`text-xl font-mono font-bold ${
                s.positive ? "text-[#4caf50]" : s.negative ? "text-[#ef5350]" : s.dim ? "text-[#81c784]" : "text-[#e8f5e9]"
              }`}
            >
              {s.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Context Filter */}
        <Card title="Context Filter" subtitle="Current market regime">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
              <span className="text-sm text-[#81c784]">Regime</span>
              <Badge variant={contextFilter.regime.toLowerCase() as "choppy" | "trending" | "volatile"} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
              <span className="text-sm text-[#81c784]">ATR</span>
              <span className="font-mono text-sm text-[#e8f5e9]">{contextFilter.atr}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
              <span className="text-sm text-[#81c784]">Volume</span>
              <span className="font-mono text-sm text-yellow-400">{contextFilter.volume}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
              <span className="text-sm text-[#81c784]">15m Trend</span>
              <Badge variant={trendVariant(contextFilter.trend15m)} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
              <span className="text-sm text-[#81c784]">1H Trend</span>
              <Badge variant={trendVariant(contextFilter.trend1h)} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[#81c784]">4H Trend</span>
              <Badge variant={trendVariant(contextFilter.trend4h)} />
            </div>
          </div>
        </Card>

        {/* Active Position */}
        <Card title="Active Position" className="lg:col-span-2">
          {activePosition ? (
            <div>Position data here</div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 gap-3">
              <span className="text-4xl opacity-30">📭</span>
              <div className="text-center">
                <p className="text-[#81c784] font-medium">No Open Position</p>
                <p className="text-xs text-[#81c784]/60 mt-1">Waiting for a high-quality signal…</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Signal Log Table */}
      <Card title="Signal Log" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e3320]">
                {["Time", "Signal", "Price", "Score", "Decision", "Reasons"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#81c784] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, i) => (
                <SignalRow
                  key={signal.id}
                  signal={signal}
                  isLast={i === signals.length - 1}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-[#1e3320]">
          <p className="text-xs text-[#81c784]">{signals.length} signals recorded</p>
        </div>
      </Card>
    </div>
  );
}
