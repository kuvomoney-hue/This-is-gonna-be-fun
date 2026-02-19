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
      <div className="bg-surface border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-text-secondary">{label}</p>
        <p className="text-sm font-mono font-bold text-text-primary">
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
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">📈 Trading</h1>
        <p className="text-text-secondary text-sm mt-1">BTC/USD · Scout Signal Engine</p>
      </div>

      {/* Account Value Chart */}
      <div className="bg-surface border border-primary-bright/20 rounded-xl p-5 shadow-glow-green">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">Account Value</h2>
            <p className="text-text-secondary text-xs mt-0.5">Since bot launch</p>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accountHistory} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#22223A" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#8B8BA0", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "#8B8BA0", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={499}
                stroke="#22223A"
                strokeDasharray="4 4"
                label={{ value: "Start $499", fill: "#8B8BA0", fontSize: 10 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={{ fill: "#14591D", r: 3, strokeWidth: 0 }}
                activeDot={{ fill: "#22C55E", r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Trades", value: tradingStats.totalTrades },
          { label: "Win Rate",     value: `${tradingStats.winRate}%` },
          { label: "Avg Win",      value: `+${tradingStats.avgWin}%`,  positive: true },
          { label: "Avg Loss",     value: `${tradingStats.avgLoss}%`,  negative: true },
          { label: "Total Fees",   value: `$${tradingStats.totalFees}`, dim: true },
        ].map((s) => (
          <div key={s.label} className="bg-surface border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`text-xl font-mono font-bold ${
              s.positive ? "text-primary-bright" :
              s.negative ? "text-danger" :
              s.dim ? "text-text-secondary" :
              "text-text-primary"
            }`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Context Filter */}
        <Card title="Context Filter" subtitle="Current market regime">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-secondary">Regime</span>
              <Badge variant={contextFilter.regime.toLowerCase() as "choppy" | "trending" | "volatile"} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-secondary">ATR</span>
              <span className="font-mono text-sm text-text-primary">{contextFilter.atr}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-secondary">Volume</span>
              <span className="font-mono text-sm text-wow-amber">{contextFilter.volume}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-secondary">15m Trend</span>
              <Badge variant={trendVariant(contextFilter.trend15m)} />
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-text-secondary">1H Trend</span>
              <Badge variant={trendVariant(contextFilter.trend1h)} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">4H Trend</span>
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
                <p className="text-text-secondary font-medium">No Open Position</p>
                <p className="text-xs text-text-secondary/60 mt-1">Waiting for a high-quality signal…</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Equity Signals ── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-1">📊 Equity Signals — SPY &amp; QQQ</h2>
        <p className="text-xs text-text-secondary mb-4">Real-time regime &amp; trend context for options signals</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([equityStats.SPY, equityStats.QQQ] as const).map((eq) => {
            const regimeBadge =
              eq.regime === "trending_up"   ? { label: "TRENDING UP",   cls: "text-primary-bright bg-primary-bright/10" } :
              eq.regime === "trending_down" ? { label: "TRENDING DOWN", cls: "text-danger bg-danger/10" } :
              eq.regime === "volatile"      ? { label: "VOLATILE",      cls: "text-orange-400 bg-orange-400/10" } :
                                             { label: "CHOPPY",        cls: "text-wow-amber bg-wow-amber/10" };

            const trendBadge = (t: "bullish" | "bearish" | "neutral") =>
              t === "bullish" ? { label: "BULLISH", cls: "text-primary-bright bg-primary-bright/10" } :
              t === "bearish" ? { label: "BEARISH", cls: "text-danger bg-danger/10" } :
                                { label: "NEUTRAL", cls: "text-wow-amber bg-wow-amber/10" };

            const t1h = trendBadge(eq.trend1h);
            const t4h = trendBadge(eq.trend4h);

            return (
              <div key={eq.symbol} className="bg-surface border border-primary-bright/20 rounded-xl p-5 shadow-glow-green">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-2xl font-mono font-bold text-text-primary">{eq.symbol}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{eq.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-mono font-bold text-primary-bright">${eq.price.toFixed(2)}</p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {eq.change >= 0 ? "+" : ""}{eq.change.toFixed(2)} ({eq.changePct >= 0 ? "+" : ""}{eq.changePct.toFixed(2)}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-secondary">Regime</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${regimeBadge.cls}`}>
                    {regimeBadge.label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-secondary">1H Trend</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t1h.cls}`}>{t1h.label}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-xs text-text-secondary">4H Trend</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${t4h.cls}`}>{t4h.label}</span>
                </div>
                <div className="flex items-center gap-4 py-2 text-xs text-text-secondary">
                  <span>Signals: <span className="font-mono text-text-primary">{eq.signalsToday}</span></span>
                  <span>Approved: <span className="font-mono text-primary-bright">{eq.approvedToday}</span></span>
                </div>
                <p className="text-xs text-text-secondary/60 mt-1 truncate">{eq.lastSignal}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Robinhood Options ── */}
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-1">Robinhood Options</h2>
        <p className="text-xs text-text-secondary mb-4">
          SPY &amp; QQQ · ATM options · +30% TP / -15% stop · Market hours only
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: "Equity",       value: `$${robinhoodStatus.equity.toFixed(0)}` },
            { label: "Buying Power", value: `$${robinhoodStatus.buyingPower.toFixed(0)}` },
            { label: "Trades",       value: String(robinhoodStatus.totalTrades) },
            { label: "Win Rate",     value: `${robinhoodStatus.winRate}%` },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-xl font-mono font-bold text-text-primary">{s.value}</p>
            </div>
          ))}
        </div>

        <Card title="Current Position">
          {(() => {
            const rh = robinhoodStatus;
            const isOnline = rh.connected && rh.status !== "offline";
            const pnlPos = rh.todayPnl >= 0;
            const statusColor =
              rh.status === "ready"         ? "text-primary-bright bg-primary-bright/10" :
              rh.status === "in_position"   ? "text-blue-400 bg-blue-400/10" :
              rh.status === "market_closed" ? "text-wow-amber bg-wow-amber/10" :
                                             "text-danger bg-danger/10";
            const statusLabel =
              rh.status === "ready"         ? "READY" :
              rh.status === "in_position"   ? "IN POSITION" :
              rh.status === "market_closed" ? "MARKET CLOSED" : "OFFLINE";
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${isOnline ? "text-primary-bright" : "text-danger"}`}>●</span>
                    <span className="text-xs text-text-secondary">{isOnline ? "Connected" : "Offline"}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Equity",       value: `$${rh.equity.toFixed(2)}` },
                    { label: "Buying Power", value: `$${rh.buyingPower.toFixed(2)}` },
                    { label: "Today P&L",    value: `${pnlPos ? "+" : ""}$${rh.todayPnl.toFixed(2)}`, color: pnlPos ? "text-primary-bright" : "text-danger" },
                  ].map(s => (
                    <div key={s.label} className="bg-surface2 rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">{s.label}</p>
                      <p className={`text-base font-mono font-bold ${s.color ?? "text-text-primary"}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {rh.hasPosition && rh.currentPosition ? (
                  <div className="bg-surface2 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-mono font-bold text-text-primary">{rh.currentPosition.symbol}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        rh.currentPosition.direction === "call"
                          ? "text-primary-bright bg-primary-bright/10"
                          : "text-danger bg-danger/10"
                      }`}>
                        {rh.currentPosition.direction.toUpperCase()}
                      </span>
                      <span className="text-sm text-text-secondary">Strike ${rh.currentPosition.strike}</span>
                      <span className="text-sm text-text-secondary">Exp {rh.currentPosition.expiry}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-text-secondary">Entry</p>
                        <p className="font-mono text-sm text-text-primary">${rh.currentPosition.entryPremium.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">Current</p>
                        <p className="font-mono text-sm text-text-primary">${rh.currentPosition.currentPremium.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-secondary">P&amp;L</p>
                        <p className={`font-mono text-sm font-bold ${rh.currentPosition.pnlPct >= 0 ? "text-primary-bright" : "text-danger"}`}>
                          {rh.currentPosition.pnlPct >= 0 ? "+" : ""}{rh.currentPosition.pnlPct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-20 gap-2">
                    <span className="text-3xl opacity-30">📭</span>
                    <p className="text-xs text-text-secondary/60">No open position · Watching for signals</p>
                  </div>
                )}

                <p className="text-xs text-text-secondary/50 text-center">
                  Market opens Tue 9:30 AM ET
                </p>
              </div>
            );
          })()}
        </Card>
      </div>

      {/* Signal Log */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">Signal Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Time", "Signal", "Price", "Score", "Decision", "Reasons"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
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
        <div className="px-5 py-3 border-t border-border">
          <p className="text-xs text-text-secondary">{signals.length} signals recorded</p>
        </div>
      </div>
    </div>
  );
}
