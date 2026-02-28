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

export default function InventoryTrackerV2() {
  const [data, setData] = useState<InventoryData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "ok" | "low" | "out">("all");
  
  // Modals
  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [showLogBatch, setShowLogBatch] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<InventoryItem | null>(null);
  
  // Form states
  const [updateAmount, setUpdateAmount] = useState("");
  const [batchProduct, setBatchProduct] = useState("");
  const [batchQuantity, setBatchQuantity] = useState("");
  const [batchNotes, setBatchNotes] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    fetch("/data/inventory.json", { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const okCount = data.inventory.filter(i => i.status === "ok").length;
  const lowCount = data.inventory.filter(i => i.status === "low").length;
  const outCount = data.inventory.filter(i => i.status === "out").length;

  // Filter inventory
  const filteredInventory = data.inventory.filter(item => {
    const matchesSearch = item.ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Open update stock modal
  const openUpdateStock = (item: InventoryItem) => {
    setSelectedIngredient(item);
    setUpdateAmount(item.stock.toString());
    setShowUpdateStock(true);
  };

  // Handle stock update (writes to Google Sheet via API)
  const handleUpdateStock = async () => {
    if (!selectedIngredient) return;
    
    const newStock = parseFloat(updateAmount);
    if (isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid number");
      return;
    }

    try {
      const response = await fetch("/api/inventory/update-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient: selectedIngredient.ingredient,
          stock: newStock,
        }),
      });

      if (response.ok) {
        alert(`✅ ${selectedIngredient.ingredient} updated to ${newStock}${selectedIngredient.unit}`);
        setShowUpdateStock(false);
        loadData(); // Reload data
      } else {
        alert("❌ Failed to update stock. Try editing the Google Sheet directly.");
      }
    } catch (error) {
      alert("❌ Error updating stock. Try editing the Google Sheet directly.");
    }
  };

  // Handle batch logging (writes to Google Sheet via API)
  const handleLogBatch = async () => {
    if (!batchProduct || !batchQuantity) {
      alert("Please fill in product and quantity");
      return;
    }

    const quantity = parseInt(batchQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    try {
      const response = await fetch("/api/inventory/log-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: batchProduct,
          quantity,
          notes: batchNotes,
          by: "Big Papa", // Could make this editable
        }),
      });

      if (response.ok) {
        alert(`✅ Batch logged: ${quantity} units of ${batchProduct}`);
        setShowLogBatch(false);
        setBatchProduct("");
        setBatchQuantity("");
        setBatchNotes("");
        loadData(); // Reload data
      } else {
        alert("❌ Failed to log batch. Try editing the Google Sheet directly.");
      }
    } catch (error) {
      alert("❌ Error logging batch. Try editing the Google Sheet directly.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ── Header + Actions ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">
          📦 Inventory Tracker
        </h2>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface2 transition-colors"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => setShowLogBatch(true)}
            className="px-4 py-2 bg-wow-amber text-bg font-bold rounded-lg text-sm hover:bg-wow-amber/90 transition-colors"
          >
            + Log Batch
          </button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search ingredients or suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-secondary focus:border-primary-bright focus:outline-none"
        />
        <div className="flex gap-2">
          {["all", "ok", "low", "out"].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === filter
                  ? "bg-primary-bright text-bg"
                  : "bg-surface border border-border text-text-secondary hover:bg-surface2"
              }`}
            >
              {filter === "all" ? "All" : filter.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── Inventory Cards (Mobile-Friendly) ──────────────────── */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            Loading inventory...
          </div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            {searchTerm || filterStatus !== "all" 
              ? "No ingredients match your filters"
              : "No inventory data. Set up Google Sheets sync first."}
          </div>
        ) : (
          filteredInventory.map((item, idx) => {
            const stockPct = Math.min((item.stock / item.threshold) * 100, 100);
            const statusColor =
              item.status === "ok"
                ? "border-primary-bright/40 bg-primary-bright/10"
                : item.status === "low"
                ? "border-wow-amber/40 bg-wow-amber/10"
                : "border-error/40 bg-error/10";
            
            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 ${statusColor} hover:shadow-lg transition-all`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-1">{item.ingredient}</h3>
                    <p className="text-xs text-text-secondary">{item.supplier}</p>
                  </div>
                  <button
                    onClick={() => openUpdateStock(item)}
                    className="px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-medium text-text-primary hover:bg-surface2 transition-colors shrink-0"
                  >
                    Update
                  </button>
                </div>

                {/* Stock Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                    <span>Stock Level</span>
                    <span className="font-mono">
                      {item.stock.toLocaleString()}{item.unit} / {item.threshold.toLocaleString()}{item.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-bg rounded-full overflow-hidden">
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
                </div>

                {/* Details */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                    item.status === "ok"
                      ? "bg-primary-bright/20 text-primary-bright border-primary-bright/40"
                      : item.status === "low"
                      ? "bg-wow-amber/20 text-wow-amber border-wow-amber/40"
                      : "bg-error/20 text-error border-error/40"
                  }`}>
                    {item.status.toUpperCase()}
                  </span>
                  <span className="text-sm font-mono text-text-primary">
                    ${item.cost_per_unit.toFixed(2)}/1000{item.unit}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Footer Timestamp ─────────────────────────────────── */}
      {data._updated && (
        <p className="text-xs text-text-secondary text-center">
          Last synced: {new Date(data._updated).toLocaleString()}
        </p>
      )}

      {/* ── Update Stock Modal ───────────────────────────────── */}
      {showUpdateStock && selectedIngredient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Update Stock: {selectedIngredient.ingredient}
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                New Stock Amount ({selectedIngredient.unit})
              </label>
              <input
                type="number"
                value={updateAmount}
                onChange={(e) => setUpdateAmount(e.target.value)}
                className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-lg font-mono text-text-primary focus:border-primary-bright focus:outline-none"
                placeholder="0"
              />
              <p className="text-xs text-text-secondary mt-1">
                Threshold: {selectedIngredient.threshold}{selectedIngredient.unit}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpdateStock(false)}
                className="flex-1 px-4 py-2 bg-surface2 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStock}
                className="flex-1 px-4 py-2 bg-primary-bright text-bg font-bold rounded-lg text-sm hover:bg-primary-bright/90 transition-colors"
              >
                Update Stock
              </button>
            </div>

            <p className="text-xs text-text-secondary mt-3 text-center">
              This will update the Google Sheet. Sync happens within 30 min.
            </p>
          </div>
        </div>
      )}

      {/* ── Log Batch Modal ──────────────────────────────────── */}
      {showLogBatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-text-primary mb-4">
              Log Production Batch
            </h3>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Product
                </label>
                <select
                  value={batchProduct}
                  onChange={(e) => setBatchProduct(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-sm text-text-primary focus:border-primary-bright focus:outline-none"
                >
                  <option value="">Select product...</option>
                  {data.products.filter(p => p.active).map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Quantity (units)
                </label>
                <input
                  type="number"
                  value={batchQuantity}
                  onChange={(e) => setBatchQuantity(e.target.value)}
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg text-lg font-mono text-text-primary focus:border-primary-bright focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-sm text-text-primary focus:border-primary-bright focus:outline-none resize-none"
                  rows={2}
                  placeholder="Production notes..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogBatch(false);
                  setBatchProduct("");
                  setBatchQuantity("");
                  setBatchNotes("");
                }}
                className="flex-1 px-4 py-2 bg-surface2 border border-border rounded-lg text-sm font-medium text-text-primary hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogBatch}
                className="flex-1 px-4 py-2 bg-wow-amber text-bg font-bold rounded-lg text-sm hover:bg-wow-amber/90 transition-colors"
              >
                Log Batch
              </button>
            </div>

            <p className="text-xs text-text-secondary mt-3 text-center">
              This will add a row to the Google Sheet Batches tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
