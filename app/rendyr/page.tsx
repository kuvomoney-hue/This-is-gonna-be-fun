"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RendyrData {
  status?: string;
  social?: {
    instagramFollowers?: number;
    instagramHandle?: string;
    lastUpdated?: string;
  };
}

interface VideoData {
  title: string;
  channel: string;
  url: string;
  thumbnail?: string;
  published?: string;
}

export default function RendyrView() {
  const [data, setData] = useState<RendyrData>({});
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rendyrRes, videosRes] = await Promise.all([
        fetch("/data/rendyr.json", { cache: "no-store" }),
        fetch("/api/videos", { cache: "no-store" }),
      ]);

      if (rendyrRes.ok) setData(await rendyrRes.json());
      if (videosRes.ok) {
        const videoData = await videosRes.json();
        setVideos(videoData.videos || []);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load Rendyr data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-gray-600">loading rendyr...</div>
      </div>
    );
  }

  const followers = data.social?.instagramFollowers || 0;

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-2">rendyr</h1>
        <p className="text-gray-600">digital content · creator tools · ai video</p>
      </div>

      {/* Instagram Stats */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-2">instagram</div>
              <div className="text-5xl font-bold">{followers.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-2">{data.social?.instagramHandle || "@rendyr.video"}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">status</div>
              <div className="text-lg font-semibold text-green-600">active</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Video Feed */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">ai video feed</h2>
          <Link
            href="/videos"
            className="text-sm text-gray-600 hover:text-black"
          >
            view all →
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center text-gray-500">
            no videos loaded
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video, idx) => (
              <a
                key={idx}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors"
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <div className="text-sm font-semibold mb-1 line-clamp-2">
                  {video.title}
                </div>
                <div className="text-xs text-gray-600">{video.channel}</div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <div>last updated: {data.social?.lastUpdated || "today"}</div>
        <Link href="/" className="hover:text-black">
          ← mission control
        </Link>
      </div>
    </div>
  );
}
