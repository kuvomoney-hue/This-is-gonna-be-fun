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
  name: string;
  stock: number;
  unit: string;
  cost_per_unit: number;
  total_value: number;
  status: "OK" | "LOW" | "OUT";
}

export default function WayofWoofPortal() {
  const [data, setData] = useState<WoofData | null>(null);
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch WayofWoof stats
        const woofRes = await fetch("/data/woof.json");
        const woofData = await woofRes.json();
        setData(woofData);

        // Fetch inventory
        const inventoryRes = await fetch("/data/inventory.json");
        const inventoryData = await inventoryRes.json();
        setInventory(inventoryData.ingredients || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-xl">loading wayofwoof...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-red-500 text-xl">failed to load data</div>
      </div>
    );
  }

  const activeMilestones = data.milestones.filter((m) => !m.complete);
  const completedMilestones = data.milestones.filter((m) => m.complete);
  const lowStockItems = inventory.filter((i) => i.status === "LOW" || i.status === "OUT");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-[#14591D]">
          wayofwoof
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          premium dog wellness • production dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Instagram */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">instagram</div>
          <div className="text-3xl font-bold mb-1">
            {data.social.instagramFollowers.toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs">
            {data.social.instagramEngagement} engagement
          </div>
        </div>

        {/* Production Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">production</div>
          <div className="text-3xl font-bold mb-1 text-[#14591D]">
            {data.production.status}
          </div>
          <div className="text-gray-500 text-xs">
            {data.production.batchesComplete} batches complete
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">inventory</div>
          <div className="text-3xl font-bold mb-1">
            ${data.inventory.totalValue.toFixed(2)}
          </div>
          <div className="text-gray-500 text-xs">
            {data.inventory.itemsTracked} ingredients tracked
          </div>
        </div>

        {/* Current Stock */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">ready to ship</div>
          <div className="text-3xl font-bold mb-1">
            {data.production.currentInventory.peanutButter + 
             data.production.currentInventory.hotMilk}
          </div>
          <div className="text-gray-500 text-xs">
            {data.production.currentInventory.peanutButter} PB • {data.production.currentInventory.hotMilk} HM
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6">milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Milestones */}
          <div>
            <div className="text-sm text-gray-400 mb-3">in progress ({activeMilestones.length})</div>
            <div className="space-y-2">
              {activeMilestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded border-2 border-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm">{milestone.text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {milestone.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Milestones */}
          <div>
            <div className="text-sm text-gray-400 mb-3">
              completed ({completedMilestones.length})
            </div>
            <div className="space-y-2">
              {completedMilestones.slice(0, 5).map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-4 opacity-60"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-[#14591D] flex-shrink-0 mt-0.5 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm line-through">{milestone.text}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {milestone.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      {lowStockItems.length > 0 && (
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold mb-6 text-yellow-500">
            ⚠️ low stock alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item.name}
                className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4"
              >
                <div className="text-sm font-medium mb-1">{item.name}</div>
                <div className="text-xs text-gray-400">
                  {item.stock} {item.unit} remaining
                </div>
                <div className="text-xs text-yellow-500 mt-2">
                  ${item.total_value.toFixed(2)} value
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Inventory Table */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">full inventory</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">ingredient</th>
                  <th className="px-4 py-3 text-right">stock</th>
                  <th className="px-4 py-3 text-right">cost/unit</th>
                  <th className="px-4 py-3 text-right">total value</th>
                  <th className="px-4 py-3 text-center">status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {inventory
                  .sort((a, b) => b.total_value - a.total_value)
                  .map((item) => (
                    <tr key={item.name} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3 text-right">
                        {item.stock} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${item.cost_per_unit.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        ${item.total_value.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === "OK"
                              ? "bg-green-900/30 text-green-400"
                              : item.status === "LOW"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                          }`}
                        >
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

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
        <p>powered by scout mission control</p>
        <p className="mt-2">
          last updated: {new Date().toLocaleString("en-US", {
            timeZone: "America/Los_Angeles",
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
}
