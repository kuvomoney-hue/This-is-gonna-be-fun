"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, TrendingUp, AlertCircle, CheckCircle2, Instagram } from "lucide-react";

interface WoofData {
  instagram_followers: number;
  inventory_alerts: number;
  next_milestone: string;
  social: {
    instagramFollowers: number;
    instagramEngagement: string;
  };
  production: {
    status: string;
    batchesComplete: number;
    currentInventory: {
      peanutButter: number;
      hotMilk: number;
    };
  };
  milestones: {
    id: string;
    text: string;
    complete: boolean;
    category: string;
  }[];
  inventory: {
    totalValue: number;
    itemsTracked: number;
    lowStockAlerts: number;
  };
}

interface InventoryItem {
  ingredient: string;
  stock: number;
  unit: string;
  threshold: number;
  status: "ok" | "low" | "out";
}

export default function WayofWoofView() {
  const [data, setData] = useState<WoofData | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [woofRes, invRes] = await Promise.all([
        fetch("/data/woof.json", { cache: "no-store" }),
        fetch("/api/inventory/data", { cache: "no-store" }),
      ]);

      if (woofRes.ok) setData(await woofRes.json());
      if (invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData.inventory || []);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load WayofWoof data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-bounce text-6xl mb-4">🐕</div>
          <div className="text-xl text-amber-900 font-medium">loading wayofwoof...</div>
        </div>
      </div>
    );
  }

  const lowStockItems = inventory.filter((i) => i.status === "low" || i.status === "out");
  const completedMilestones = data?.milestones.filter(m => m.complete).length || 0;
  const totalMilestones = data?.milestones.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-amber-900">wayofwoof</h1>
              <p className="text-amber-700 text-sm mt-1">premium dog wellness · handcrafted with love</p>
            </div>
            <Link 
              href="/" 
              className="text-amber-600 hover:text-amber-800 text-sm font-medium transition-colors"
            >
              ← mission control
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Inventory Alerts Banner */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 rounded-r-lg p-4 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-red-900 font-semibold mb-2">
                  {lowStockItems.length} ingredient{lowStockItems.length !== 1 ? 's' : ''} need restocking
                </h3>
                <div className="space-y-1">
                  {lowStockItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-red-800">{item.ingredient}</span>
                      <span className="text-red-700 font-mono text-xs bg-red-100 px-2 py-1 rounded">
                        {item.stock} {item.unit} (need {item.threshold}+)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Peanut Butter */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-200/50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                batch {data?.production.batchesComplete || 0}
              </span>
            </div>
            <div className="text-sm text-amber-700 mb-1">peanut butter</div>
            <div className="text-3xl font-bold text-amber-900">
              {data?.production.currentInventory.peanutButter || 0}
            </div>
            <div className="text-xs text-amber-600 mt-1">jars ready</div>
          </div>

          {/* Hot Milk Collection */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-200/50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                5 flavors
              </span>
            </div>
            <div className="text-sm text-orange-700 mb-1">hot milk collection</div>
            <div className="text-3xl font-bold text-orange-900">
              {data?.production.currentInventory.hotMilk || 0}
            </div>
            <div className="text-xs text-orange-600 mt-1">units ready</div>
          </div>

          {/* Instagram */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md border border-amber-200/50 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Instagram className="w-5 h-5 text-pink-600" />
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm text-pink-700 mb-1">instagram</div>
            <div className="text-3xl font-bold text-pink-900">
              {data?.social.instagramFollowers.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-pink-600 mt-1">
              {data?.social.instagramEngagement || "0%"} engagement
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                {data?.production.status || "ACTIVE"}
              </span>
            </div>
            <div className="text-sm opacity-90 mb-1">launch progress</div>
            <div className="text-3xl font-bold">
              {Math.round((completedMilestones / totalMilestones) * 100)}%
            </div>
            <div className="text-xs opacity-80 mt-1">
              {completedMilestones} of {totalMilestones} milestones
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inventory Table - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">ingredient inventory</h2>
                <p className="text-amber-50 text-sm mt-1">
                  {data?.inventory.itemsTracked || 0} ingredients tracked · 
                  ${data?.inventory.totalValue.toFixed(2) || "0.00"} total value
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-amber-50 border-b border-amber-200">
                    <tr>
                      <th className="text-left p-4 text-sm text-amber-900 font-semibold">ingredient</th>
                      <th className="text-right p-4 text-sm text-amber-900 font-semibold">stock</th>
                      <th className="text-right p-4 text-sm text-amber-900 font-semibold">threshold</th>
                      <th className="text-right p-4 text-sm text-amber-900 font-semibold">status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {inventory.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-amber-600">
                          no inventory data available
                        </td>
                      </tr>
                    ) : (
                      inventory.map((item, idx) => (
                        <tr 
                          key={idx} 
                          className={`hover:bg-amber-50/50 transition-colors ${
                            item.status !== 'ok' ? 'bg-red-50/30' : ''
                          }`}
                        >
                          <td className="p-4 text-amber-900 font-medium">{item.ingredient}</td>
                          <td className="p-4 text-right font-mono text-amber-900">
                            {item.stock} <span className="text-amber-600 text-xs">{item.unit}</span>
                          </td>
                          <td className="p-4 text-right font-mono text-amber-600 text-sm">
                            {item.threshold} {item.unit}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                item.status === "ok"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "low"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status === "ok" && "✓ "}
                              {item.status === "low" && "⚠ "}
                              {item.status === "out" && "✕ "}
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Milestones - Takes 1 column */}
          <div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-200/50 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">milestones</h2>
                <p className="text-amber-50 text-sm mt-1">launch checklist</p>
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                <div className="space-y-3">
                  {data?.milestones.map((milestone) => (
                    <div 
                      key={milestone.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        milestone.complete 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                          milestone.complete
                            ? "bg-green-500 border-green-500"
                            : "border-amber-300 bg-white"
                        }`}
                      >
                        {milestone.complete && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          milestone.complete ? 'text-green-900' : 'text-amber-900'
                        }`}>
                          {milestone.text}
                        </div>
                        <div className="text-xs text-amber-600 mt-0.5">
                          {milestone.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200/50">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-amber-700">
            <div>
              <span className="font-semibold">Status:</span> {data?.production.status || "pre-launch"}
            </div>
            <div>
              <span className="font-semibold">Next milestone:</span> {data?.next_milestone || "label approval"}
            </div>
            <div>
              <span className="font-semibold">Last updated:</span> {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
