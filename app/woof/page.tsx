"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────
interface WoofData {
  status: string;
  milestones: {
    rdComplete: boolean;
    labelsSubmitted: boolean;
    kitchenOnboarding: boolean;
    labelApproval: boolean;
    launched: boolean;
  };
}

const DEFAULTS: WoofData = {
  status: "pre-launch",
  milestones: {
    rdComplete: true,
    labelsSubmitted: true,
    kitchenOnboarding: false,
    labelApproval: false,
    launched: false,
  },
};

const CHECKLIST_KEY = "woof_launch_checklist";

const checklistItems = [
  "Omnisend email popup installed",
  "Bundles created in Shopify",
  "Discount codes set up (LAUNCH15, EARLYACCESS20, SIMBA20)",
  "Welcome email drafted",
  "Abandoned cart set up",
  "10 pieces of content filmed",
  "Launch date set",
  "Business cards + QR codes ordered",
  "Pricing finalized",
  "Commercial kitchen onboarded",
  "Label approval received",
];

const milestoneList = [
  { key: "rdComplete",        label: "R&D Complete",       icon: "✅", inProgress: false },
  { key: "labelsSubmitted",   label: "Labels Submitted",   icon: "✅", inProgress: false },
  { key: "kitchenOnboarding", label: "Kitchen Onboarding", icon: "🔄", inProgress: true  },
  { key: "labelApproval",     label: "Label Approval",     icon: "🔄", inProgress: true  },
  { key: "launched",          label: "LAUNCH",             icon: "⬜", inProgress: false },
];

const contentPillars = [
  { label: "Ritual",    pct: 30, color: "bg-wow-purple" },
  { label: "Education", pct: 25, color: "bg-wow-navy" },
  { label: "BTS",       pct: 20, color: "bg-wow-amber" },
  { label: "Community", pct: 15, color: "bg-wow-purple-dim" },
  { label: "Product",   pct: 10, color: "bg-wow-navy-dim" },
];

const pbIngredients = ["Peanut Butter (Dry Roasted)", "Oat Flour", "Flaxseed", "Coconut Oil", "Honey (trace)"];
const hmFlavors = [
  { name: "Classic Milk",     color: "bg-gray-200" },
  { name: "Pumpkin Spice",    color: "bg-orange-400" },
  { name: "Blueberry",        color: "bg-blue-500" },
  { name: "Banana",           color: "bg-yellow-400" },
  { name: "Sweet Potato",     color: "bg-orange-600" },
];

