"use client";

import { useEffect, useState } from "react";

interface WoofData {
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
  milestones: Array<{
    id: string;
    text: string;
    complete: boolean;
    category: string;
  }>;
  inventory: {
    totalValue: number;
    itemsTracked: number;
    lowStockAlerts: number;
  };
}

interface Ingredient {
  ingredient: string;
  stock: number;
  unit: string;
  threshold: number;
  supplier: string;
  cost_per_unit: number;
  status: "ok" | "low" | "out";
}

export default function WayofWoofPortal() {
  const [data, setData] = useState<WoofData | null>(null);
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const woofRes = await fetch("/data/woof.json");
        const woofData = await woofRes.json();
        setData(woofData);

        const inventoryRes = await fetch("/api/inventory/data");
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData.inventory || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9f6f1" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🐾</div>
          <div className="text-sm tracking-widest uppercase" style={{ color: "#6b7280" }}>
            loading
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9f6f1" }}>
        <div className="text-red-500">failed to load</div>
      </div>
    );
  }

  const activeMilestones = data.milestones.filter((m) => !m.complete);
  const completedMilestones = data.milestones.filter((m) => m.complete);
  const lowStockItems = inventory.filter((i) => i.status === "low" || i.status === "out");
  const totalUnits =
    data.production.currentInventory.peanutButter +
    data.production.currentInventory.hotMilk;
  const launchProgress = Math.round(
    (completedMilestones.length / data.milestones.length) * 100
  );

  return (
    <div className="min-h-screen" style={{ background: "#f9f6f1", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Hero Header */}
      <div style={{ background: "#1a3a24" }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #4ade80 0%, transparent 50%), radial-gradient(circle at 80% 20%, #86efac 0%, transparent 40%)"
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs tracking-widest uppercase mb-3" style={{ color: "#6ee7b7" }}>
                production dashboard
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-2">
                wayofwoof
              </h1>
              <p className="text-sm" style={{ color: "#a7f3d0" }}>
                premium dog wellness · handcrafted in los angeles
              </p>
            </div>
            <div className="hidden md:block text-right">
              <div className="text-4xl font-bold text-white">{launchProgress}%</div>
              <div className="text-xs tracking-widest uppercase mt-1" style={{ color: "#6ee7b7" }}>to launch</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex justify-between text-xs mb-2" style={{ color: "#a7f3d0" }}>
              <span>{completedMilestones.length} milestones complete</span>
              <span>{activeMilestones.length} remaining</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${launchProgress}%`, background: "#4ade80" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Low Stock Alert Banner */}
        {lowStockItems.length > 0 && (
          <div className="mb-8 rounded-2xl border p-5 flex items-start gap-4"
            style={{ background: "#fff7ed", borderColor: "#fed7aa" }}>
            <div className="text-2xl mt-0.5">⚠️</div>
            <div>
              <div className="font-semibold text-sm mb-1" style={{ color: "#9a3412" }}>
                {lowStockItems.length} ingredient{lowStockItems.length !== 1 ? "s" : ""} need restocking
              </div>
              <div className="flex flex-wrap gap-2">
                {lowStockItems.map((item) => (
                  <span key={item.ingredient}
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: item.status === "out" ? "#fee2e2" : "#fef3c7",
                      color: item.status === "out" ? "#991b1b" : "#92400e"
                    }}>
                    {item.ingredient} · {item.stock}{item.unit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {/* PB Jars */}
          <div className="rounded-2xl p-6 bg-white shadow-sm border" style={{ borderColor: "#e7e5e4" }}>
            <div className="text-2xl mb-3">🥜</div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#1c1917" }}>
              {data.production.currentInventory.peanutButter}
            </div>
            <div className="text-xs font-medium tracking-wide uppercase" style={{ color: "#a8a29e" }}>
              PB jars ready
            </div>
          </div>

          {/* Hot Milk */}
          <div className="rounded-2xl p-6 bg-white shadow-sm border" style={{ borderColor: "#e7e5e4" }}>
            <div className="text-2xl mb-3">☕</div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#1c1917" }}>
              {data.production.currentInventory.hotMilk}
            </div>
            <div className="text-xs font-medium tracking-wide uppercase" style={{ color: "#a8a29e" }}>
              hot milk units
            </div>
          </div>

          {/* Instagram */}
          <div className="rounded-2xl p-6 bg-white shadow-sm border" style={{ borderColor: "#e7e5e4" }}>
            <div className="text-2xl mb-3">📸</div>
            <div className="text-3xl font-bold mb-1" style={{ color: "#1c1917" }}>
              {data.social.instagramFollowers.toLocaleString()}
            </div>
            <div className="text-xs font-medium tracking-wide uppercase" style={{ color: "#a8a29e" }}>
              IG followers
            </div>
          </div>

          {/* Total Units */}
          <div className="rounded-2xl p-6 shadow-sm border" style={{ background: "#1a3a24", borderColor: "#1a3a24" }}>
            <div className="text-2xl mb-3">📦</div>
            <div className="text-3xl font-bold mb-1 text-white">
              {totalUnits}
            </div>
            <div className="text-xs font-medium tracking-wide uppercase" style={{ color: "#6ee7b7" }}>
              total units ready
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

          {/* Inventory Table — 2 cols */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm border overflow-hidden" style={{ borderColor: "#e7e5e4" }}>
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: "#f5f5f4" }}>
                <div>
                  <h2 className="font-bold text-base" style={{ color: "#1c1917" }}>ingredient inventory</h2>
                  <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>
                    {inventory.length} ingredients · ${data.inventory.totalValue.toFixed(2)} total value
                  </p>
                </div>
                <span className="text-xs px-3 py-1.5 rounded-full font-medium"
                  style={{ background: lowStockItems.length > 0 ? "#fef3c7" : "#dcfce7", color: lowStockItems.length > 0 ? "#92400e" : "#166534" }}>
                  {lowStockItems.length > 0 ? `${lowStockItems.length} alerts` : "all good ✓"}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: "#fafaf9" }}>
                      <th className="px-6 py-3 text-left text-xs font-semibold tracking-wide uppercase" style={{ color: "#a8a29e" }}>ingredient</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase" style={{ color: "#a8a29e" }}>stock</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase" style={{ color: "#a8a29e" }}>value</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold tracking-wide uppercase" style={{ color: "#a8a29e" }}>status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory
                      .sort((a, b) => (b.stock * b.cost_per_unit) - (a.stock * a.cost_per_unit))
                      .map((item, idx) => (
                        <tr key={item.ingredient}
                          className="border-t transition-colors hover:bg-stone-50"
                          style={{ borderColor: "#f5f5f4" }}>
                          <td className="px-6 py-3.5 font-medium" style={{ color: "#1c1917" }}>
                            {item.ingredient}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-sm" style={{ color: "#44403c" }}>
                            {item.stock.toLocaleString()}
                            <span className="text-xs ml-1" style={{ color: "#a8a29e" }}>{item.unit}</span>
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm" style={{ color: "#44403c" }}>
                            ${(item.stock * item.cost_per_unit / 1000).toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              item.status === "ok"
                                ? "bg-emerald-50 text-emerald-700"
                                : item.status === "low"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                item.status === "ok" ? "bg-emerald-500" : item.status === "low" ? "bg-amber-500" : "bg-red-500"
                              }`} />
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Milestones — 1 col */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white shadow-sm border overflow-hidden" style={{ borderColor: "#e7e5e4" }}>
              <div className="px-6 py-5 border-b" style={{ borderColor: "#f5f5f4" }}>
                <h2 className="font-bold text-base" style={{ color: "#1c1917" }}>launch checklist</h2>
                <p className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>
                  {completedMilestones.length} of {data.milestones.length} complete
                </p>
              </div>
              <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
                {data.milestones.map((m) => (
                  <div key={m.id}
                    className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                    style={{ background: m.complete ? "#f0fdf4" : "#fafaf9" }}>
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      m.complete ? "bg-emerald-500" : "border-2"
                    }`} style={m.complete ? {} : { borderColor: "#d6d3d1" }}>
                      {m.complete && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${m.complete ? "line-through" : ""}`}
                        style={{ color: m.complete ? "#a8a29e" : "#1c1917" }}>
                        {m.text}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "#a8a29e" }}>{m.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs pt-6 border-t" style={{ borderColor: "#e7e5e4", color: "#a8a29e" }}>
          <span>wayofwoof · powered by scout</span>
          <span>updated {new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "short", timeStyle: "short" })}</span>
        </div>
      </div>
    </div>
  );
}
