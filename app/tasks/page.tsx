"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { initialTasks, Task } from "@/lib/mockData";
import { Plus, Trash2, Check } from "lucide-react";

const STORAGE_KEY = "rendyr_tasks";

type Group = "today" | "week" | "someday";

const groupMeta: Record<Group, { label: string; emoji: string }> = {
  today:   { label: "Today",     emoji: "🎯" },
  week:    { label: "This Week", emoji: "📅" },
  someday: { label: "Someday",   emoji: "🌙" },
};

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
  const [newGroup, setNewGroup] = useState<Group>("today");
  const [showInput, setShowInput] = useState(false);

  // Persist to localStorage whenever tasks change
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
      group: newGroup,
    };
    setTasks((prev) => [...prev, task]);
    setNewText("");
    setShowInput(false);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f5e9]">Tasks</h1>
          <p className="text-[#81c784] text-sm mt-1">
            {completedCount} of {tasks.length} complete
          </p>
        </div>
        <button
          onClick={() => setShowInput((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#14591D] hover:bg-[#1a7a27] text-[#e8f5e9] rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Add Task Input */}
      {showInput && (
        <Card>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="What needs to get done?"
              autoFocus
              className="flex-1 bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-4 py-2.5 text-sm text-[#e8f5e9] placeholder-[#81c784]/50 focus:outline-none focus:border-[#14591D] focus:ring-1 focus:ring-[#14591D]/50 transition-colors"
            />
            <select
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value as Group)}
              className="bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-3 py-2.5 text-sm text-[#81c784] focus:outline-none focus:border-[#14591D] cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="someday">Someday</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="px-4 py-2.5 bg-[#14591D] hover:bg-[#1a7a27] text-[#e8f5e9] rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="px-4 py-2.5 bg-[#1e3320] hover:bg-[#2a4530] text-[#81c784] rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Task Groups */}
      {(["today", "week", "someday"] as Group[]).map((group) => {
        const groupTasks = tasks.filter((t) => t.group === group);
        const { label, emoji } = groupMeta[group];
        return (
          <Card key={group} title={`${emoji} ${label}`} subtitle={`${groupTasks.filter(t => !t.completed).length} remaining`}>
            {groupTasks.length === 0 ? (
              <p className="text-sm text-[#81c784]/50 italic py-2">No tasks here — nice!</p>
            ) : (
              <div className="space-y-1">
                {groupTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg group/task
                      transition-colors hover:bg-[#14591D]/10
                    `}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                        transition-all duration-150
                        ${task.completed
                          ? "bg-[#4caf50] border-[#4caf50]"
                          : "border-[#1e3320] hover:border-[#14591D]"
                        }
                      `}
                    >
                      {task.completed && <Check size={11} className="text-white" strokeWidth={3} />}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        task.completed
                          ? "line-through text-[#81c784]/40"
                          : "text-[#e8f5e9]"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover/task:opacity-100 transition-opacity p-1 hover:text-[#ef5350] text-[#81c784]/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      {/* Integration placeholder */}
      <div className="flex items-center gap-3 p-4 border border-dashed border-[#1e3320] rounded-xl">
        <span className="text-2xl">🔗</span>
        <div>
          <p className="text-sm text-[#81c784] font-medium">Google Tasks Integration</p>
          <p className="text-xs text-[#81c784]/50 mt-0.5">Sync with Google Tasks coming in V2</p>
        </div>
        <span className="ml-auto text-xs text-[#81c784]/40 border border-[#1e3320] px-2 py-1 rounded">Soon</span>
      </div>
    </div>
  );
}
