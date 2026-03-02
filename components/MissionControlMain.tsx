"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Activity,
  Package,
  Video,
  Users,
  ChevronRight,
  AlertCircle
} from "lucide-react";

interface TradingData {
  btc_price?: number;
  robinhood_equity?: number;
  account_total?: number;
  recent_signals?: number;
  filter_status?: string;
}

interface WoofData {
  instagram_followers?: number;
  inventory_alerts?: number;
  next_milestone?: string;
  production?: {
    currentInventory?: {
      peanutButter?: number;
      hotMilk?: number;
    };
  };
}

interface RendyrData {
  instagram_followers?: number;
  social?: {
    instagramFollowers?: number;
  };
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 60000);
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
    console.log(`Loading context: ${project}`);
    alert(`Context loading for ${project} - integrate with Scout API`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse text-2xl mb-4">mission control</div>
          <div className="text-zinc-500 text-sm">initializing systems...</div>
        </div>
      </div>
    );
  }

  const totalBalance = (trading.robinhood_equity || 0) + (trading.account_total || 0);
  const woofFollowers = woof.instagram_followers || 0;
  const rendyrFollowers = rendyr.social?.instagramFollowers || rendyr.instagram_followers || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 text-white">
      
      {/* Top Bar */}
      <div className="border-b border-zinc-800/50 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">mission control</h1>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                onChange={(e) => loadContext(e.target.value)}
                className="bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm hover:border-zinc-600 transition-colors"
              >
                <option value="">load context...</option>
                <option value="trading">trading</option>
                <option value="woof">wayofwoof</option>
                <option value="rendyr">rendyr</option>
                <option value="all">all projects</option>
              </select>

              <button
                onClick={() => alert("Graduate command - integrate with OpenClaw")}
                className="bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm transition-colors"
              >
                graduate
              </button>

              <button
                onClick={() => alert("Ideas command - integrate with OpenClaw")}
                className="bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-4 py-2 text-sm transition-colors"
              >
                ideas
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Trading Account */}
          <div className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm text-zinc-500 uppercase tracking-wider">trading</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                ${totalBalance.toFixed(2)}
              </div>
              <div className="text-sm text-zinc-500">
                robinhood ${(trading.robinhood_equity || 0).toFixed(2)} · 
                binance ${(trading.account_total || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* BTC Price */}
          <div className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-zinc-500 uppercase tracking-wider">btc</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                ${(trading.btc_price || 0).toLocaleString()}
              </div>
              <div className="text-sm text-zinc-500">
                filter: {trading.filter_status || "active"}
              </div>
            </div>
          </div>

          {/* Second Brain */}
          <div className="group relative bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6 hover:border-zinc-700/50 transition-all overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-zinc-500 uppercase tracking-wider">brain</span>
              </div>
              <div className="text-3xl font-bold mb-2">
                {brain.permanent_notes + brain.structure_notes}
              </div>
              <div className="text-sm text-zinc-500">
                {brain.permanent_notes} permanent · {brain.structure_notes} structure
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Projects - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* WayofWoof Project Card */}
            <div className="bg-gradient-to-br from-amber-900/20 via-zinc-900/50 to-zinc-900/50 border border-amber-800/30 rounded-xl p-6 hover:border-amber-700/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">wayofwoof</h3>
                    <p className="text-xs text-amber-600">premium dog wellness</p>
                  </div>
                </div>
                <Link 
                  href="/wayofwoof"
                  className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                >
                  open <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-amber-900/30">
                  <div className="text-xs text-amber-600 mb-1">instagram</div>
                  <div className="text-2xl font-bold text-amber-300">
                    {woofFollowers.toLocaleString()}
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-amber-900/30">
                  <div className="text-xs text-amber-600 mb-1">inventory</div>
                  <div className="text-2xl font-bold text-amber-300">
                    {(woof.production?.currentInventory?.peanutButter || 0) + 
                     (woof.production?.currentInventory?.hotMilk || 0)}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">units ready</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-amber-900/30">
                  <div className="text-xs text-amber-600 mb-1">alerts</div>
                  <div className="text-2xl font-bold text-amber-300">
                    {woof.inventory_alerts || 0}
                  </div>
                  {(woof.inventory_alerts || 0) > 0 && (
                    <AlertCircle className="w-4 h-4 text-red-400 mt-1" />
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-900/30 text-sm text-amber-600">
                next: {woof.next_milestone || "label approval"}
              </div>
            </div>

            {/* Rendyr Project Card */}
            <div className="bg-gradient-to-br from-blue-900/20 via-zinc-900/50 to-zinc-900/50 border border-blue-800/30 rounded-xl p-6 hover:border-blue-700/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-300">rendyr</h3>
                    <p className="text-xs text-blue-600">digital products</p>
                  </div>
                </div>
                <Link 
                  href="/rendyr"
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  open <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/30 rounded-lg p-4 border border-blue-900/30">
                  <div className="text-xs text-blue-600 mb-1">instagram</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {rendyrFollowers.toLocaleString()}
                  </div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-blue-900/30">
                  <div className="text-xs text-blue-600 mb-1">digest</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {rendyr.latest_digest_items || 0}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">items</div>
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-blue-900/30">
                  <div className="text-xs text-blue-600 mb-1">videos</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {rendyr.new_videos || 0}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">new</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed - Right Column */}
          <div className="space-y-6">
            
            {/* Today's Focus */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                today's focus
              </h3>
              <div className="text-sm text-zinc-400 italic leading-relaxed">
                "fix wayofwoof dashboard, redesign all three mission control views, make everything beautiful"
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                recent activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <div className="text-zinc-600 text-xs mt-0.5 font-mono">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-zinc-400 flex-1">
                    dashboard redesign in progress
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="text-zinc-600 text-xs mt-0.5 font-mono">09:44</div>
                  <div className="text-zinc-400 flex-1">
                    data pusher: fresh inventory, robinhood, trading stats
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <div className="text-zinc-600 text-xs mt-0.5 font-mono">03:23</div>
                  <div className="text-zinc-400 flex-1">
                    overnight: second brain system built
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">quick links</h3>
              <div className="space-y-2">
                <Link 
                  href="/trading"
                  className="block bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 text-sm transition-colors border border-zinc-700/50"
                >
                  <div className="flex items-center justify-between">
                    <span>trading dashboard</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </Link>
                <Link 
                  href="/videos"
                  className="block bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 text-sm transition-colors border border-zinc-700/50"
                >
                  <div className="flex items-center justify-between">
                    <span>ai video feed</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </Link>
                <Link 
                  href="/ads"
                  className="block bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 text-sm transition-colors border border-zinc-700/50"
                >
                  <div className="flex items-center justify-between">
                    <span>meta ads tracker</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Footer */}
        <div className="mt-8 bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              system operational
            </div>
            <div>
              last refresh: {new Date().toLocaleTimeString()}
            </div>
            <Link href="/api/health" className="hover:text-zinc-400 transition-colors">
              diagnostics →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
