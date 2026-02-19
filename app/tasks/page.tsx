"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type Category = "rendyr" | "woof" | "trading" | "life";
type FilterTab = "all" | Category;
type Priority = "high" | "medium" | "low";

interface QuickWin {
  id: string;
  text: string;
  category: Category;
  est: string;
  done: boolean;
}

interface ActiveTask {
  id: string;
  text: string;
  category: Category;
  priority: Priority;
  due?: string;
  done: boolean;
  userAdded?: boolean;
}

interface Subtask {
  id: string;
  text: string;
  done: boolean;
}

interface Project {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  progress: number;
  note?: string;
  subtasks: Subtask[];
}

interface TasksData {
  quickWins: QuickWin[];
  activeTasks: ActiveTask[];
  projects: Project[];
}

// ── Color helpers ──────────────────────────────────────────
const categoryColor: Record<Category, { dot: string; border: string; badge: string; glow: string; tab: string; tabActive: string }> = {
  rendyr:  {
    dot: "bg-primary-bright", border: "border-l-primary-bright",
    badge: "bg-primary/60 text-primary-bright border border-primary-bright/30",
    glow: "shadow-glow-green", tab: "text-primary-bright/60 hover:text-primary-bright",
    tabActive: "text-primary-bright border-b-2 border-primary-bright"
  },
  trading: {
    dot: "bg-primary-bright", border: "border-l-primary-bright",
    badge: "bg-primary/60 text-primary-bright border border-primary-bright/30",
    glow: "shadow-glow-green", tab: "text-primary-bright/60 hover:text-primary-bright",
    tabActive: "text-primary-bright border-b-2 border-primary-bright"
  },
  woof: {
    dot: "bg-wow-purple", border: "border-l-wow-purple",
    badge: "bg-wow-navy-dim/80 text-wow-purple border border-wow-purple/30",
    glow: "shadow-glow-purple", tab: "text-wow-purple/60 hover:text-wow-purple",
    tabActive: "text-wow-purple border-b-2 border-wow-purple"
  },
  life: {
    dot: "bg-wow-amber", border: "border-l-wow-amber",
    badge: "bg-surface2 text-wow-amber border border-wow-amber/30",
    glow: "shadow-glow-amber", tab: "text-wow-amber/60 hover:text-wow-amber",
    tabActive: "text-wow-amber border-b-2 border-wow-amber"
  },
};

const priorityBadge: Record<Priority, string> = {
  high:   "bg-danger/10 text-danger border border-danger/30",
  medium: "bg-wow-amber/10 text-wow-amber border border-wow-amber/30",
  low:    "bg-surface2 text-text-secondary border border-border",
};

