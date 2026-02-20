"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────
interface BotStatus {
  isRunning: boolean;
  btcPrice: number;
  accountBalance: number;
  todayPnl: number;
  winRate: number;
}

interface RendyrData {
  skoolMembers: number;
  instagramFollowers: number;
  bundleSalesThisMonth: number;
  mrr: number;
}

interface WoofData {
  status: string;
  milestones: {
    rdComplete: boolean;
    labelsSubmitted: boolean;
    kitchenOnboarding: boolean;
    inventionInProgress?: boolean;
    labelApproval: boolean;
    launched: boolean;
  };
}

// ── Defaults ───────────────────────────────────────────────
const DEFAULT_BOT: BotStatus = {
  isRunning: true,
  btcPrice: 68400,
  accountBalance: 483.99,
  todayPnl: -5.39,
  winRate: 33,
};

const DEFAULT_RENDYR: RendyrData = {
  skoolMembers: 698,
  instagramFollowers: 12500,
  bundleSalesThisMonth: 15,
  mrr: 0,
};

const DEFAULT_WOOF: WoofData = {
  status: "pre-launch",
  milestones: {
    rdComplete: true,
    labelsSubmitted: true,
    kitchenOnboarding: true,
    inventionInProgress: true,
    labelApproval: false,
    launched: false,
  },
};

// ── Greeting ───────────────────────────────────────────────
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ── Woof milestones ────────────────────────────────────────
const woofMilestones = [
  { key: "rdComplete",       label: "R&D Complete",        done: true  },
  { key: "labelsSubmitted",  label: "Labels Submitted",    done: true  },
  { key: "kitchenOnboarding",label: "Kitchen Onboarding",  done: false },
  { key: "labelApproval",    label: "Label Approval",      done: false },
  { key: "launched",         label: "LAUNCH",              done: false },
];

const QUICK_TASKS_KEY = "rendyr_quick_tasks";
const INITIAL_QUICK_TASKS = [
  { id: "qt1", text: "Complete World 1 lessons", done: false },
  { id: "qt2", text: "Set Rendyr Academy paywall", done: false },
  { id: "qt3", text: "WayofWoof launch date", done: false },
];

