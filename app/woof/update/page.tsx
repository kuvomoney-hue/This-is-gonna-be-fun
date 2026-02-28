"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InventoryItem {
  ingredient: string;
  stock: number;
  unit: string;
  threshold: number;
  supplier: string;
  cost_per_unit: number;
  status: "ok" | "low" | "out";
}

export default function UpdateInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [adjustAmount, setAdjustAmount] = useState<string>("");
  const [operation, setOperation] = useState<"add" | "subtract" | "set">("set");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/data/inventory.json", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setInventory(data.inventory || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const currentItem = inventory.find((i) => i.ingredient === selectedIngredient);
  const currentStock = currentItem?.stock || 0;
  const unit = currentItem?.unit || "g";

  const calculateNewStock = () => {
    const amount = parseFloat(adjustAmount) || 0;
    if (operation === "add") return currentStock + amount;
    if (operation === "subtract") return currentStock - amount;
    return amount; // set
  };

  const newStock = adjustAmount ? calculateNewStock() : currentStock;

  const handleQuickAdjust = (amount: number) => {
    const newValue = currentStock + amount;
    setAdjustAmount(newValue.toString());
    setOperation("set");
  };

  const handleUpdate = async () => {
    if (!selectedIngredient || !adjustAmount) {
      setMessage({ type: "error", text: "Please select an ingredient and enter an amount" });
      return;
    }

    setUpdating(true);
    setMessage(null);

    // For now, this creates a simple update instruction
    // You'll manually update the sheet or we can add a Discord webhook
    const updateText = `📝 Inventory Update:\n${selectedIngredient}: ${currentStock}${unit} → ${newStock}${unit}`;
    
    // Copy to clipboard for easy pasting
    try {
      await navigator.clipboard.writeText(updateText);
      setMessage({
        type: "success",
        text: `Update copied to clipboard! Paste in Google Sheets or send to Scout.`,
      });
      
      // Reset form
      setAdjustAmount("");
      setOperation("set");
    } catch (error) {
      setMessage({
        type: "success",
        text: updateText,
      });
    }

    setUpdating(false);
  };

  const quickAmounts = [-1000, -500, -100, 100, 500, 1000];

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/woof"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              Quick Update
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Adjust inventory levels on the go
            </p>
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div
            className={`p-4 rounded-xl border ${
              message.type === "success"
                ? "bg-primary-bright/10 border-primary-bright/30 text-primary-bright"
                : "bg-error/10 border-error/30 text-error"
            }`}
          >
            <p className="text-sm font-medium whitespace-pre-wrap">{message.text}</p>
          </div>
        )}

        {/* Main Update Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6">
          
          {/* Ingredient Selector */}
          <div>
            <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
              Ingredient
            </label>
            <select
              value={selectedIngredient}
              onChange={(e) => {
                setSelectedIngredient(e.target.value);
                setAdjustAmount("");
                setOperation("set");
                setMessage(null);
              }}
              className="w-full bg-surface2 border border-border rounded-xl px-4 py-3 text-text-primary font-medium focus:border-primary-bright focus:outline-none"
              disabled={loading}
            >
              <option value="">Select ingredient...</option>
              {inventory
                .sort((a, b) => a.ingredient.localeCompare(b.ingredient))
                .map((item) => (
                  <option key={item.ingredient} value={item.ingredient}>
                    {item.ingredient} ({item.stock}{item.unit})
                  </option>
                ))}
            </select>
          </div>

          {/* Current Stock Display */}
          {currentItem && (
            <div className="bg-surface2 rounded-xl p-4 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Current Stock</span>
                <span
                  className={`text-2xl font-mono font-bold ${
                    currentItem.status === "ok"
                      ? "text-primary-bright"
                      : currentItem.status === "low"
                      ? "text-wow-amber"
                      : "text-error"
                  }`}
                >
                  {currentStock.toLocaleString()}
                  {unit}
                </span>
              </div>
              <div className="text-xs text-text-secondary">
                Reorder at: {currentItem.threshold}
                {unit} · {currentItem.supplier}
              </div>
            </div>
          )}

          {/* Quick Adjust Buttons */}
          {currentItem && (
            <div>
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
                Quick Adjust
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAdjust(amount)}
                    className={`px-4 py-3 rounded-xl font-mono font-bold transition-all border ${
                      amount < 0
                        ? "bg-error/10 border-error/30 text-error hover:bg-error/20"
                        : "bg-primary-bright/10 border-primary-bright/30 text-primary-bright hover:bg-primary-bright/20"
                    }`}
                  >
                    {amount > 0 ? "+" : ""}
                    {amount}
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Input */}
          {currentItem && (
            <div>
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
                Or Set Manually
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="flex-1 bg-surface2 border border-border rounded-xl px-4 py-3 text-text-primary font-mono text-lg focus:border-primary-bright focus:outline-none"
                />
                <div className="bg-surface2 border border-border rounded-xl px-4 py-3 text-text-secondary font-mono text-lg">
                  {unit}
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {currentItem && adjustAmount && (
            <div className="bg-wow-navy/20 border border-wow-navy/40 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">After Update</span>
                <span className="text-2xl font-mono font-bold text-wow-cream">
                  {newStock.toLocaleString()}
                  {unit}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
                <span className="font-mono">{currentStock}</span>
                <span>→</span>
                <span className="font-mono font-bold text-text-primary">{newStock}</span>
                <span>
                  (
                  {newStock > currentStock ? "+" : ""}
                  {(newStock - currentStock).toLocaleString()}
                  {unit})
                </span>
              </div>
            </div>
          )}

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={!selectedIngredient || !adjustAmount || updating}
            className="w-full bg-primary-bright hover:bg-primary-bright/90 disabled:bg-surface2 disabled:text-text-secondary text-bg font-bold py-4 rounded-xl transition-all disabled:cursor-not-allowed"
          >
            {updating ? "Processing..." : "Copy Update"}
          </button>

          <p className="text-xs text-text-secondary text-center">
            This will copy the update to your clipboard. Paste it in Google Sheets or send to Scout
            to apply the change.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
            How It Works
          </h3>
          <ol className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span className="text-primary-bright font-bold">1.</span>
              <span>Select ingredient and adjust amount</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-bright font-bold">2.</span>
              <span>Click "Copy Update" to copy the change</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary-bright font-bold">3.</span>
              <span>
                Paste in{" "}
                <a
                  href="https://docs.google.com/spreadsheets/d/11SgIzbobjs7u6RFeN-mJYrfqYOQJHPY8ab6S13pFXxo/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-bright hover:underline"
                >
                  Google Sheets
                </a>{" "}
                or send to Scout in Discord
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
