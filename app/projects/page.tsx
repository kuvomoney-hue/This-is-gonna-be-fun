"use client";

import { useState } from "react";
import Card from "@/components/Card";
import ProgressBar from "@/components/ProgressBar";
import { projects as initialProjects, Project } from "@/lib/mockData";
import { Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: "", description: "", target: "", emoji: "🚀" });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const updateProgress = (id: string, value: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress: value } : p))
    );
  };

  const addProject = () => {
    if (!newProject.title.trim()) return;
    const project: Project = {
      id: `p${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      progress: 0,
      target: newProject.target || "TBD",
      emoji: newProject.emoji,
      color: "#14591D",
    };
    setProjects((prev) => [...prev, project]);
    setNewProject({ title: "", description: "", target: "", emoji: "🚀" });
    setShowNewForm(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f5e9]">Projects</h1>
          <p className="text-[#81c784] text-sm mt-1">
            {projects.length} active · {projects.filter((p) => p.progress === 100).length} complete
          </p>
        </div>
        <button
          onClick={() => setShowNewForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#14591D] hover:bg-[#1a7a27] text-[#e8f5e9] rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <Card title="New Project">
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                value={newProject.emoji}
                onChange={(e) => setNewProject((p) => ({ ...p, emoji: e.target.value }))}
                className="w-16 bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-3 py-2.5 text-center text-lg focus:outline-none focus:border-[#14591D]"
                placeholder="🚀"
              />
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                placeholder="Project title"
                className="flex-1 bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-4 py-2.5 text-sm text-[#e8f5e9] placeholder-[#81c784]/50 focus:outline-none focus:border-[#14591D]"
              />
            </div>
            <input
              type="text"
              value={newProject.description}
              onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
              placeholder="Description (optional)"
              className="w-full bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-4 py-2.5 text-sm text-[#e8f5e9] placeholder-[#81c784]/50 focus:outline-none focus:border-[#14591D]"
            />
            <input
              type="text"
              value={newProject.target}
              onChange={(e) => setNewProject((p) => ({ ...p, target: e.target.value }))}
              placeholder="Target date (e.g. Mar 2026)"
              className="w-full bg-[#0a0f0a] border border-[#1e3320] rounded-lg px-4 py-2.5 text-sm text-[#e8f5e9] placeholder-[#81c784]/50 focus:outline-none focus:border-[#14591D]"
            />
            <div className="flex gap-2">
              <button
                onClick={addProject}
                className="px-4 py-2.5 bg-[#14591D] hover:bg-[#1a7a27] text-[#e8f5e9] rounded-lg text-sm font-medium transition-colors"
              >
                Create Project
              </button>
              <button
                onClick={() => setShowNewForm(false)}
                className="px-4 py-2.5 bg-[#1e3320] hover:bg-[#2a4530] text-[#81c784] rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => {
          const isExpanded = expanded === project.id;
          return (
            <div
              key={project.id}
              className="bg-[#111811] border border-[#1e3320] rounded-xl overflow-hidden card-hover"
            >
              {/* Card Header */}
              <button
                onClick={() => toggleExpand(project.id)}
                className="w-full text-left p-5 hover:bg-[#14591D]/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{project.emoji}</span>
                    <div>
                      <h3 className="font-semibold text-[#e8f5e9]">{project.title}</h3>
                      <p className="text-xs text-[#81c784] mt-0.5">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-lg font-mono font-bold text-[#e8f5e9]">
                      {project.progress}%
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-[#81c784]" />
                    ) : (
                      <ChevronDown size={16} className="text-[#81c784]" />
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <ProgressBar
                    value={project.progress}
                    color={project.color}
                    height={6}
                    animated
                  />
                </div>

                {/* Target date */}
                <div className="flex items-center gap-1.5 mt-3">
                  <Calendar size={12} className="text-[#81c784]/60" />
                  <span className="text-xs text-[#81c784]/60">Target: {project.target}</span>
                </div>
              </button>

              {/* Expanded section */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-[#1e3320]">
                  <div className="pt-4 space-y-3">
                    <div>
                      <label className="text-xs text-[#81c784] uppercase tracking-wider font-medium mb-2 block">
                        Progress — {project.progress}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={project.progress}
                        onChange={(e) => updateProgress(project.id, Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, ${project.color} ${project.progress}%, #1e3320 ${project.progress}%)`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Progress", value: `${project.progress}%` },
                        { label: "Target", value: project.target },
                        { label: "Status", value: project.progress === 100 ? "Done ✅" : project.progress > 0 ? "Active" : "Not Started" },
                      ].map((s) => (
                        <div key={s.label} className="bg-[#0a0f0a] rounded-lg p-2.5">
                          <p className="text-xs text-[#81c784]/60">{s.label}</p>
                          <p className="text-sm font-mono font-medium text-[#e8f5e9] mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
