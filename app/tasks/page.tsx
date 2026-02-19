"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

// ── Types ──────────────────────────────────────────────────
type Category = "rendyr" | "woof" | "trading" | "life";
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
  subtasks: Subtask[];
}

interface TasksData {
  quickWins: QuickWin[];
  activeTasks: ActiveTask[];
  projects: Project[];
}

// ── Color helpers ──────────────────────────────────────────
const categoryColor: Record<Category, { dot: string; border: string; badge: string; glow: string }> = {
  rendyr:  { dot: "bg-primary-bright",  border: "border-l-primary-bright",  badge: "bg-primary/60 text-primary-bright border border-primary-bright/30", glow: "shadow-glow-green" },
  trading: { dot: "bg-primary-bright",  border: "border-l-primary-bright",  badge: "bg-primary/60 text-primary-bright border border-primary-bright/30", glow: "shadow-glow-green" },
  woof:    { dot: "bg-wow-purple",       border: "border-l-wow-purple",      badge: "bg-wow-navy-dim/80 text-wow-purple border border-wow-purple/30",    glow: "shadow-glow-purple" },
  life:    { dot: "bg-wow-amber",        border: "border-l-wow-amber",       badge: "bg-surface2 text-wow-amber border border-wow-amber/30",             glow: "shadow-glow-amber" },
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

// ── Main Page ──────────────────────────────────────────────
export default function TasksPage() {
  const [data, setData] = useState<TasksData | null>(null);
  const [qwDone, setQwDone] = useState<Record<string, boolean>>({});
  const [atDone, setAtDone] = useState<Record<string, boolean>>({});
  const [projSubDone, setProjSubDone] = useState<Record<string, boolean>>({});
  const [expandedProj, setExpandedProj] = useState<Record<string, boolean>>({});
  const [userTasks, setUserTasks] = useState<ActiveTask[]>([]);
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState<Category>("rendyr");
  const inputRef = useRef<HTMLInputElement>(null);

  // Load JSON + localStorage on mount
  useEffect(() => {
    fetch("/data/tasks.json")
      .then(r => r.json())
      .then((d: TasksData) => {
        setData(d);
      })
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

  // Persist done states
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

  const quickWins = data.quickWins;
  const incompleteQW = quickWins.filter(t => !qwDone[t.id]).length;

  // Sort active: user tasks first, then high priority, then by due
  const baseActive = data.activeTasks.map(t => ({ ...t, done: atDone[t.id] ?? t.done }));
  const sortedActive = [...baseActive].sort((a, b) => {
    if (a.priority === "high" && b.priority !== "high") return -1;
    if (b.priority === "high" && a.priority !== "high") return 1;
    if (a.due && b.due) return a.due.localeCompare(b.due);
    if (a.due) return -1;
    if (b.due) return 1;
    return 0;
  });

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">tasks</h1>
        <p className="text-text-secondary text-sm mt-1">quick wins · active · projects</p>
      </div>

      {/* ── Add Task Input ───────────────────────────────────── */}
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
          <option value="rendyr">rendyr</option>
          <option value="woof">woof</option>
          <option value="trading">trading</option>
          <option value="life">life</option>
        </select>
        <button
          onClick={addTask}
          disabled={!newText.trim()}
          className="px-3 py-2 bg-primary hover:bg-primary-dim disabled:opacity-40 disabled:cursor-not-allowed text-primary-bright border border-primary-bright/30 rounded-lg text-sm font-medium transition-all"
        >
          add
        </button>
      </div>

      {/* ── Section 1: Quick Wins ────────────────────────────── */}
      <section>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-lg font-semibold text-text-primary">🟢 quick wins</h2>
          {incompleteQW > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-wow-amber/15 text-wow-amber border border-wow-amber/30 font-medium">
              {incompleteQW} left
            </span>
          )}
        </div>
        <p className="text-text-secondary text-xs mb-4">15–30 min · high impact</p>

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

      {/* ── Section 2: Active Tasks ──────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">📋 this week</h2>

        <div className="space-y-2">
          {/* User-added tasks first */}
          {userTasks.map(task => {
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
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/30 text-primary-bright border border-primary-bright/20 font-medium">+</span>
                <div className={`w-2 h-2 rounded-full ${cc.dot}`} />
              </div>
            );
          })}

          {/* JSON active tasks */}
          {sortedActive.map(task => {
            const cc = categoryColor[task.category];
            const dueStr = formatDue(task.due);
            const overdue = task.due && new Date(task.due + "T00:00:00") < new Date(new Date().setHours(0,0,0,0));
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

      {/* ── Section 3: Projects ──────────────────────────────── */}
      <section>
        <h2 className="text-lg font-semibold text-text-primary mb-4">🗂️ projects</h2>

        <div className="space-y-3">
          {data.projects.map(proj => {
            const cc = categoryColor[proj.category];
            const expanded = expandedProj[proj.id] ?? false;

            // Dynamic progress from localStorage
            const totalSubs = proj.subtasks.length;
            const doneSubs = proj.subtasks.filter(s => projSubDone[s.id] ?? s.done).length;
            const dynamicProgress = totalSubs > 0 ? Math.round((doneSubs / totalSubs) * 100) : proj.progress;

            return (
              <div
                key={proj.id}
                className={`bg-surface border border-border rounded-xl overflow-hidden transition-all ${
                  expanded ? cc.glow : ""
                }`}
              >
                {/* Project header — click to expand */}
                <button
                  onClick={() => toggleProject(proj.id)}
                  className="w-full text-left px-4 py-4 flex items-center gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-text-primary truncate">{proj.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${cc.badge} shrink-0`}>
                        {proj.category}
                      </span>
                    </div>

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

                  <div className={`text-text-secondary group-hover:text-text-primary transition-colors shrink-0 ${expanded ? "rotate-180" : ""} transition-transform duration-200`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {/* Subtask list */}
                {expanded && (
                  <div className="border-t border-border px-4 py-3 space-y-2 bg-surface2/30">
                    {proj.subtasks.map(sub => {
                      const subDone = projSubDone[sub.id] ?? sub.done;
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
                          <span className={`text-xs ${subDone ? "line-through text-text-secondary" : "text-text-primary"}`}>
                            {sub.text}
                          </span>
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

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <div className="pt-4 pb-8 flex justify-center">
        <button
          onClick={() => {
            fetch("https://tasks.googleapis.com", { mode: "no-cors" }).catch(() => {});
            alert("Google Tasks integration coming soon!");
          }}
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
      onClick={onToggle}
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
