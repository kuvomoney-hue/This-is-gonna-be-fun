"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface WoofData {
  status: string;
  milestones: {
    rdComplete: boolean;
    labelsSubmitted: boolean;
    kitchenOnboarding: boolean;
    inventionInProgress: boolean;
    labelApproval: boolean;
    launched: boolean;
  };
  inventory: {
    peanutButter: {
      capacity: number;
      inProduction: boolean;
      firstBatch: number;
      sold: number;
    };
    hotMilk: {
      capacity: number;
      inProduction: boolean;
      firstBatch: number;
      flavors: number;
      perFlavor: number;
      sold: number;
    };
  };
  social: {
    instagramFollowers: number;
    instagramHandle: string;
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
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-xl text-amber-900">loading wayofwoof...</div>
      </div>
    );
  }

  const lowStockItems = inventory.filter((i) => i.status === "low" || i.status === "out");

  return (
    <div className="min-h-screen bg-amber-50 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-amber-900 mb-2">wayofwoof</h1>
        <p className="text-amber-700">premium dog wellness · handcrafted with love</p>
      </div>

      {/* Production Status */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-amber-200 rounded-lg p-6">
          <div className="text-sm text-amber-700 mb-2">peanut butter</div>
          <div className="text-3xl font-bold text-amber-900">
            {data?.inventory.peanutButter.firstBatch || 0}
          </div>
          <div className="text-sm text-amber-600 mt-1">jars produced</div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-6">
          <div className="text-sm text-amber-700 mb-2">hot milk collection</div>
          <div className="text-3xl font-bold text-amber-900">
            {data?.inventory.hotMilk.firstBatch || 0}
          </div>
          <div className="text-sm text-amber-600 mt-1">
            {data?.inventory.hotMilk.flavors || 5} flavors · {data?.inventory.hotMilk.perFlavor || 20} each
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-lg p-6">
          <div className="text-sm text-amber-700 mb-2">instagram</div>
          <div className="text-3xl font-bold text-amber-900">
            {data?.social.instagramFollowers.toLocaleString() || "0"}
          </div>
          <div className="text-sm text-amber-600 mt-1">{data?.social.instagramHandle || "@wayofwoof"}</div>
        </div>
      </div>

      {/* Inventory Alerts */}
      {lowStockItems.length > 0 && (
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="font-semibold text-red-900 mb-3">inventory alerts ({lowStockItems.length})</div>
            <div className="space-y-2">
              {lowStockItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{item.ingredient}</span>
                  <span className="text-red-900 font-mono">
                    {item.stock} {item.unit} (threshold: {item.threshold})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">ingredient inventory</h2>
        <div className="bg-white border border-amber-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-100">
              <tr>
                <th className="text-left p-4 text-sm text-amber-900 font-semibold">ingredient</th>
                <th className="text-right p-4 text-sm text-amber-900 font-semibold">stock</th>
                <th className="text-right p-4 text-sm text-amber-900 font-semibold">status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-amber-600">
                    no inventory data
                  </td>
                </tr>
              ) : (
                inventory.map((item, idx) => (
                  <tr key={idx} className="border-t border-amber-100">
                    <td className="p-4 text-amber-900">{item.ingredient}</td>
                    <td className="p-4 text-right font-mono text-amber-900">
                      {item.stock} {item.unit}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status === "ok"
                            ? "bg-green-100 text-green-800"
                            : item.status === "low"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
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

      {/* Milestones */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-4">milestones</h2>
        <div className="bg-white border border-amber-200 rounded-lg p-6">
          <div className="space-y-3">
            {data && Object.entries(data.milestones).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    value
                      ? "bg-amber-500 border-amber-500"
                      : "border-amber-300"
                  }`}
                >
                  {value && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="text-amber-900">
                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto pt-6 border-t border-amber-200 flex items-center justify-between text-sm text-amber-700">
        <div>status: {data?.status || "pre-launch"}</div>
        <Link href="/" className="hover:text-amber-900">
          ← mission control
        </Link>
      </div>
    </div>
  );
}
