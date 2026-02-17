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
  robinhoodStatus,
  equityStats,
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

      {/* ══════════════════════════════════════════════════ */}
      {/* EQUITY SIGNALS — SPY & QQQ */}
      {/* ══════════════════════════════════════════════════ */}
      <div>
        <h2 className="text-lg font-bold text-[#e8f5e9] mb-1">📊 Equity Signals — SPY &amp; QQQ</h2>
        <p className="text-xs text-[#81c784] mb-4">Real-time regime &amp; trend context for options signals</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([equityStats.SPY, equityStats.QQQ] as const).map((eq) => {
            const regimeBadge =
              eq.regime === 'trending_up'
                ? { label: 'TRENDING UP', cls: 'text-[#4caf50] bg-[#4caf50]/10' }
                : eq.regime === 'trending_down'
                ? { label: 'TRENDING DOWN', cls: 'text-[#ef5350] bg-[#ef5350]/10' }
                : eq.regime === 'volatile'
                ? { label: 'VOLATILE', cls: 'text-orange-400 bg-orange-400/10' }
                : { label: 'CHOPPY', cls: 'text-yellow-400 bg-yellow-400/10' };

            const trendBadge = (t: 'bullish' | 'bearish' | 'neutral') =>
              t === 'bullish'
                ? { label: 'BULLISH', cls: 'text-[#4caf50] bg-[#4caf50]/10' }
                : t === 'bearish'
                ? { label: 'BEARISH', cls: 'text-[#ef5350] bg-[#ef5350]/10' }
                : { label: 'NEUTRAL', cls: 'text-yellow-400 bg-yellow-400/10' };

            const t1h = trendBadge(eq.trend1h);
            const t4h = trendBadge(eq.trend4h);

            return (
              <Card key={eq.symbol}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-2xl font-mono font-bold text-[#e8f5e9]">{eq.symbol}</p>
                    <p className="text-xs text-[#81c784] mt-0.5">{eq.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-[#4caf50]">${eq.price.toFixed(2)}</p>
                    <p className="text-xs text-[#81c784] mt-0.5">
                      {eq.change >= 0 ? '+' : ''}{eq.change.toFixed(2)} ({eq.changePct >= 0 ? '+' : ''}{eq.changePct.toFixed(2)}%)
                    </p>
                  </div>
                </div>

                {/* Regime */}
                <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
                  <span className="text-xs text-[#81c784]">Regime</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${regimeBadge.cls}`}>
                    {regimeBadge.label}
                  </span>
                </div>

                {/* Trends */}
                <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
                  <span className="text-xs text-[#81c784]">1H Trend</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t1h.cls}`}>{t1h.label}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#1e3320]">
                  <span className="text-xs text-[#81c784]">4H Trend</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t4h.cls}`}>{t4h.label}</span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 py-2 border-b border-[#1e3320] text-xs text-[#81c784]">
                  <span>Signals Today: <span className="font-mono text-[#e8f5e9]">{eq.signalsToday}</span></span>
                  <span>Approved: <span className="font-mono text-[#4caf50]">{eq.approvedToday}</span></span>
                  <span>Filter: <span className="font-mono text-[#e8f5e9]">60/100</span></span>
                </div>

                {/* Last signal */}
                <p className="text-xs text-[#81c784]/60 mt-2 truncate">{eq.lastSignal}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════ */}
      {/* ROBINHOOD OPTIONS SECTION */}
      {/* ══════════════════════════════════════════════════ */}
      <div>
        <h2 className="text-lg font-bold text-[#e8f5e9] mb-1">Robinhood Options</h2>
        <p className="text-xs text-[#81c784] mb-4">
          SPY &amp; QQQ · ATM options · +30% TP / -15% stop · Market hours only
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Equity', value: `$${robinhoodStatus.equity.toFixed(0)}` },
            { label: 'Buying Power', value: `$${robinhoodStatus.buyingPower.toFixed(0)}` },
            { label: 'Trades', value: String(robinhoodStatus.totalTrades) },
            { label: 'Win Rate', value: `${robinhoodStatus.winRate}%` },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className="text-xs text-[#81c784] uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-mono font-bold text-[#e8f5e9]">{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Current position card */}
        <Card title="Current Position">
          {(() => {
            const rh = robinhoodStatus;
            const isOnline = rh.connected && rh.status !== 'offline';
            const pnlPos = rh.todayPnl >= 0;
            const statusColor =
              rh.status === 'ready' ? 'text-[#4caf50] bg-[#4caf50]/10' :
              rh.status === 'in_position' ? 'text-blue-400 bg-blue-400/10' :
              rh.status === 'market_closed' ? 'text-yellow-400 bg-yellow-400/10' :
              'text-[#ef5350] bg-[#ef5350]/10';
            const statusLabel =
              rh.status === 'ready' ? 'READY' :
              rh.status === 'in_position' ? 'IN POSITION' :
              rh.status === 'market_closed' ? 'MARKET CLOSED' : 'OFFLINE';
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${isOnline ? 'text-[#4caf50]' : 'text-[#ef5350]'}`}>●</span>
                    <span className="text-xs text-[#81c784]">{isOnline ? 'Connected to Robinhood' : 'Offline'}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0a0f0a] rounded-lg p-3">
                    <p className="text-xs text-[#81c784] mb-1">Equity</p>
                    <p className="text-base font-mono font-bold text-[#e8f5e9]">${rh.equity.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#0a0f0a] rounded-lg p-3">
                    <p className="text-xs text-[#81c784] mb-1">Buying Power</p>
                    <p className="text-base font-mono font-bold text-[#e8f5e9]">${rh.buyingPower.toFixed(2)}</p>
                  </div>
                  <div className="bg-[#0a0f0a] rounded-lg p-3">
                    <p className="text-xs text-[#81c784] mb-1">Today&apos;s P&amp;L</p>
                    <p className={`text-base font-mono font-bold ${pnlPos ? 'text-[#4caf50]' : 'text-[#ef5350]'}`}>
                      {pnlPos ? '+' : ''}${rh.todayPnl.toFixed(2)}
                    </p>
                  </div>
                </div>

                {rh.hasPosition && rh.currentPosition ? (
                  <div className="bg-[#0a0f0a] rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-mono font-bold text-[#e8f5e9]">{rh.currentPosition.symbol}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${rh.currentPosition.direction === 'call' ? 'text-[#4caf50] bg-[#4caf50]/10' : 'text-[#ef5350] bg-[#ef5350]/10'}`}>
                        {rh.currentPosition.direction.toUpperCase()}
                      </span>
                      <span className="text-sm text-[#81c784]">Strike ${rh.currentPosition.strike}</span>
                      <span className="text-sm text-[#81c784]">Exp {rh.currentPosition.expiry}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-[#81c784]">Entry Premium</p>
                        <p className="font-mono text-sm text-[#e8f5e9]">${rh.currentPosition.entryPremium.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#81c784]">Current Premium</p>
                        <p className="font-mono text-sm text-[#e8f5e9]">${rh.currentPosition.currentPremium.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#81c784]">P&amp;L</p>
                        <p className={`font-mono text-sm font-bold ${rh.currentPosition.pnlPct >= 0 ? 'text-[#4caf50]' : 'text-[#ef5350]'}`}>
                          {rh.currentPosition.pnlPct >= 0 ? '+' : ''}{rh.currentPosition.pnlPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-20 gap-2">
                    <span className="text-3xl opacity-30">📭</span>
                    <p className="text-xs text-[#81c784]/60">No open position · Watching for signals</p>
                  </div>
                )}

                <p className="text-xs text-[#81c784]/50 text-center">
                  Market opens Tue 9:30 AM ET
                </p>
              </div>
            );
          })()}
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
