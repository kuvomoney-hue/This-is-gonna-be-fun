"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ad {
  id: string;
  creative_url?: string;
  headline?: string;
  body?: string;
  cta?: string;
  start_date?: string;
  active: boolean;
}

interface Company {
  name: string;
  search_term: string;
  ads: Ad[];
  total_active: number;
  last_checked: string;
}

interface AdsData {
  companies: Company[];
  _updated: string;
  _scraper_version: string;
  _note: string;
}

export default function AdsView() {
  const [data, setData] = useState<AdsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetch("/data/meta_ads_new.json", { cache: "no-store" });
      if (res.ok) setData(await res.json());
      setLoading(false);
    } catch (err) {
      console.error("Failed to load ads data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">loading meta ads...</div>
      </div>
    );
  }

  const totalCompanies = data?.companies.length || 0;
  const totalAds = data?.companies.reduce((sum, c) => sum + c.total_active, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">meta ad library</h1>
            <p className="text-gray-600">ai company ad tracker · advertiser-based scraping</p>
          </div>
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            ← mission control
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-2">companies tracked</div>
          <div className="text-4xl font-bold">{totalCompanies}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-2">total ads found</div>
          <div className="text-4xl font-bold">{totalAds}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-sm text-gray-600 mb-2">last update</div>
          <div className="text-sm font-mono">
            {data?._updated ? new Date(data._updated).toLocaleString() : "never"}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            scraper: {data?._scraper_version || "unknown"}
          </div>
        </div>
      </div>

      {/* Scraper Status */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="font-semibold text-blue-900 mb-2">📝 scraper status</div>
          <div className="text-sm text-blue-800">
            {data?._note || "Meta Ad Library scraper v2.0 - advertiser-based architecture"}
          </div>
          <div className="text-xs text-blue-600 mt-2">
            ℹ️ Full Playwright integration pending. Structure ready, ad extraction coming soon.
          </div>
        </div>
      </div>

      {/* Companies List */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">ai companies</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded text-sm ${
                filter === "all"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              all
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded text-sm ${
                filter === "active"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              active ads
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-4 py-2 rounded text-sm ${
                filter === "inactive"
                  ? "bg-black text-white"
                  : "bg-white border border-gray-300 text-gray-700"
              }`}
            >
              no ads
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.companies
            .filter((c) => {
              if (filter === "active") return c.total_active > 0;
              if (filter === "inactive") return c.total_active === 0;
              return true;
            })
            .map((company, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
              >
                <div className="font-semibold text-lg mb-2">{company.name}</div>
                <div className="text-sm text-gray-600 mb-4">
                  search: {company.search_term}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{company.total_active}</div>
                    <div className="text-xs text-gray-500">active ads</div>
                  </div>
                  {company.total_active > 0 && (
                    <div className="text-green-600 text-sm font-semibold">●  running</div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  checked: {new Date(company.last_checked).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>

        {data?.companies.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-500">
            no companies configured
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        <p>
          targeting specific ai companies by advertiser page id · cleaner results than keyword search
        </p>
      </div>
    </div>
  );
}
