"use client";

import { useState, useEffect, useRef } from "react";
import { initialTasks, Task } from "@/lib/mockData";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

const STORAGE_KEY = "rendyr_tasks_v2";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return initialTasks;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [newText, setNewText] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = newText.trim();
    if (!trimmed) return;
    const task: Task = {
      id: `t${Date.now()}`,
      text: trimmed,
      completed: false,
      group: "today",
    };
    setTasks(prev => [task, ...prev]);
    setNewText("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {activeTasks.length} remaining · {completedTasks.length} done
          </p>
        </div>
        <button
          onClick={() => {
            fetch("https://tasks.googleapis.com", { mode: "no-cors" }).catch(() => {});
            alert("Google Tasks integration coming soon!");
          }}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg border border-border text-text-secondary hover:border-wow-amber/40 hover:text-wow-amber transition-all"
        >
          <span>🔗</span>
          Connect Google Tasks
        </button>
      </div>

      {/* ── Add Task Input ───────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl p-4 flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
          placeholder="Add a task… (press Enter)"
          className="flex-1 bg-surface2 border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary-bright/50 focus:ring-1 focus:ring-primary-bright/20 transition-colors"
        />
        <button
          onClick={addTask}
          disabled={!newText.trim()}
          className="px-4 py-2.5 bg-primary hover:bg-primary-bright/20 disabled:opacity-40 disabled:cursor-not-allowed text-primary-bright border border-primary-bright/30 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* ── Active Tasks ─────────────────────────────────────── */}
      <div className="space-y-2">
        {activeTasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-text-primary font-medium">All clear!</p>
            <p className="text-text-secondary text-sm mt-1">No tasks remaining. Add one above.</p>
          </div>
        ) : (
          activeTasks.map(task => (
            <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))
        )}
      </div>

      {/* ── Completed Section ────────────────────────────────── */}
      {completedTasks.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(v => !v)}
            className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors py-2 w-full"
          >
            {showCompleted
              ? <ChevronDown size={14} />
              : <ChevronRight size={14} />
            }
            <span className="uppercase tracking-wider font-medium">
              Completed ({completedTasks.length})
            </span>
          </button>

          {showCompleted && (
            <div className="space-y-2 mt-2 opacity-70">
              {completedTasks.map(task => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// ── Task Row Component ─────────────────────────────────────
function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border group transition-all ${
      task.completed
        ? "bg-surface border-border opacity-60"
        : "bg-surface border-border hover:border-primary-bright/20"
    }`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          task.completed
            ? "bg-primary-bright border-primary-bright"
            : "border-border hover:border-primary-bright"
        }`}
      >
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <span className={`flex-1 text-sm ${
        task.completed
          ? "line-through text-text-secondary"
          : "text-text-primary"
      }`}>
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-danger text-text-secondary/40 rounded"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
