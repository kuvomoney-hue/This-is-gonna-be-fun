"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MetaAd {
  id: string;
  advertiser: string;
  text: string;
  thumbnail: string | null;
  startDate: string;
  link: string | null;
  impressions: number;
  keyword: string;
  scrapedAt: string;
  hasVideo: boolean;
}

interface MetaAdsData {
  ads: MetaAd[];
  stats: {
    keywords_searched: number;
    total_unique_ads: number;
    total_impressions: number;
    top_impression_count: number;
  };
  updated: string;
}

export default function MetaAdsPage() {
  const [data, setData] = useState<MetaAdsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/meta-ads");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load Meta ads:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">loading meta ads...</div>
      </div>
    );
  }

  if (!data || data.ads.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">no ads found yet</div>
          <div className="text-gray-500 text-sm">
            scraper runs every 30 minutes • check back soon
          </div>
        </div>
      </div>
    );
  }

  // Get unique keywords for filter
  const keywords = Array.from(new Set(data.ads.map((ad) => ad.keyword)));
  const filteredAds = filter === "all" 
    ? data.ads 
    : data.ads.filter((ad) => ad.keyword === filter);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-2">
          ai video ads • meta library
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          real ads running on facebook/instagram right now
        </p>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">unique ads</div>
          <div className="text-2xl font-bold">
            {data.stats.total_unique_ads}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">keywords searched</div>
          <div className="text-2xl font-bold">
            {data.stats.keywords_searched}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">total impressions</div>
          <div className="text-2xl font-bold">
            {data.stats.total_impressions.toLocaleString()}
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="text-gray-400 text-xs mb-1">last updated</div>
          <div className="text-sm font-bold">
            {new Date(data.updated).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              timeZone: "America/Los_Angeles",
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-900 text-gray-400 hover:bg-gray-800"
            }`}
          >
            all ({data.ads.length})
          </button>
          {keywords.map((keyword) => {
            const count = data.ads.filter((ad) => ad.keyword === keyword).length;
            return (
              <button
                key={keyword}
                onClick={() => setFilter(keyword)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === keyword
                    ? "bg-blue-600 text-white"
                    : "bg-gray-900 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {keyword} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Ads Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredAds.map((ad) => (
          <div
            key={ad.id}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all group"
          >
            {/* Thumbnail */}
            {ad.thumbnail && (
              <div className="relative aspect-video bg-gray-800">
                <Image
                  src={ad.thumbnail}
                  alt={ad.advertiser}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs">
                  📹 VIDEO
                </div>
              </div>
            )}

            {/* Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-sm">{ad.advertiser}</div>
                {ad.impressions > 0 && (
                  <div className="text-xs text-gray-500">
                    {ad.impressions.toLocaleString()} impressions
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                {ad.text}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div>{ad.startDate}</div>
                {ad.link && (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    view on meta →
                  </a>
                )}
              </div>

              <div className="mt-2 pt-2 border-t border-gray-800">
                <div className="text-xs text-gray-600">
                  keyword: {ad.keyword}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-gray-600 text-xs">
        <p>powered by scout mission control • updates every 30 minutes</p>
        <p className="mt-2">
          tracking ai video generation ads across facebook & instagram
        </p>
      </div>
    </div>
  );
}
