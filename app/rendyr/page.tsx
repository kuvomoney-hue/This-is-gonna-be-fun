"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────
interface RendyrData {
  skoolMembers: number;
  instagramFollowers: number;
  bundleSalesThisMonth: number;
  bundleSalesAllTimeBest: number;
  mrr: number;
  paywalled: boolean;
  academyProgress: {
    world1: { complete: number; total: number };
    world2: { complete: number; total: number };
    world3: { complete: number; total: number };
    world4: { complete: number; total: number | null };
  };
  lastUpdated: string;
}

const DEFAULTS: RendyrData = {
  skoolMembers: 698,
  instagramFollowers: 12500,
  bundleSalesThisMonth: 15,
  bundleSalesAllTimeBest: 16,
  mrr: 0,
  paywalled: false,
  academyProgress: {
    world1: { complete: 13, total: 20 },
    world2: { complete: 0, total: 10 },
    world3: { complete: 0, total: 18 },
    world4: { complete: 0, total: null },
  },
  lastUpdated: "2026-02-18",
};

const EMAIL_DRIP_KEY = "rendyr_email_drip";
const emails = [
  { day: 0,  label: "Day 0 — Welcome + Bundle confirmation" },
  { day: 1,  label: "Day 1 — Your first edit (quick win)" },
  { day: 3,  label: "Day 3 — Behind the scene workflow" },
  { day: 5,  label: "Day 5 — Academy tease" },
  { day: 7,  label: "Day 7 — Social proof + results" },
  { day: 10, label: "Day 10 — Objection handling" },
  { day: 14, label: "Day 14 — Case study or transformation" },
  { day: 21, label: "Day 21 — Academy hard offer" },
];

