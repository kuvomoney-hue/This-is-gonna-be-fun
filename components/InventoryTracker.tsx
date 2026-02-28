"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────
interface InventoryItem {
  ingredient: string;
  stock: number;
  unit: string;
  threshold: number;
  supplier: string;
  cost_per_unit: number;
  status: "ok" | "low" | "out";
}

interface Product {
  name: string;
  batch_size: number;
  unit_cost: number;
  active: boolean;
}

interface Batch {
  id: string;
  date: string;
  product: string;
  quantity: number;
  notes: string;
  by: string;
  cost: number;
}

interface InventoryData {
  inventory: InventoryItem[];
  products: Product[];
  batches: Batch[];
  alerts: string[];
  _updated?: string;
}

const DEFAULTS: InventoryData = {
  inventory: [],
  products: [],
  batches: [],
  alerts: [],
};

export default function InventoryTracker() {
  const [data, setData] = useState<InventoryData>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/inventory.json", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const okCount = data.inventory.filter(i => i.status === "ok").length;
  const lowCount = data.inventory.filter(i => i.status === "low").length;
  const outCount = data.inventory.filter(i => i.status === "out").length;

  return (
    <div className="space-y-6">
      
      {/* ── Header + Quick Stats ─────────────────────────────── */}
      <div>
        <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">
          📦 Inventory Tracker
        </h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-surface border border-primary-bright/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-mono font-bold text-primary-bright">{okCount}</p>
            <p className="text-xs text-text-secondary mt-1">In Stock</p>
          </div>
          <div className="bg-surface border border-wow-amber/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-mono font-bold text-wow-amber">{lowCount}</p>
            <p className="text-xs text-text-secondary mt-1">Low Stock</p>
          </div>
          <div className="bg-surface border border-error/30 rounded-xl p-4 text-center">
            <p className="text-3xl font-mono font-bold text-error">{outCount}</p>
            <p className="text-xs text-text-secondary mt-1">Out of Stock</p>
          </div>
        </div>

        {/* Alerts */}
        {data.alerts.length > 0 && (
          <div className="bg-wow-amber/10 border border-wow-amber/30 rounded-xl p-4">
            <p className="text-xs font-bold text-wow-amber uppercase tracking-wider mb-2">⚠️ Alerts</p>
            <div className="space-y-1">
              {data.alerts.map((alert, idx) => (
                <p key={idx} className="text-sm text-text-primary">{alert}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Inventory Table ────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface2 border-b border-border">
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-text-secondary px-4 py-3">
                  Ingredient
                </th>
                <th className="text-right text-xs font-bold uppercase tracking-wider text-text-secondary px-4 py-3">
                  Stock
                </th>
                <th className="text-center text-xs font-bold uppercase tracking-wider text-text-secondary px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-text-secondary px-4 py-3">
                  Supplier
                </th>
                <th className="text-right text-xs font-bold uppercase tracking-wider text-text-secondary px-4 py-3">
                  Cost/Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-secondary text-sm">
                    Loading inventory...
                  </td>
                </tr>
              ) : data.inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-text-secondary text-sm">
                    No inventory data. Set up Google Sheets sync first.
                  </td>
                </tr>
              ) : (
                data.inventory.map((item, idx) => {
                  const stockPct = Math.min((item.stock / item.threshold) * 100, 100);
                  const statusColor =
                    item.status === "ok"
                      ? "bg-primary-bright/20 text-primary-bright border-primary-bright/40"
                      : item.status === "low"
                      ? "bg-wow-amber/20 text-wow-amber border-wow-amber/40"
                      : "bg-error/20 text-error border-error/40";
                  
                  return (
                    <tr key={idx} className="border-b border-border hover:bg-surface2 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-text-primary">{item.ingredient}</p>
                        <div className="mt-1 h-1 w-full bg-bg rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              item.status === "ok"
                                ? "bg-primary-bright"
                                : item.status === "low"
                                ? "bg-wow-amber"
                                : "bg-error"
                            }`}
                            style={{ width: `${stockPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-mono text-text-primary">
                          {item.stock.toLocaleString()}{item.unit}
                        </p>
                        <p className="text-xs text-text-secondary">
                          / {item.threshold.toLocaleString()}{item.unit}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block text-xs font-bold px-2 py-1 rounded-full border ${statusColor}`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-text-secondary">{item.supplier}</p>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-sm font-mono text-text-primary">
                          ${item.cost_per_unit.toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Recent Batches ───────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl p-5">
        <h3 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">
          🏭 Recent Batches
        </h3>
        
        {data.batches.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-4">No batches logged yet</p>
        ) : (
          <div className="space-y-3">
            {data.batches.slice(-10).reverse().map((batch) => (
              <div
                key={batch.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-surface2 border border-border hover:border-wow-navy/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-text-primary">{batch.product}</span>
                    <span className="text-xs font-mono text-text-secondary">×{batch.quantity}</span>
                  </div>
                  <p className="text-xs text-text-secondary">{batch.date} · by {batch.by}</p>
                  {batch.notes && (
                    <p className="text-xs text-text-secondary mt-1 italic">{batch.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-bold text-wow-amber">
                    ${batch.cost.toFixed(2)}
                  </p>
                  <p className="text-xs text-text-secondary">{batch.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Products Overview ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.products.filter(p => p.active).map((product) => (
          <div
            key={product.name}
            className="bg-surface border border-wow-purple/20 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-text-primary">{product.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-bright/20 text-primary-bright border border-primary-bright/40">
                Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div>
                <p className="text-xs text-text-secondary">Batch Size</p>
                <p className="text-sm font-mono text-text-primary">{product.batch_size} units</p>
              </div>
              <div>
                <p className="text-xs text-text-secondary">Cost/Unit</p>
                <p className="text-sm font-mono text-wow-amber">${product.unit_cost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer Timestamp ─────────────────────────────────── */}
      {data._updated && (
        <p className="text-xs text-text-secondary text-center">
          Last synced: {new Date(data._updated).toLocaleString()}
        </p>
      )}
    </div>
  );
}
