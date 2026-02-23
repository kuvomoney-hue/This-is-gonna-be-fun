"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface DigestItem {
  title: string;
  link: string;
  description: string;
  published: string | null;
  source: string;
  category: string;
  score?: number;
  comments?: number;
}

interface DigestData {
  generated_at: string;
  period_start: string;
  period_end: string;
  total_items: number;
  categories: {
    ai_launches?: DigestItem[];
    camera_gear?: DigestItem[];
    plugins?: DigestItem[];
    industry?: DigestItem[];
    tutorials?: DigestItem[];
  };
}

const CATEGORY_CONFIG = {
  ai_launches: { emoji: "🤖", name: "AI Launches" },
  camera_gear: { emoji: "📷", name: "Camera & Gear" },
  plugins: { emoji: "🔌", name: "Plugins" },
  industry: { emoji: "📰", name: "Industry" },
  tutorials: { emoji: "🎓", name: "Tutorials" },
};

export default function WeeklyDigest({ compact = false }: { compact?: boolean }) {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch("/data/weekly_digest.json", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("No digest available");
        return r.json();
      })
      .then((data) => {
        setDigest(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Weekly digest fetch error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="animate-pulse">
          <div className="h-4 bg-surface2 rounded w-1/3 mb-4"></div>
          <div className="h-3 bg-surface2 rounded w-full mb-2"></div>
          <div className="h-3 bg-surface2 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!digest) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">
            📰 Weekly Digest
          </h2>
        </div>
        <p className="text-text-secondary text-sm">No digest available yet. Run the aggregator!</p>
        <pre className="mt-3 text-xs text-text-secondary bg-surface2 p-2 rounded">
          python3 /Users/koovican/.openclaw/workspace/bot/weekly_digest.py
        </pre>
      </div>
    );
  }

  const totalItems = digest.total_items || 0;
  const categories = Object.entries(digest.categories).filter(([_, items]) => items && items.length > 0);
  
  const generatedDate = new Date(digest.generated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (compact) {
    return (
      <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary-bright/30 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-text-primary font-bold text-sm uppercase tracking-wider">
              📰 Weekly Digest
            </h2>
            <p className="text-text-secondary text-xs mt-0.5">
              {totalItems} items · Generated {generatedDate}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary-bright hover:underline"
          >
            {expanded ? "Collapse" : "Preview"} →
          </button>
        </div>

        {expanded && (
          <div className="space-y-3 mt-4">
            {categories.map(([categoryKey, items]) => {
              const config = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
              if (!config || !items) return null;

              return (
                <div key={categoryKey} className="bg-surface2 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{config.emoji}</span>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                      {config.name}
                    </span>
                    <span className="ml-auto text-xs text-text-secondary">{items.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {items.slice(0, 3).map((item, idx) => (
                      <a
                        key={idx}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-text-primary hover:text-primary-bright transition-colors line-clamp-1"
                      >
                        • {item.title}
                      </a>
                    ))}
                    {items.length > 3 && (
                      <p className="text-xs text-text-secondary">+{items.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex gap-2 pt-2">
              <a
                href="/data/weekly_digest.md"
                download
                className="flex-1 text-center text-xs bg-primary/20 text-primary-bright px-3 py-2 rounded-lg hover:bg-primary/30 transition-colors"
              >
                ⬇ Download Markdown
              </a>
              <a
                href="/data/weekly_digest.json"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs bg-surface2 text-text-primary px-3 py-2 rounded-lg hover:bg-border transition-colors"
              >
                📋 View JSON
              </a>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="grid grid-cols-3 gap-2">
            {categories.slice(0, 3).map(([categoryKey, items]) => {
              const config = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
              if (!config || !items) return null;

              return (
                <div key={categoryKey} className="bg-surface2 rounded-lg p-2 text-center">
                  <p className="text-sm mb-0.5">{config.emoji}</p>
                  <p className="text-xs font-mono font-bold text-text-primary">{items.length}</p>
                  <p className="text-xs text-text-secondary truncate">{config.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Full view (for dedicated page if needed)
  return (
    <div className="space-y-4">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">📰 Weekly Digest</h1>
            <p className="text-text-secondary text-sm mt-1">
              {totalItems} items · Generated {generatedDate}
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/data/weekly_digest.md"
              download
              className="text-xs bg-primary/20 text-primary-bright px-3 py-2 rounded-lg hover:bg-primary/30 transition-colors"
            >
              ⬇ Markdown
            </a>
            <a
              href="/data/weekly_digest.json"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-surface2 text-text-primary px-3 py-2 rounded-lg hover:bg-border transition-colors"
            >
              📋 JSON
            </a>
          </div>
        </div>

        {categories.map(([categoryKey, items]) => {
          const config = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];
          if (!config || !items) return null;

          return (
            <div key={categoryKey} className="mb-6 last:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{config.emoji}</span>
                <h2 className="text-lg font-bold text-text-primary">{config.name}</h2>
                <span className="ml-auto text-sm text-text-secondary">{items.length} items</span>
              </div>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-surface2 rounded-lg p-4 hover:bg-border transition-colors">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-text-primary hover:text-primary-bright transition-colors block mb-1"
                    >
                      {item.title}
                    </a>
                    {item.description && (
                      <p className="text-xs text-text-secondary mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span>📰 {item.source}</span>
                      {item.published && (
                        <span>
                          📅 {new Date(item.published).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      )}
                      {item.score && <span>⬆️ {item.score}</span>}
                      {item.comments && <span>💬 {item.comments}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
