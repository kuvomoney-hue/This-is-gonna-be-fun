"use client"

import { useEffect, useState } from "react"

interface Task {
  id: string
  text: string
  priority: "high" | "normal"
  done: boolean
}

interface Category {
  id: string
  name: string
  accent: string
  tasks: Task[]
}

interface TaskData {
  lastUpdated: string
  categories: Category[]
}

export default function TasksPage() {
  const [data, setData] = useState<TaskData | null>(null)

  useEffect(() => {
    fetch("/data/tasks.json", { cache: "no-store" })
      .then((r) => r.json())
      .then(setData)
  }, [])

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-400" />
      </div>
    )
  }

  const totalOpen = data.categories.reduce(
    (acc, cat) => acc + cat.tasks.filter((t) => !t.done).length,
    0
  )

  return (
    <div className="min-h-screen bg-zinc-950 p-6 sm:p-10">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-600">mission control</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">tasks</h1>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-white">{totalOpen}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-zinc-600">open</p>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {data.categories.map((cat) => {
          const open = cat.tasks.filter((t) => !t.done)
          const done = cat.tasks.filter((t) => t.done)

          return (
            <div key={cat.id} className="rounded-2xl bg-zinc-900 p-5">
              {/* Category header */}
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: cat.accent }}>
                  {cat.name}
                </span>
                <span className="ml-auto rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-400">
                  {open.length}
                </span>
              </div>

              {/* Open tasks */}
              <div className="flex flex-col gap-2">
                {open.length === 0 && (
                  <p className="py-4 text-center text-xs text-zinc-700">all clear</p>
                )}
                {open.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-xl bg-zinc-800 px-3 py-3"
                  >
                    {/* Priority dot */}
                    <div
                      className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          task.priority === "high" ? "#f43f5e" : "rgba(255,255,255,0.15)",
                      }}
                    />
                    <span className="text-xs leading-relaxed text-zinc-200">{task.text}</span>
                    {task.priority === "high" && (
                      <span className="ml-auto shrink-0 rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose-400">
                        urgent
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Done tasks */}
              {done.length > 0 && (
                <div className="mt-4 flex flex-col gap-1.5 border-t border-zinc-800 pt-4">
                  {done.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 px-1">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-zinc-700" />
                      <span className="text-xs leading-relaxed text-zinc-600 line-through">
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-[10px] text-zinc-700">
        updated {data.lastUpdated} · tell scout to add or close tasks
      </p>
    </div>
  )
}
