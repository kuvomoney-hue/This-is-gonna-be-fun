"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import {
  botStatus,
  tradingSummary,
  todaySchedule,
  quickStats,
  robinhoodStatus,
  equityStats,
} from "@/lib/mockData";

interface WeatherData {
  temp: number;
  condition: string;
  emoji: string;
  high: number;
  low: number;
  humidity: number;
  windspeed: number;
  location: string;
}

export default function DashboardPage() {
  const pnlPositive = botStatus.todayPnl >= 0;

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetch("/api/weather")
      .then((r) => r.json())
      .then((data) => {
        setWeather(data);
        setWeatherLoading(false);
      })
      .catch(() => setWeatherLoading(false));
  }, []);

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

        {/* ── Robinhood Options Card ── */}
        <Card title="Robinhood Options">
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
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${isOnline ? 'text-[#4caf50]' : 'text-[#ef5350]'}`}>●</span>
                    <span className="text-xs text-[#81c784]">{isOnline ? 'Connected' : 'Offline'}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0a0f0a] rounded-lg p-3">
                    <p className="text-xs text-[#81c784] mb-1">Equity</p>
                    <p className="text-lg font-mono font-bold text-[#e8f5e9]">
                      ${rh.equity.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-[#0a0f0a] rounded-lg p-3">
                    <p className="text-xs text-[#81c784] mb-1">Buying Power</p>
                    <p className="text-lg font-mono font-bold text-[#e8f5e9]">
                      ${rh.buyingPower.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0a0f0a] rounded-lg p-3 flex items-center justify-between">
                  <p className="text-xs text-[#81c784]">Today&apos;s P&amp;L</p>
                  <p className={`text-sm font-mono font-bold ${pnlPos ? 'text-[#4caf50]' : 'text-[#ef5350]'}`}>
                    {pnlPos ? '+' : ''}${rh.todayPnl.toFixed(2)}
                  </p>
                </div>

                {rh.hasPosition && rh.currentPosition ? (
                  <div className="bg-[#0a0f0a] rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#e8f5e9]">{rh.currentPosition.symbol}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${rh.currentPosition.direction === 'call' ? 'text-[#4caf50] bg-[#4caf50]/10' : 'text-[#ef5350] bg-[#ef5350]/10'}`}>
                        {rh.currentPosition.direction.toUpperCase()}
                      </span>
                      <span className="text-xs text-[#81c784]">${rh.currentPosition.strike} · {rh.currentPosition.expiry}</span>
                    </div>
                    <div className="flex gap-3 text-xs font-mono text-[#81c784]">
                      <span>Entry: ${rh.currentPosition.entryPremium.toFixed(2)}</span>
                      <span>Now: ${rh.currentPosition.currentPremium.toFixed(2)}</span>
                      <span className={rh.currentPosition.pnlPct >= 0 ? 'text-[#4caf50]' : 'text-[#ef5350]'}>
                        {rh.currentPosition.pnlPct >= 0 ? '+' : ''}{rh.currentPosition.pnlPct.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#81c784]/60 text-center py-1">
                    No open position · Watching for signals
                  </p>
                )}

                <p className="text-xs text-[#81c784]/50 text-center">
                  Market opens Tue 9:30 AM ET
                </p>
              </div>
            );
          })()}
        </Card>

        {/* ── Market Pulse Card (SPY / QQQ) ── */}
        <Card title="Market Pulse" subtitle="SPY &amp; QQQ equity signals">
          <div className="space-y-3">
            {([equityStats.SPY, equityStats.QQQ] as const).map((eq) => {
              const regimeCls =
                eq.regime === 'trending_up'
                  ? 'text-[#4caf50] bg-[#4caf50]/10'
                  : eq.regime === 'trending_down'
                  ? 'text-[#ef5350] bg-[#ef5350]/10'
                  : eq.regime === 'volatile'
                  ? 'text-orange-400 bg-orange-400/10'
                  : 'text-yellow-400 bg-yellow-400/10';
              const regimeLabel =
                eq.regime === 'trending_up' ? 'TRENDING UP' :
                eq.regime === 'trending_down' ? 'TRENDING DOWN' :
                eq.regime === 'volatile' ? 'VOLATILE' : 'CHOPPY';

              return (
                <div key={eq.symbol} className="bg-[#0a0f0a] rounded-lg p-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-[#e8f5e9] shrink-0">{eq.symbol}</span>
                    <span className="font-mono text-sm text-[#4caf50] shrink-0">${eq.price.toFixed(2)}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${regimeCls}`}>
                      {regimeLabel}
                    </span>
                  </div>
                  <span className="text-xs text-[#81c784]/70 shrink-0">{eq.approvedToday} trades approved today</span>
                </div>
              );
            })}
            <p className="text-xs text-yellow-400/80 text-center pt-1">
              ⚠️ Filter active — waiting for trending conditions
            </p>
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
        <Card title="Weather" subtitle={weather?.location ?? "Los Angeles, CA"}>
          {weatherLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-10 w-24 bg-[#1e3320] rounded" />
                  <div className="h-4 w-28 bg-[#1e3320] rounded" />
                  <div className="h-3 w-20 bg-[#1e3320] rounded" />
                </div>
                <div className="h-14 w-14 bg-[#1e3320] rounded-full" />
              </div>
            </div>
          ) : weather ? (
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
                  <span>💧 {weather.humidity}%</span>
                </div>
              </div>
              <span className="text-6xl">{weather.emoji}</span>
            </div>
          ) : (
            <p className="text-[#81c784] text-sm">Unable to load weather.</p>
          )}
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
