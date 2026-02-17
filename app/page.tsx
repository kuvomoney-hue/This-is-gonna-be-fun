import Card from "@/components/Card";
import Badge from "@/components/Badge";
import StatCard from "@/components/StatCard";
import {
  botStatus,
  tradingSummary,
  todaySchedule,
  weather,
  quickStats,
} from "@/lib/mockData";

export default function DashboardPage() {
  const pnlPositive = botStatus.todayPnl >= 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#e8f5e9]">Rendyr Mission Control</h1>
        <p className="text-[#81c784] text-sm mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* ── Bot Status Card ── */}
        <Card title="Bot Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4caf50] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4caf50]" />
                </span>
                <span className="font-semibold text-[#e8f5e9]">Scout Online</span>
              </div>
              <Badge variant={botStatus.isRunning ? "running" : "stopped"} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0f0a] rounded-lg p-3">
                <p className="text-xs text-[#81c784] mb-1">BTC Price</p>
                <p className="text-lg font-mono font-bold text-[#e8f5e9]">
                  ${botStatus.btcPrice.toLocaleString()}
                </p>
              </div>
              <div className="bg-[#0a0f0a] rounded-lg p-3">
                <p className="text-xs text-[#81c784] mb-1">Balance</p>
                <p className="text-lg font-mono font-bold text-[#e8f5e9]">
                  ${botStatus.accountBalance.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#0a0f0a] rounded-lg p-3">
                <p className="text-xs text-[#81c784] mb-1">Today&apos;s P&L</p>
                <p className={`text-lg font-mono font-bold ${pnlPositive ? "text-[#4caf50]" : "text-[#ef5350]"}`}>
                  {pnlPositive ? "+" : ""}${botStatus.todayPnl.toFixed(2)}
                </p>
              </div>
              <div className="bg-[#0a0f0a] rounded-lg p-3">
                <p className="text-xs text-[#81c784] mb-1">Win Rate</p>
                <p className="text-lg font-mono font-bold text-[#e8f5e9]">
                  {botStatus.winRate}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Trading Summary Card ── */}
        <Card title="Trading Summary">
          <div className="space-y-3">
            <div className="bg-[#0a0f0a] rounded-lg p-3">
              <p className="text-xs text-[#81c784] mb-2">Last Signal</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={tradingSummary.lastSignal.direction.toLowerCase() as "long" | "short"} />
                <span className="font-mono text-sm text-[#e8f5e9]">
                  @ ${tradingSummary.lastSignal.price.toLocaleString()}
                </span>
                <Badge variant={tradingSummary.lastSignal.decision.toLowerCase() as "approved" | "rejected"} />
                <span className="text-xs text-[#81c784]">
                  {tradingSummary.lastSignal.score}/{tradingSummary.lastSignal.maxScore}
                </span>
              </div>
            </div>

            <div className="bg-[#0a0f0a] rounded-lg p-3">
              <p className="text-xs text-[#81c784] mb-2">Last Approved Trade</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="long" />
                <span className="font-mono text-sm text-[#e8f5e9]">
                  @ ${tradingSummary.lastApprovedTrade.price.toLocaleString()}
                </span>
                <span className={`text-sm font-mono ${tradingSummary.lastApprovedTrade.pnl >= 0 ? "text-[#4caf50]" : "text-[#ef5350]"}`}>
                  {tradingSummary.lastApprovedTrade.pnl >= 0 ? "+" : ""}${tradingSummary.lastApprovedTrade.pnl}%
                </span>
              </div>
              <p className="text-xs text-[#81c784] mt-1">{tradingSummary.lastApprovedTrade.closedAt}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#0a0f0a] rounded-lg p-2">
                <p className="text-xs text-[#81c784]">Signals</p>
                <p className="font-mono font-bold text-[#e8f5e9]">{tradingSummary.signalsToday}</p>
              </div>
              <div className="bg-[#0a0f0a] rounded-lg p-2">
                <p className="text-xs text-[#81c784]">Approved</p>
                <p className="font-mono font-bold text-[#4caf50]">{tradingSummary.signalsApproved}</p>
              </div>
              <div className="bg-[#0a0f0a] rounded-lg p-2">
                <p className="text-xs text-[#81c784]">Rejected</p>
                <p className="font-mono font-bold text-[#ef5350]">{tradingSummary.signalsRejected}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Schedule Card ── */}
        <Card title="Today's Schedule">
          <div className="space-y-2">
            {todaySchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#14591D]/10 transition-colors"
              >
                <span className="text-xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#e8f5e9] font-medium">{item.label}</p>
                </div>
                <span className="font-mono text-xs text-[#81c784] shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Weather Card ── */}
        <Card title="Weather" subtitle={weather.location}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-[#e8f5e9]">
                  {weather.temp}°
                </span>
                <span className="text-lg text-[#81c784]">F</span>
              </div>
              <p className="text-[#81c784] mt-1">{weather.condition}</p>
              <div className="flex gap-3 mt-2 text-xs font-mono text-[#81c784]">
                <span>H: {weather.high}°</span>
                <span>L: {weather.low}°</span>
              </div>
            </div>
            <span className="text-6xl">{weather.emoji}</span>
          </div>
        </Card>

        {/* ── Quick Stats Card ── */}
        <Card title="Quick Stats">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#0a0f0a] rounded-lg">
              <div>
                <p className="text-xs text-[#81c784]">Tasks This Week</p>
                <p className="text-2xl font-mono font-bold text-[#e8f5e9]">{quickStats.tasksThisWeek}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0a0f0a] rounded-lg">
              <div>
                <p className="text-xs text-[#81c784]">Current Streak</p>
                <p className="text-2xl font-mono font-bold text-[#e8f5e9]">{quickStats.currentStreak} days</p>
              </div>
              <span className="text-3xl">🔥</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#0a0f0a] rounded-lg">
              <div>
                <p className="text-xs text-[#81c784]">Projects Active</p>
                <p className="text-2xl font-mono font-bold text-[#e8f5e9]">{quickStats.projectsActive}</p>
              </div>
              <span className="text-3xl">🚀</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
