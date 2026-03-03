"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Video, Mail, ShoppingCart, CheckCircle2, Clock, Instagram, BookOpen } from "lucide-react";

interface RendyrData {
  instagram_followers: number;
  latest_digest_items: number;
  new_videos: number;
  social: {
    instagramFollowers: number;
    instagramEngagement: string;
  };
  skool: {
    members: number;
    activeRate: string;
    weeklyPosts: number;
  };
  bundle: {
    totalSales: number;
    conversionRate: string;
    averageOrderValue: number;
  };
  email: {
    subscribers: number;
    openRate: string;
    clickRate: string;
  };
}

interface Task {
  id: string;
  text: string;
  category: string;
  est: string;
  done: boolean;
}

export default function RendyrView() {
  const [data, setData] = useState<RendyrData | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [rendyrRes, tasksRes] = await Promise.all([
        fetch("/data/rendyr.json", { cache: "no-store" }),
        fetch("/data/tasks.json", { cache: "no-store" }),
      ]);

      if (rendyrRes.ok) setData(await rendyrRes.json());
      
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        // Filter for Rendyr tasks only
        const allTasks = [...(tasksData.quickWins || []), ...(tasksData.projects || [])];
        const rendyrTasks = allTasks.filter((t: Task) => t.category === "rendyr" && !t.done);
        setTasks(rendyrTasks);
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to load Rendyr data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse text-6xl mb-4">🎬</div>
          <div className="text-xl text-white font-light">loading rendyr...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-light tracking-tight">rendyr</h1>
              <p className="text-zinc-400 text-sm mt-1">ai video tools · digital education</p>
            </div>
            <Link 
              href="/" 
              className="text-zinc-400 hover:text-white text-sm font-light transition-colors"
            >
              ← mission control
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Skool Community */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                {data?.skool.activeRate || "0%"} active
              </span>
            </div>
            <div className="text-sm text-zinc-400 mb-1">skool academy</div>
            <div className="text-3xl font-bold text-white">
              {data?.skool.members || 0}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {data?.skool.weeklyPosts || 0} posts this week
            </div>
          </div>

          {/* Instagram */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Instagram className="w-5 h-5 text-pink-400" />
              <span className="text-xs font-medium text-pink-400 bg-pink-500/10 px-2 py-1 rounded-full">
                {data?.social.instagramEngagement || "0%"}
              </span>
            </div>
            <div className="text-sm text-zinc-400 mb-1">instagram</div>
            <div className="text-3xl font-bold text-white">
              {data?.social.instagramFollowers.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-zinc-500 mt-1">followers</div>
          </div>

          {/* Email List */}
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Mail className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                {data?.email.openRate || "0%"} open
              </span>
            </div>
            <div className="text-sm text-zinc-400 mb-1">email list</div>
            <div className="text-3xl font-bold text-white">
              {data?.email.subscribers.toLocaleString() || "0"}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {data?.email.clickRate || "0%"} click rate
            </div>
          </div>

          {/* Bundle Sales */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-700/50 hover:border-purple-600/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded-full">
                {data?.bundle.conversionRate || "0%"}
              </span>
            </div>
            <div className="text-sm text-white/80 mb-1">bundle sales</div>
            <div className="text-3xl font-bold text-white">
              {data?.bundle.totalSales || 0}
            </div>
            <div className="text-xs text-white/70 mt-1">
              ${data?.bundle.averageOrderValue || 0} avg order
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tasks - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">rendyr tasks</h2>
                <p className="text-purple-100 text-sm mt-1">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''} ready to tackle
                </p>
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-zinc-500">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
                    <div className="text-lg">all caught up!</div>
                    <div className="text-sm mt-1">no pending rendyr tasks</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-4 border border-zinc-700/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full border-2 border-zinc-600 bg-zinc-900 flex items-center justify-center flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium mb-1">
                              {task.text}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                              <Clock className="w-3 h-3" />
                              {task.est}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Ready - Takes 1 column */}
          <div>
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">content ready</h2>
                <p className="text-purple-100 text-sm mt-1">posts & videos</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Weekly Digest */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-white font-medium">weekly digest</span>
                      </div>
                      <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">
                        {data?.latest_digest_items || 0} items
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      ready for friday newsletter
                    </div>
                  </div>

                  {/* Video Feed */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-white font-medium">ai video feed</span>
                      </div>
                      <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                        {data?.new_videos || 0} new
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      latest ai releases tracked
                    </div>
                  </div>

                  {/* Skool Posts */}
                  <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white font-medium">skool activity</span>
                      </div>
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                        {data?.skool.weeklyPosts || 0} posts
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400">
                      {data?.skool.activeRate || "0%"} members active this week
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="mt-6 space-y-2">
                  <Link 
                    href="/videos"
                    className="block bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 text-sm transition-colors border border-zinc-700/50"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span>view video feed →</span>
                    </div>
                  </Link>
                  <Link 
                    href="/ads"
                    className="block bg-zinc-800/50 hover:bg-zinc-800 rounded-lg p-3 text-sm transition-colors border border-zinc-700/50"
                  >
                    <div className="flex items-center justify-between text-white">
                      <span>meta ads library →</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-8 bg-zinc-900/60 backdrop-blur-sm rounded-lg p-4 border border-zinc-800/50">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-zinc-400">
            <div>
              <span className="font-semibold text-white">total reach:</span> {(data?.social.instagramFollowers || 0) + (data?.email.subscribers || 0) + (data?.skool.members || 0)} people
            </div>
            <div>
              <span className="font-semibold text-white">content pipeline:</span> {(data?.latest_digest_items || 0) + (data?.new_videos || 0)} items ready
            </div>
            <div>
              <span className="font-semibold text-white">last updated:</span> {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