function formatDue(due?: string): string | null {
  if (!due) return null;
  const d = new Date(due + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STORAGE_KEY_QW   = "tasks_v2_quickwins";
const STORAGE_KEY_AT   = "tasks_v2_active";
const STORAGE_KEY_PROJ = "tasks_v2_projects";
const STORAGE_KEY_USER = "tasks_v2_user";

const FILTER_TABS: { key: FilterTab; label: string; emoji: string }[] = [
  { key: "all",     label: "all",     emoji: "⚡" },
  { key: "woof",    label: "woof",    emoji: "🐾" },
  { key: "rendyr",  label: "rendyr",  emoji: "🎬" },
  { key: "trading", label: "trading", emoji: "📈" },
  { key: "life",    label: "life",    emoji: "🌀" },
];

// ── Main Page ──────────────────────────────────────────────
export default function TasksPage() {
  const [data, setData] = useState<TasksData | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [qwDone, setQwDone] = useState<Record<string, boolean>>({});
  const [atDone, setAtDone] = useState<Record<string, boolean>>({});
  const [projSubDone, setProjSubDone] = useState<Record<string, boolean>>({});
  const [expandedProj, setExpandedProj] = useState<Record<string, boolean>>({});
  const [userTasks, setUserTasks] = useState<ActiveTask[]>([]);
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState<Category>("rendyr");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/tasks.json")
      .then(r => r.json())
      .then((d: TasksData) => setData(d))
      .catch(console.error);
    try {
      const qw = localStorage.getItem(STORAGE_KEY_QW);
      if (qw) setQwDone(JSON.parse(qw));
      const at = localStorage.getItem(STORAGE_KEY_AT);
      if (at) setAtDone(JSON.parse(at));
      const ps = localStorage.getItem(STORAGE_KEY_PROJ);
      if (ps) setProjSubDone(JSON.parse(ps));
      const ut = localStorage.getItem(STORAGE_KEY_USER);
      if (ut) setUserTasks(JSON.parse(ut));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEY_QW, JSON.stringify(qwDone)); }, [qwDone]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_AT, JSON.stringify(atDone)); }, [atDone]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_PROJ, JSON.stringify(projSubDone)); }, [projSubDone]);
  useEffect(() => { localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userTasks)); }, [userTasks]);

  const addTask = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const task: ActiveTask = {
      id: `user_${Date.now()}`,
      text: trimmed,
      category: newCat,
      priority: "medium",
      done: false,
      userAdded: true,
    };
    setUserTasks(prev => [task, ...prev]);
    setNewText("");
    inputRef.current?.focus();
  };

  const toggleQW = (id: string) => setQwDone(p => ({ ...p, [id]: !p[id] }));
  const toggleAT = (id: string) => setAtDone(p => ({ ...p, [id]: !p[id] }));
  const toggleUserTask = (id: string) =>
    setUserTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const toggleSubtask = (id: string) => setProjSubDone(p => ({ ...p, [id]: !p[id] }));
  const toggleProject = (id: string) => setExpandedProj(p => ({ ...p, [id]: !p[id] }));

  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[40vh]">
        <div className="text-text-secondary text-sm animate-pulse">loading tasks…</div>
      </div>
    );
  }

  // ── Filtered data ──────────────────────────────────────
  const filterFn = (cat: Category) => filter === "all" || filter === cat;

  const quickWins = data.quickWins.filter(t => filterFn(t.category));
  const incompleteQW = quickWins.filter(t => !qwDone[t.id]).length;

  const baseActive = data.activeTasks
    .filter(t => filterFn(t.category))
    .map(t => ({ ...t, done: atDone[t.id] ?? t.done }));

  const sortedActive = [...baseActive].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (b.priority === "high" && a.priority !== "high") return 1;
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
  });

  const filteredUserTasks = userTasks.filter(t => filterFn(t.category));

  const filteredProjects = data.projects.filter(p => filterFn(p.category));

  // Top priority undone active task for focus banner
  const topTask = [...filteredUserTasks, ...sortedActive].find(t => !t.done && (t as ActiveTask).priority === "high");

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">tasks</h1>
        <p className="text-text-secondary text-sm mt-1">quick wins · this week · projects</p>
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex items-center gap-1 border-b border-border pb-0 -mb-2">
        {FILTER_TABS.map(tab => {
          const isActive = filter === tab.key;
          const colorClass = tab.key === "all"
            ? (isActive ? "text-text-primary border-b-2 border-text-primary" : "text-text-secondary/60 hover:text-text-secondary")
            : (isActive ? categoryColor[tab.key as Category].tabActive : categoryColor[tab.key as Category].tab);
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all ${colorClass}`}
            >
              <span className="text-base leading-none">{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Focus Banner (top priority undone task) ── */}
      {topTask && filter === "all" && (
        <div className="bg-surface border border-wow-amber/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-lg">🎯</span>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-wow-amber/70 uppercase tracking-wider font-semibold mb-0.5">top priority</div>
            <p className="text-sm text-text-primary truncate">{topTask.text}</p>
          </div>
          <div className={`w-2 h-2 rounded-full shrink-0 ${categoryColor[topTask.category].dot}`} />
        </div>
      )}

      {/* ── Add Task ── */}
      <div className="bg-surface border border-border rounded-xl p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="add a task… (press Enter)"
          className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary-bright/40 focus:ring-1 focus:ring-primary-bright/15 transition-colors"
        />
        <select
          value={newCat}
          onChange={e => setNewCat(e.target.value as Category)}
          className="bg-surface2 border border-border rounded-lg px-2 py-2 text-sm text-text-secondary focus:outline-none focus:border-primary-bright/40 transition-colors"
        >
          <option value="rendyr">🎬 rendyr</option>
          <option value="woof">🐾 woof</option>
          <option value="trading">📈 trading</option>
          <option value="life">🌀 life</option>
        </select>
        <button
          onClick={addTask}
          disabled={!newText.trim()}
          className="px-3 py-2 bg-primary hover:bg-primary-dim disabled:opacity-40 disabled:cursor-not-allowed text-primary-bright border border-primary-bright/30 rounded-lg text-sm font-medium transition-all"
        >
          add
        </button>
      </div>

      {/* ── Quick Wins ── */}
      {quickWins.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-lg font-semibold text-text-primary">⚡ quick wins</h2>
            {incompleteQW > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-wow-amber/15 text-wow-amber border border-wow-amber/30 font-medium">
                {incompleteQW} left
              </span>
            )}
          </div>
          <p className="text-text-secondary text-xs mb-4">bite-sized · 10–30 min · do now</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickWins.map(task => {
              const done = qwDone[task.id] ?? task.done;
              const cc = categoryColor[task.category];
              return (
                <button
                  key={task.id}
                  onClick={() => toggleQW(task.id)}
                  className={`text-left p-3 rounded-xl border border-l-[3px] ${cc.border} bg-surface border-border transition-all group ${
                    done ? "opacity-40" : "hover:border-border/80 hover:bg-surface2/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                      done ? `${cc.dot} border-transparent` : "border-border group-hover:border-text-secondary"
                    }`}>
                      {done && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs leading-snug flex-1 ${done ? "line-through text-text-secondary" : "text-text-primary"}`}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface2 text-text-secondary border border-border font-mono">
                      {task.est}
                    </span>
                    <div className={`w-1.5 h-1.5 rounded-full ${cc.dot}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── This Week (Active Tasks) ── */}
      {(filteredUserTasks.length > 0 || sortedActive.length > 0) && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">📋 this week</h2>

          <div className="space-y-2">
            {/* User-added tasks */}
            {filteredUserTasks.map(task => {
              const cc = categoryColor[task.category];
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-l-[3px] ${cc.border} bg-surface border-border transition-all group ${
                    task.done ? "opacity-50" : "hover:bg-surface2/30"
                  }`}
                >
                  <CheckBox checked={task.done} onToggle={() => toggleUserTask(task.id)} dotClass={cc.dot} />
                  <span className={`flex-1 text-sm ${task.done ? "line-through text-text-secondary" : "text-text-primary"}`}>
                    {task.text}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/30 text-primary-bright border border-primary-bright/20 font-medium">new</span>
                  <div className={`w-2 h-2 rounded-full ${cc.dot}`} />
                </div>
              );
            })}

            {/* JSON active tasks */}
            {sortedActive.map(task => {
              const cc = categoryColor[task.category];
              const dueStr = formatDue(task.due);
              const overdue = task.due && new Date(task.due + "T00:00:00") < new Date(new Date().setHours(0, 0, 0, 0));
              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-l-[3px] ${cc.border} bg-surface border-border transition-all group ${
                    task.done ? "opacity-50" : "hover:bg-surface2/30"
                  }`}
                >
                  <CheckBox checked={task.done} onToggle={() => toggleAT(task.id)} dotClass={cc.dot} />
                  <span className={`flex-1 text-sm ${task.done ? "line-through text-text-secondary" : "text-text-primary"}`}>
                    {task.text}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${priorityBadge[task.priority]} font-medium`}>
                      {task.priority}
                    </span>
                    {dueStr && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-mono ${
                        overdue
                          ? "bg-danger/10 text-danger border-danger/30"
                          : "bg-surface2 text-text-secondary border-border"
                      }`}>
                        {dueStr}
                      </span>
                    )}
                    <div className={`w-2 h-2 rounded-full ${cc.dot}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Projects ── */}
      {filteredProjects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">🗂️ projects</h2>

          <div className="space-y-3">
            {filteredProjects.map(proj => {
              const cc = categoryColor[proj.category];
              const expanded = expandedProj[proj.id] ?? false;

              const totalSubs = proj.subtasks.length;
              const doneSubs = proj.subtasks.filter(s => projSubDone[s.id] ?? s.done).length;
              const dynamicProgress = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : proj.progress;

              // Find the first undone subtask as "next action"
              const nextAction = proj.subtasks.find(s => !(projSubDone[s.id] ?? s.done));

              return (
                <div
                  key={proj.id}
                  className={`bg-surface border border-border rounded-xl overflow-hidden transition-all ${
                    expanded ? cc.glow : ""
                  }`}
                >
                  <button
                    onClick={() => toggleProject(proj.id)}
                    className="w-full text-left px-4 py-4 flex items-center gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-text-primary truncate">{proj.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cc.badge} shrink-0`}>
                          {proj.category}
                        </span>
                      </div>

                      {/* Next action hint */}
                      {nextAction && !expanded && (
                        <p className="text-[11px] text-text-secondary truncate mb-2">
                          → {nextAction.text}
                        </p>
                      )}

                      {/* Progress bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-surface2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              proj.category === "woof" ? "bg-wow-purple" :
                              proj.category === "life" ? "bg-wow-amber" :
                              "bg-primary-bright"
                            }`}
                            style={{ width: `${dynamicProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-text-secondary font-mono shrink-0">
                          {doneSubs}/{totalSubs}
                        </span>
                        <span className="text-[10px] text-text-secondary font-mono shrink-0">
                          {dynamicProgress}%
                        </span>
                      </div>
                    </div>

                    <div className={`text-text-secondary group-hover:text-text-primary transition-all shrink-0 ${expanded ? "rotate-180" : ""} duration-200`}>
                      <ChevronDown size={16} />
                    </div>
                  </button>

                  {/* Subtasks */}
                  {expanded && (
                    <div className="border-t border-border px-4 py-3 space-y-2 bg-surface2/30">
                      {proj.note && (
                        <p className="text-xs text-text-secondary/70 italic pb-2 border-b border-border/50">
                          {proj.note}
                        </p>
                      )}
                      {proj.subtasks.map(sub => {
                        const subDone = projSubDone[sub.id] ?? sub.done;
                        const isNext = !subDone && sub.id === nextAction?.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => toggleSubtask(sub.id)}
                            className={`w-full flex items-center gap-3 text-left py-1.5 group/sub transition-opacity ${
                              subDone ? "opacity-50" : ""
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                              subDone
                                ? `${cc.dot} border-transparent`
                                : "border-border group-hover/sub:border-text-secondary"
                            }`}>
                              {subDone && (
                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                  <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className={`text-xs flex-1 ${subDone ? "line-through text-text-secondary" : isNext ? "text-text-primary font-medium" : "text-text-primary"}`}>
                              {sub.text}
                            </span>
                            {isNext && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-wow-amber/15 text-wow-amber border border-wow-amber/30 font-semibold uppercase tracking-wide shrink-0">
                                next
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Empty state ── */}
      {quickWins.length === 0 && sortedActive.length === 0 && filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-text-secondary text-sm">all clear for {filter === "all" ? "everything" : filter}</p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="pt-2 pb-8 flex justify-center">
        <button
          onClick={() => alert("Google Tasks integration coming soon!")}
          className="flex items-center gap-2 text-xs px-4 py-2.5 rounded-lg border border-border text-text-secondary hover:border-wow-amber/40 hover:text-wow-amber transition-all"
        >
          <span>🔗</span>
          Connect Google Tasks
        </button>
      </div>

    </div>
  );
}

// ── Reusable Checkbox ──────────────────────────────────────
function CheckBox({ checked, onToggle, dotClass }: { checked: boolean; onToggle: () => void; dotClass: string }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
        checked ? `${dotClass} border-transparent` : "border-border hover:border-text-secondary"
      }`}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </button>
  );
}
