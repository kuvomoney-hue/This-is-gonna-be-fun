"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────
interface TradingData {
  btc_price?: number;
  robinhood_equity?: number;
  binance_balance?: number;
  recent_signals?: number;
  filter_status?: string;
}

interface WoofData {
  instagram_followers?: number;
  inventory_alerts?: number;
  next_milestone?: string;
}

interface RendyrData {
  instagram_followers?: number;
  latest_digest_items?: number;
  new_videos?: number;
}

interface SecondBrainStats {
  permanent_notes: number;
  structure_notes: number;
  last_graduate?: string;
}

export default function MissionControlMain() {
  const [trading, setTrading] = useState<TradingData>({});
  const [woof, setWoof] = useState<WoofData>({});
  const [rendyr, setRendyr] = useState<RendyrData>({});
  const [brain, setBrain] = useState<SecondBrainStats>({
    permanent_notes: 15,
    structure_notes: 3,
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load data
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [tradingRes, robinhoodRes, woofRes, rendyrRes] = await Promise.all([
        fetch("/data/trading.json", { cache: "no-store" }),
        fetch("/api/robinhood", { cache: "no-store" }),
        fetch("/data/woof.json", { cache: "no-store" }),
        fetch("/data/rendyr.json", { cache: "no-store" }),
      ]);

      if (tradingRes.ok) {
        const tradingData = await tradingRes.json();
        // Map trading.json fields to what component expects
        tradingData.binance_balance = tradingData.account_total || 0;
        setTrading(tradingData);
      }
      
      if (robinhoodRes.ok) {
        const rhData = await robinhoodRes.json();
        setTrading(prev => ({ ...prev, robinhood_equity: rhData.equity || 0 }));
      }
      
      if (woofRes.ok) setWoof(await woofRes.json());
      if (rendyrRes.ok) setRendyr(await rendyrRes.json());

      setLoading(false);
    } catch (err) {
      console.error("Failed to load data:", err);
      setLoading(false);
    }
  };

  const loadContext = (project: string) => {
    // This will be integrated with Scout/OpenClaw context loading
    console.log(`Loading context: ${project}`);
    alert(`Context loading for ${project} - integrate with Scout API`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">loading mission control...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold">mission control</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <select
            onChange={(e) => loadContext(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-sm"
          >
            <option value="">load context...</option>
            <option value="trading">trading</option>
            <option value="woof">wayofwoof</option>
            <option value="rendyr">rendyr</option>
            <option value="all">all projects</option>
          </select>

          <button
            onClick={() => alert("Graduate command - integrate with OpenClaw")}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-sm"
          >
            graduate
          </button>

          <button
            onClick={() => alert("Ideas command - integrate with OpenClaw")}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-sm"
          >
            ideas
          </button>
        </div>
      </div>

      {/* ── Main Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* ── Left: Trading ──────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-400">trading</h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-2">account balance</div>
            <div className="text-2xl font-bold">
              ${((trading.robinhood_equity || 0) + (trading.binance_balance || 0)).toFixed(2)}
            </div>
            <div className="text-xs text-zinc-600 mt-1">
              robinhood: ${(trading.robinhood_equity || 0).toFixed(2)} · binance: $
              {(trading.binance_balance || 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-2">btc price</div>
            <div className="text-2xl font-bold">
              ${(trading.btc_price || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-2">context filter</div>
            <div className="text-sm">{trading.filter_status || "active"}</div>
            <div className="text-xs text-zinc-600 mt-1">
              crypto: 60/100 · equity: 45/100
            </div>
          </div>

          <Link
            href="/trading"
            className="block bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center text-sm"
          >
            view full trading →
          </Link>
        </div>

        {/* ── Middle: Focus ──────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-400">focus</h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-3">today's intention</div>
            <div className="text-sm italic text-zinc-400">
              "build new mission control, fix meta ads scraper, wake up to operational system"
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-3">recent activity</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="text-zinc-600 text-xs mt-0.5">03:23</div>
                <div className="text-zinc-400">data pusher: fresh inventory, robinhood, trading stats</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-zinc-600 text-xs mt-0.5">03:15</div>
                <div className="text-zinc-400">phase 1-5 complete: second brain operational</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="text-zinc-600 text-xs mt-0.5">01:50</div>
                <div className="text-zinc-400">instagram: rendyr 13,757 · woof 1,079</div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm text-zinc-500 mb-3">second brain</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-zinc-600 text-xs">permanent notes</div>
                <div className="text-xl font-bold">{brain.permanent_notes}</div>
              </div>
              <div>
                <div className="text-zinc-600 text-xs">structure notes</div>
                <div className="text-xl font-bold">{brain.structure_notes}</div>
              </div>
            </div>
            <div className="text-xs text-zinc-600 mt-3">
              last graduate: {brain.last_graduate || "2 hours ago"}
            </div>
          </div>
        </div>

        {/* ── Right: Projects ────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-400">projects</h2>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm font-semibold mb-3">wayofwoof</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">instagram</span>
                <span className="font-mono">{(woof.instagram_followers || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">inventory alerts</span>
                <span className="font-mono">{woof.inventory_alerts || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">next milestone</span>
                <span className="text-xs text-zinc-400">{woof.next_milestone || "label approval"}</span>
              </div>
            </div>
            <Link
              href="/wayofwoof"
              className="mt-3 block text-center bg-zinc-800 hover:bg-zinc-700 rounded py-2 text-xs"
            >
              view dashboard →
            </Link>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="text-sm font-semibold mb-3">rendyr</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">instagram</span>
                <span className="font-mono">{(rendyr.instagram_followers || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">digest items</span>
                <span className="font-mono">{rendyr.latest_digest_items || 40}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">new videos</span>
                <span className="font-mono">{rendyr.new_videos || 30}</span>
              </div>
            </div>
            <Link
              href="/rendyr"
              className="mt-3 block text-center bg-zinc-800 hover:bg-zinc-700 rounded py-2 text-xs"
            >
              view dashboard →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/videos"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center text-xs"
            >
              ai videos
            </Link>
            <Link
              href="/ads"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center text-xs"
            >
              meta ads
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────── */}
      <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-600">
        <div>
          system health: <span className="text-green-500">●</span> operational
        </div>
        <div>last refresh: just now</div>
        <div>
          <Link href="/api/health" className="hover:text-zinc-400">
            diagnostics →
          </Link>
        </div>
      </div>
    </div>
  );
}