export default function RendyrPage() {
  const [data, setData] = useState<RendyrData>(DEFAULTS);
  const [emailDripBuilt, setEmailDripBuilt] = useState(false);
  const [emailChecks, setEmailChecks] = useState<boolean[]>(Array(emails.length).fill(false));
  // HeyGen bounty closed — won $3K (Feb 2026)

  useEffect(() => {
    fetch("/data/rendyr.json", { cache: "no-store" })
      .then(r => r.json()).then(setData).catch(() => {});

    try {
      const stored = localStorage.getItem(EMAIL_DRIP_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEmailDripBuilt(parsed.built ?? false);
        setEmailChecks(parsed.checks ?? Array(emails.length).fill(false));
      }
    } catch {}

  }, []);

  const saveEmailDrip = (built: boolean, checks: boolean[]) => {
    try {
      localStorage.setItem(EMAIL_DRIP_KEY, JSON.stringify({ built, checks }));
    } catch {}
  };

  const toggleEmailCheck = (idx: number) => {
    const next = emailChecks.map((c, i) => i === idx ? !c : c);
    const built = next.every(Boolean);
    setEmailChecks(next);
    setEmailDripBuilt(built);
    saveEmailDrip(built, next);
  };

  const funnelStages = [
    { label: "Paid Ads", sublabel: "Meta / IG", icon: "📢", metric: "~$37 CPM" },
    { label: "rendyr.video", sublabel: "$37.99 bundle", icon: "🎬", metric: `${data.bundleSalesThisMonth} sales/mo` },
    { label: "Email Drip", sublabel: "21-day sequence", icon: "📧", metric: "8 emails" },
    { label: "Academy", sublabel: "$47–97/mo", icon: "🎓", metric: `$${data.mrr} MRR` },
  ];

  const worlds = [
    { name: "World 1", data: data.academyProgress.world1, color: "bg-primary-bright" },
    { name: "World 2", data: data.academyProgress.world2, color: "bg-primary-bright/60" },
    { name: "World 3", data: data.academyProgress.world3, color: "bg-primary-bright/40" },
    { name: "World 4", data: data.academyProgress.world4, color: "bg-primary-bright/20" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
          rendyr
        </h1>
        <p className="text-text-secondary mt-1 text-sm">tools · education · community</p>
        <p className="text-text-secondary/50 text-xs mt-0.5">Updated {data.lastUpdated}</p>
      </div>

      {/* ── Stats Row ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Bundle Sales */}
        <div className="bg-surface border border-primary-bright/20 rounded-xl p-4 shadow-glow-green">
          <div className="text-2xl mb-2">🎬</div>
          <p className="text-3xl font-mono font-bold text-primary-bright">{data.bundleSalesThisMonth}</p>
          <p className="text-text-primary text-sm font-medium mt-0.5">Bundle Sales</p>
          <p className="text-text-secondary text-xs mt-1">
            All-time best: {data.bundleSalesAllTimeBest}
          </p>
        </div>

        {/* Skool Members */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl mb-2">👥</div>
          <p className="text-3xl font-mono font-bold text-text-primary">{data.skoolMembers.toLocaleString()}</p>
          <p className="text-text-primary text-sm font-medium mt-0.5">Skool Members</p>
          <p className="text-text-secondary text-xs mt-1">Free tier</p>
        </div>

        {/* Instagram */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl mb-2">📸</div>
          <p className="text-3xl font-mono font-bold text-text-primary">
            {(data.instagramFollowers / 1000).toFixed(1)}K
          </p>
          <p className="text-text-primary text-sm font-medium mt-0.5">Instagram</p>
          <p className="text-text-secondary text-xs mt-1">followers</p>
        </div>

        {/* MRR */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-3xl font-mono font-bold text-text-primary">${data.mrr}</p>
          <p className="text-text-primary text-sm font-medium mt-0.5">MRR</p>
          {data.skoolMembers > 500 ? (
            <span className="inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-primary-bright/20 text-primary-bright border border-primary-bright/30 mt-1">
              Paywall Ready ✓
            </span>
          ) : (
            <p className="text-text-secondary text-xs mt-1">pre-paywall</p>
          )}
        </div>
      </div>

      {/* ── Funnel ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">
          🔀 Funnel Pipeline
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {funnelStages.map((stage, i) => (
            <div key={stage.label} className="relative">
              <div className="bg-surface border border-border rounded-xl p-4 h-full">
                <div className="text-xl mb-2">{stage.icon}</div>
                <p className="text-text-primary font-bold text-sm">{stage.label}</p>
                <p className="text-text-secondary text-xs mt-0.5">{stage.sublabel}</p>
                <p className="text-primary-bright font-mono text-sm font-bold mt-2">{stage.metric}</p>
              </div>
              {i < funnelStages.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center">
                  <span className="text-primary-bright text-lg">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Academy + Email Drip Row ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Academy Progress */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider mb-4">
            🎓 Academy Progress
          </h2>
          <div className="space-y-4">
            {worlds.map((world) => {
              const total = world.data.total ?? "TBD";
              const complete = world.data.complete;
              const pct = typeof total === "number" && total > 0
                ? Math.round((complete / total) * 100) : 0;
              return (
                <div key={world.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text-primary font-medium">{world.name}</span>
                    <span className="text-xs font-mono text-text-secondary">
                      {complete}/{total === null ? "TBD" : total}
                      {typeof total === "number" && ` (${pct}%)`}
                    </span>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${world.color} rounded-full transition-all`}
                      style={{ width: typeof total === "number" ? `${pct}%` : "0%" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email Drip */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">
              📧 Email Drip — 21-Day Sequence
            </h2>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
              emailDripBuilt
                ? "bg-primary/20 text-primary-bright border-primary-bright/30"
                : "bg-danger/10 text-danger border-danger/30"
            }`}>
              {emailDripBuilt ? "✓ Built" : "Not Built"}
            </span>
          </div>
          <div className="space-y-2">
            {emails.map((email, idx) => (
              <button
                key={idx}
                onClick={() => toggleEmailCheck(idx)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface2 transition-colors text-left"
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                  emailChecks[idx]
                    ? "bg-primary-bright border-primary-bright"
                    : "border-border"
                }`}>
                  {emailChecks[idx] && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                <span className={`text-xs flex-1 ${emailChecks[idx] ? "line-through text-text-secondary" : "text-text-primary"}`}>
                  {email.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── HeyGen Win ───────────────────────────────────────── */}
      <div className="bg-surface border border-primary-bright/20 rounded-xl p-5 flex items-center gap-4">
        <div className="text-3xl">🏆</div>
        <div>
          <p className="text-text-primary font-bold text-sm">HeyGen Bounty — Won</p>
          <p className="text-text-secondary text-xs mt-0.5">$3,000 closed early · going into Rendyr bank this weekend</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-mono font-bold text-primary-bright">$3K</p>
          <p className="text-text-secondary text-xs">✓ closed</p>
        </div>
      </div>

    </div>
  );
}