export default function WoofPage() {
  const [data, setData] = useState<WoofData>(DEFAULTS);
  const [checklist, setChecklist] = useState<boolean[]>(Array(checklistItems.length).fill(false));

  useEffect(() => {
    fetch("/data/woof.json", { cache: "no-store" })
      .then(r => r.json()).then(setData).catch(() => {});

    try {
      const stored = localStorage.getItem(CHECKLIST_KEY);
      if (stored) setChecklist(JSON.parse(stored));
    } catch {}
  }, []);

  const toggleChecklist = (idx: number) => {
    const next = checklist.map((c, i) => i === idx ? !c : c);
    setChecklist(next);
    try { localStorage.setItem(CHECKLIST_KEY, JSON.stringify(next)); } catch {}
  };

  const milestonesDone = milestoneList.filter(m =>
    data.milestones[m.key as keyof typeof data.milestones]
  ).length;
  const milestonePct = Math.round((milestonesDone / milestoneList.length) * 100);
  const checklistDone = checklist.filter(Boolean).length;

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          way of woof
        </h1>
        <p className="text-text-secondary mt-1 text-sm">the new generation dog wellness house</p>
      </div>

      {/* ── Launch Status Card (full width) ─────────────────── */}
      <div className="bg-surface border border-wow-navy/50 rounded-2xl p-6 shadow-glow-navy">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-wow-amber border border-wow-amber/40 rounded-full px-3 py-1 bg-wow-amber/10 mb-2">
              PRE-LAUNCH
            </span>
            <h2 className="text-2xl font-bold text-text-primary">Launch Status</h2>
          </div>
          <div className="text-right">
            <p className="text-4xl font-mono font-bold text-wow-amber">{milestonePct}%</p>
            <p className="text-text-secondary text-xs">{milestonesDone} of {milestoneList.length} milestones</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-surface2 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-wow-amber rounded-full transition-all duration-500"
            style={{ width: `${milestonePct}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {milestoneList.map((m, i) => {
            const done = data.milestones[m.key as keyof typeof data.milestones];
            return (
              <div
                key={m.key}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                  done
                    ? "bg-wow-navy/20 border-wow-navy/50"
                    : m.inProgress
                    ? "bg-wow-amber/5 border-wow-amber/30"
                    : "bg-surface2 border-border"
                }`}
              >
                <span className="text-xl">{m.icon}</span>
                <span className={`text-xs font-medium leading-tight ${
                  done ? "text-wow-cream" : m.inProgress ? "text-wow-amber" : "text-text-secondary"
                }`}>
                  {m.label}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  done
                    ? "bg-primary-bright/20 text-primary-bright"
                    : m.inProgress
                    ? "bg-wow-amber/20 text-wow-amber"
                    : "bg-surface text-text-secondary"
                }`}>
                  {done ? "Done" : m.inProgress ? "In Progress" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Products Grid ────────────────────────────────────── */}
      <div>
        <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">🐶 Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Peanut Butter */}
          <div className="bg-surface border border-wow-purple/20 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-text-primary font-bold text-lg">🥜 Peanut Butter</h3>
                <p className="text-text-secondary text-xs mt-0.5">Classic dog wellness treat</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-wow-cream">$26</p>
                <p className="text-text-secondary text-xs">per unit</p>
              </div>
            </div>

            <div className="bg-surface2 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Capacity</span>
                <span className="text-xs font-mono text-wow-amber">280 units</span>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-wow-amber/40 rounded-full" style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-text-secondary mt-1">0 sold</p>
            </div>

            <div>
              <p className="text-xs text-text-secondary font-medium mb-2">Ingredients</p>
              <div className="flex flex-wrap gap-1.5">
                {pbIngredients.map(ing => (
                  <span key={ing} className="text-xs px-2 py-0.5 rounded-full bg-surface2 text-text-secondary border border-border">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hot Milk Collection */}
          <div className="bg-surface border border-wow-purple/20 rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-text-primary font-bold text-lg">🥛 Hot Milk Collection</h3>
                <p className="text-text-secondary text-xs mt-0.5">5 seasonal flavors</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-mono font-bold text-wow-cream">$30</p>
                <p className="text-text-secondary text-xs">per flavor</p>
              </div>
            </div>

            <div className="bg-surface2 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text-secondary">Capacity</span>
                <span className="text-xs font-mono text-wow-amber">500 units</span>
              </div>
              <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                <div className="h-full bg-wow-amber/40 rounded-full" style={{ width: "0%" }} />
              </div>
              <p className="text-xs text-text-secondary mt-1">0 sold</p>
            </div>

            <div>
              <p className="text-xs text-text-secondary font-medium mb-2">Flavors</p>
              <div className="space-y-1.5">
                {hmFlavors.map(f => (
                  <div key={f.name} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${f.color}`} />
                    <span className="text-xs text-text-primary">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bundle Pricing ───────────────────────────────────── */}
      <div>
        <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">📦 Bundle Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Trio Sampler",        price: 78,  desc: "3 products · Best for trying",     highlight: false },
            { name: "Starter Kit",         price: 74,  desc: "Save $8 · Most popular",           highlight: true  },
            { name: "Complete Collection", price: 172, desc: "Everything · Best value",           highlight: false },
          ].map(bundle => (
            <div
              key={bundle.name}
              className={`rounded-xl p-5 border text-center transition-all ${
                bundle.highlight
                  ? "bg-wow-navy border-wow-navy shadow-glow-navy"
                  : "bg-surface border-border"
              }`}
            >
              {bundle.highlight && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-wow-cream bg-wow-purple/30 border border-wow-purple/40 rounded-full px-2 py-0.5 mb-2">
                  Most Popular
                </span>
              )}
              <p className={`text-4xl font-mono font-bold mb-1 ${bundle.highlight ? "text-wow-cream" : "text-text-primary"}`}>
                ${bundle.price}
              </p>
              <p className={`font-bold text-sm mb-1 ${bundle.highlight ? "text-wow-cream" : "text-text-primary"}`}>
                {bundle.name}
              </p>
              <p className={`text-xs ${bundle.highlight ? "text-wow-cream/70" : "text-text-secondary"}`}>
                {bundle.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Launch Checklist + Content Pillars ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Launch Checklist */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">
              🚀 Launch Checklist
            </h2>
            <span className="text-xs font-mono text-wow-amber">
              {checklistDone}/{checklistItems.length}
            </span>
          </div>

          {/* Progress */}
          <div className="h-1.5 bg-surface2 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-wow-amber rounded-full transition-all"
              style={{ width: `${Math.round((checklistDone / checklistItems.length) * 100)}%` }}
            />
          </div>

          <div className="space-y-2">
            {checklistItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => toggleChecklist(idx)}
                className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-surface2 transition-colors text-left"
              >
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  checklist[idx]
                    ? "bg-primary-bright border-primary-bright"
                    : "border-border hover:border-wow-amber"
                }`}>
                  {checklist[idx] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className={`text-sm flex-1 ${checklist[idx] ? "line-through text-text-secondary" : "text-text-primary"}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Pillars */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">
            📣 Content Pillars
          </h2>
          <div className="space-y-3">
            {contentPillars.map(pillar => (
              <div key={pillar.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-text-primary">{pillar.label}</span>
                  <span className="text-xs font-mono text-text-secondary">{pillar.pct}%</span>
                </div>
                <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pillar.color} rounded-full`}
                    style={{ width: `${pillar.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Discount codes */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Discount Codes</p>
            <div className="space-y-2">
              {[
                { code: "LAUNCH15",      desc: "Launch — 15% off" },
                { code: "EARLYACCESS20", desc: "Early access — 20%" },
                { code: "SIMBA20",       desc: "Influencer — 20%" },
              ].map(c => (
                <div key={c.code} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-wow-amber bg-wow-amber/10 px-2 py-0.5 rounded border border-wow-amber/20">
                    {c.code}
                  </span>
                  <span className="text-xs text-text-secondary">{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