// ── Component ──────────────────────────────────────────────
export default function CommandCenter() {
  const [bot, setBot] = useState<BotStatus>(DEFAULT_BOT);
  const [rendyr, setRendyr] = useState<RendyrData>(DEFAULT_RENDYR);
  const [woof, setWoof] = useState<WoofData>(DEFAULT_WOOF);
  const [quickTasks, setQuickTasks] = useState(INITIAL_QUICK_TASKS);

  useEffect(() => {
    // Load data files
    fetch("/data/bot_status.json", { cache: "no-store" })
      .then(r => r.json()).then(setBot).catch(() => {});
    fetch("/data/rendyr.json", { cache: "no-store" })
      .then(r => r.json()).then(setRendyr).catch(() => {});
    fetch("/data/woof.json", { cache: "no-store" })
      .then(r => r.json()).then(setWoof).catch(() => {});

    // Load quick tasks from localStorage
    try {
      const stored = localStorage.getItem(QUICK_TASKS_KEY);
      if (stored) setQuickTasks(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleQuickTask = (id: string) => {
    const updated = quickTasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setQuickTasks(updated);
    try { localStorage.setItem(QUICK_TASKS_KEY, JSON.stringify(updated)); } catch {}
  };

  const pnlPositive = bot.todayPnl >= 0;
  const milestonesDone = woofMilestones.filter(m =>
    woof.milestones[m.key as keyof typeof woof.milestones]
  ).length;
  const milestoneTotal = woofMilestones.length;
  const milestonePct = Math.round((milestonesDone / milestoneTotal) * 100);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Hero ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
          {getGreeting()}, <span className="text-primary-bright">Big Papa.</span>
        </h1>
        <p className="text-text-secondary text-sm mt-1">{today}</p>
      </div>

      {/* ── Row 1: Status Strip ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Bot Status */}
        <Link href="/trading" className="block">
          <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary-bright/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${bot.isRunning ? "bg-primary-bright" : "bg-danger"}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${bot.isRunning ? "bg-primary-bright" : "bg-danger"}`} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Bot</span>
              <span className={`ml-auto text-xs font-bold ${bot.isRunning ? "text-primary-bright" : "text-danger"}`}>
                {bot.isRunning ? "LIVE" : "DOWN"}
              </span>
            </div>
            <p className="text-text-primary font-mono font-bold text-lg">
              ${bot.btcPrice.toLocaleString()}
            </p>
            <p className="text-text-secondary text-xs">BTC Price</p>
          </div>
        </Link>

        {/* Rendyr */}
        <Link href="/rendyr" className="block">
          <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary-bright/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">🎬</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Rendyr</span>
            </div>
            <p className="text-text-primary font-bold text-sm">
              {rendyr.skoolMembers.toLocaleString()} members
            </p>
            <p className="text-text-secondary text-xs">{rendyr.bundleSalesThisMonth} sales this month</p>
          </div>
        </Link>

        {/* Way of Woof */}
        <Link href="/woof" className="block">
          <div className="bg-surface border border-border rounded-xl p-4 hover:border-wow-purple/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">🐾</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Way of Woof</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base">🟡</span>
              <p className="text-wow-amber font-bold text-sm">Pending</p>
            </div>
            <p className="text-text-secondary text-xs">Pre-launch · {milestonesDone}/{milestoneTotal} milestones</p>
          </div>
        </Link>

        {/* Tasks */}
        <Link href="/tasks" className="block">
          <div className="bg-surface border border-border rounded-xl p-4 hover:border-wow-amber/30 transition-all">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs">✅</span>
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">Tasks</span>
            </div>
            <p className="text-text-primary font-bold text-lg">
              {quickTasks.filter(t => !t.done).length}
            </p>
            <p className="text-text-secondary text-xs">tasks today</p>
          </div>
        </Link>
      </div>

      {/* ── Row 2: Main Cards ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* BTC / Trading Card */}
        <Link href="/trading" className="block">
          <div className="bg-surface border border-primary-bright/20 rounded-xl p-5 shadow-glow-green hover:shadow-glow-green hover:border-primary-bright/40 transition-all h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">📈 Trading</h2>
                <p className="text-text-secondary text-xs mt-0.5">BTC/USD · Scout Engine</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${bot.isRunning ? "bg-primary/40 text-primary-bright" : "bg-danger/20 text-danger"}`}>
                {bot.isRunning ? "● LIVE" : "● DOWN"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface2 rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">BTC Price</p>
                <p className="text-lg font-mono font-bold text-text-primary">${bot.btcPrice.toLocaleString()}</p>
              </div>
              <div className="bg-surface2 rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Balance</p>
                <p className="text-lg font-mono font-bold text-text-primary">${bot.accountBalance.toFixed(2)}</p>
              </div>
              <div className="bg-surface2 rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Today P&amp;L</p>
                <p className={`text-lg font-mono font-bold ${pnlPositive ? "text-primary-bright" : "text-danger"}`}>
                  {pnlPositive ? "+" : ""}${bot.todayPnl.toFixed(2)}
                </p>
              </div>
              <div className="bg-surface2 rounded-lg p-3">
                <p className="text-xs text-text-secondary mb-1">Win Rate</p>
                <p className="text-lg font-mono font-bold text-text-primary">{bot.winRate}%</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Rendyr Card */}
        <Link href="/rendyr" className="block">
          <div className="bg-surface border border-primary-bright/20 rounded-xl p-5 shadow-glow-green hover:border-primary-bright/40 transition-all h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">🎬 Rendyr</h2>
                <p className="text-text-secondary text-xs mt-0.5">tools · education · community</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/40 text-primary-bright">
                FREE TIER
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-text-secondary">👥 Skool Members</span>
                <span className="font-mono font-bold text-text-primary">{rendyr.skoolMembers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-text-secondary">📸 Instagram</span>
                <span className="font-mono font-bold text-text-primary">
                  {(rendyr.instagramFollowers / 1000).toFixed(1)}K
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-text-secondary">🎬 Bundle Sales</span>
                <span className="font-mono font-bold text-primary-bright">{rendyr.bundleSalesThisMonth}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-text-secondary">💰 MRR</span>
                <span className="font-mono font-bold text-text-secondary">${rendyr.mrr}/mo</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Way of Woof Card */}
        <Link href="/woof" className="block">
          <div className="bg-surface border border-wow-navy/40 rounded-xl p-5 shadow-glow-navy hover:border-wow-purple/40 transition-all h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">🐾 Way of Woof</h2>
                <p className="text-text-secondary text-xs mt-0.5">dog wellness house</p>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-wow-amber/20 text-wow-amber border border-wow-amber/30">
                PRE-LAUNCH
              </span>
            </div>

            {/* Milestone progress */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-text-secondary">Launch Progress</span>
                <span className="text-xs font-mono text-wow-amber">{milestonesDone}/{milestoneTotal}</span>
              </div>
              <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-wow-amber rounded-full transition-all"
                  style={{ width: `${milestonePct}%` }}
                />
              </div>
            </div>

            {/* Milestones list */}
            <div className="space-y-2 mt-3">
              {woofMilestones.map((m) => {
                const done = woof.milestones[m.key as keyof typeof woof.milestones];
                return (
                  <div key={m.key} className="flex items-center gap-2">
                    <span className="text-sm">
                      {done ? "✅" : m.key === "launched" ? "⬜" : "🔄"}
                    </span>
                    <span className={`text-sm ${done ? "text-text-secondary line-through" : "text-text-primary"}`}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      </div>

      {/* ── Row 3: Quick Tasks ─────────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">⚡ Quick Wins</h2>
          <Link href="/tasks" className="text-xs text-primary-bright hover:underline">View all →</Link>
        </div>
        <div className="space-y-2">
          {quickTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleQuickTask(task.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface2 transition-colors text-left"
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                task.done
                  ? "bg-primary-bright border-primary-bright"
                  : "border-border hover:border-primary-bright"
              }`}>
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className={`text-sm flex-1 ${task.done ? "line-through text-text-secondary" : "text-text-primary"}`}>
                {task.text}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
