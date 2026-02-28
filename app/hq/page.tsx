"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BotStatus {
  status: string;
  uptime_hours: number;
  last_signal: string;
  positions_open: number;
  account_balance: number;
  btc_price: number;
}

interface RobinhoodData {
  equity: number;
  buying_power: number;
  positions: number;
}

interface RendyrData {
  social: { instagramFollowers: number };
  skool: { members: number };
  bundle: { totalSales: number };
  email: { subscribers: number };
}

interface WoofData {
  social: { instagramFollowers: number };
  production: {
    status: string;
    currentInventory: { peanutButter: number; hotMilk: number };
  };
  inventory: { totalValue: number };
  milestones: Array<{ complete: boolean }>;
}

interface Task {
  id: string;
  title: string;
  category: string;
  priority: "high" | "medium" | "low";
  timeEstimate: string;
}

export default function HQPage() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [robinhood, setRobinhood] = useState<RobinhoodData | null>(null);
  const [rendyr, setRendyr] = useState<RendyrData | null>(null);
  const [woof, setWoof] = useState<WoofData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [botRes, rhRes, rendyrRes, woofRes, tasksRes] = await Promise.all([
          fetch("/data/bot_status.json"),
          fetch("/api/robinhood"),
          fetch("/data/rendyr.json"),
          fetch("/data/woof.json"),
          fetch("/data/tasks.json"),
        ]);

        const botData = await botRes.json();
        const rhData = await rhRes.json();
        const rendyrData = await rendyrRes.json();
        const woofData = await woofRes.json();
        const tasksData = await tasksRes.json();

        setBotStatus(botData);
        setRobinhood(rhData);
        setRendyr(rendyrData);
        setWoof(woofData);

        // Get high-priority quick wins only
        const quickWins = tasksData.tasks
          .filter((t: Task) => t.priority === "high" && t.timeEstimate.includes("<"))
          .slice(0, 5);
        setTasks(quickWins);
      } catch (err) {
        console.error("Failed to load HQ data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">loading mission control...</div>
      </div>
    );
  }

  const totalCapital = (botStatus?.account_balance || 0) + (robinhood?.equity || 0);
  const totalPositions = (botStatus?.positions_open || 0) + (robinhood?.positions || 0);
  const woofProgress = woof
    ? (woof.milestones.filter((m) => m.complete).length / woof.milestones.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">🧭 mission control</h1>
              <p className="text-gray-500 text-sm">
                {new Date().toLocaleString("en-US", {
                  timeZone: "America/Los_Angeles",
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/trading"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-all"
              >
                trading
              </Link>
              <Link
                href="/tasks"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                tasks
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Capital */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-700/50 rounded-lg p-6">
            <div className="text-blue-400 text-xs uppercase mb-2">total capital</div>
            <div className="text-3xl font-bold mb-1">
              ${totalCapital.toFixed(2)}
            </div>
            <div className="text-gray-500 text-xs">
              {totalPositions} {totalPositions === 1 ? "position" : "positions"} open
            </div>
          </div>

          {/* Rendyr */}
          <Link
            href="/share/rendyr"
            className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg p-6 transition-all group"
          >
            <div className="text-gray-400 text-xs uppercase mb-2">rendyr</div>
            <div className="text-2xl font-bold mb-1 group-hover:text-blue-400 transition-colors">
              {rendyr?.social.instagramFollowers.toLocaleString() || 0}
            </div>
            <div className="text-gray-500 text-xs">
              {rendyr?.skool.members || 0} academy • {rendyr?.bundle.totalSales || 0} sales
            </div>
          </Link>

          {/* WayofWoof */}
          <Link
            href="/share/woof"
            className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-lg p-6 transition-all group"
          >
            <div className="text-gray-400 text-xs uppercase mb-2">wayofwoof</div>
            <div className="text-2xl font-bold mb-1 text-[#14591D] group-hover:text-[#1a6e24] transition-colors">
              {woof?.production.status || "unknown"}
            </div>
            <div className="text-gray-500 text-xs">
              {woofProgress.toFixed(0)}% complete • ${woof?.inventory.totalValue.toFixed(2) || 0}
            </div>
          </Link>

          {/* Bot Status */}
          <div
            className={`border rounded-lg p-6 ${
              botStatus?.status === "RUNNING"
                ? "bg-green-900/20 border-green-700/50"
                : "bg-red-900/20 border-red-700/50"
            }`}
          >
            <div className="text-gray-400 text-xs uppercase mb-2">bot status</div>
            <div className="text-2xl font-bold mb-1">
              {botStatus?.status || "OFFLINE"}
            </div>
            <div className="text-gray-500 text-xs">
              {botStatus?.uptime_hours || 0}h uptime
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quick Wins */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">⚡ quick wins</h2>
                <Link
                  href="/tasks"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  view all →
                </Link>
              </div>

              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-all cursor-pointer"
                    >
                      <div className="text-sm font-medium mb-1">{task.title}</div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{task.category}</span>
                        <span>{task.timeEstimate}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-8">
                    no quick wins right now
                  </div>
                )}
              </div>
            </div>

            {/* Second Brain Status */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-700/50 rounded-lg p-6 mt-6">
              <h2 className="text-lg font-bold mb-4">🧠 second brain</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">permanent notes</span>
                  <span className="font-bold">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">structure notes</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">context files</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="pt-3 border-t border-purple-700/30">
                  <a
                    href="obsidian://open?vault=Obsidian%20Vault"
                    className="text-purple-400 hover:text-purple-300 text-xs"
                  >
                    open in obsidian →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activity + Links */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shareable Links */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">🔗 shareable portals</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/share/rendyr"
                  target="_blank"
                  className="bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-lg p-4 transition-all group"
                >
                  <div className="text-sm font-medium mb-1 group-hover:text-blue-400">
                    rendyr portal
                  </div>
                  <div className="text-xs text-gray-500">for dylan</div>
                </Link>

                <Link
                  href="/share/woof"
                  target="_blank"
                  className="bg-gray-800 border border-gray-700 hover:border-[#14591D] rounded-lg p-4 transition-all group"
                >
                  <div className="text-sm font-medium mb-1 group-hover:text-[#14591D]">
                    wayofwoof portal
                  </div>
                  <div className="text-xs text-gray-500">for amanda</div>
                </Link>

                <Link
                  href="/share/videos"
                  target="_blank"
                  className="bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-lg p-4 transition-all group"
                >
                  <div className="text-sm font-medium mb-1 group-hover:text-purple-400">
                    ai video feed
                  </div>
                  <div className="text-xs text-gray-500">youtube + x</div>
                </Link>

                <Link
                  href="/share/ads"
                  target="_blank"
                  className="bg-gray-800 border border-gray-700 hover:border-yellow-500 rounded-lg p-4 transition-all group"
                >
                  <div className="text-sm font-medium mb-1 group-hover:text-yellow-400">
                    meta ads feed
                  </div>
                  <div className="text-xs text-gray-500">fb/ig ads</div>
                </Link>
              </div>
            </div>

            {/* Trading Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">📊 trading overview</h2>
                <Link
                  href="/trading"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  full dashboard →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-xs mb-1">binance (btc)</div>
                  <div className="text-xl font-bold">
                    ${botStatus?.account_balance.toFixed(2) || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {botStatus?.positions_open || 0} open
                  </div>
                </div>

                <div>
                  <div className="text-gray-400 text-xs mb-1">robinhood (options)</div>
                  <div className="text-xl font-bold">
                    ${robinhood?.equity.toFixed(2) || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {robinhood?.positions || 0} open
                  </div>
                </div>
              </div>

              {botStatus?.last_signal && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="text-xs text-gray-500">last signal</div>
                  <div className="text-sm font-mono mt-1">
                    {botStatus.last_signal}
                  </div>
                </div>
              )}
            </div>

            {/* Projects Overview */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">🚀 projects</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">rendyr</span>
                    <span className="text-xs text-gray-500">
                      {rendyr?.email.subscribers || 0} subscribers
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">wayofwoof</span>
                    <span className="text-xs text-gray-500">
                      {woofProgress.toFixed(0)}% complete
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#14591D]"
                      style={{ width: `${woofProgress}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">trading system</span>
                    <span className="text-xs text-gray-500">
                      ${totalCapital.toFixed(0)} capital
                    </span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-600"
                      style={{ width: "80%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
