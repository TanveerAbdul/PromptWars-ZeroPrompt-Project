"use client";

import { useState, useEffect } from "react";
import { AnalysisResult } from "@/types";

interface Props {
  result: AnalysisResult;
  fileName: string;
  onReset: () => void;
}

// ── Components ──────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label =
    score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#1e1e3a"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white leading-none">
            {animatedScore}
          </span>
          <span className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">
            Score
          </span>
        </div>
      </div>
      <div 
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        {label}
      </div>
    </div>
  );
}

function Tag({ label, variant = "default" }: { label: string; variant?: "default" | "green" | "red" | "blue" | "violet" }) {
  const styles = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    blue: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${styles[variant]} transition-all hover:scale-105 cursor-default`}>
      {label}
    </span>
  );
}

function Card({ title, icon, children, className = "", delay = 0, interactive = false, onClick }: {
  title: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 animate-slide-up ${className} ${interactive ? "cursor-pointer hover:border-indigo-500/50 group" : ""}`}
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2.5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{icon}</span>
          {title}
        </h3>
        {interactive && (
          <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-all text-xs font-bold">
            VIEW DETAILS →
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Modal({ isOpen, onClose, title, icon, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          ✕
        </button>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-black text-white">{title}</h2>
            <p className="text-slate-400 text-sm">Deep-dive analysis & recommendations</p>
          </div>
        </div>
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ResultsDashboard({ result, fileName, onReset }: Props) {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const actionCards = [
    { id: "ats", icon: "📈", label: "ATS Strategy", desc: "Optimization & Keywords" },
    { id: "interviews", icon: "🎤", label: "Interview Prep", desc: "Contextual Q&A" },
    { id: "linkedin", icon: "🔗", label: "LinkedIn Bio", desc: "Profile Optimization" },
    { id: "roadmap", icon: "🗺️", label: "Next Steps", desc: "30-Day Growth Plan" },
  ];

  return (
    <section id="results" className="py-24 px-6 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Analysis Deep-Dive
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
            Your Career <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-lg max-w-xl leading-relaxed font-medium">
            Intent inferred from <span className="text-slate-300 underline decoration-indigo-500/30 underline-offset-4">{fileName}</span>.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 font-black text-[11px] uppercase tracking-widest transition-all shadow-xl"
          >
            ↩ Reset
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black text-[11px] uppercase tracking-widest transition-all hover:scale-[1.02] shadow-2xl shadow-indigo-500/20 active:scale-95"
          >
            Download Report
          </button>
        </div>
      </div>

      {/* Top row: Score + Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <Card title="ATS Ranking" icon="📊" className="lg:col-span-4 flex flex-col justify-center py-10" delay={0.1}>
          <ScoreRing score={result.atsScore} />
        </Card>
        <Card title="Executive Summary" icon="🎯" className="lg:col-span-8" delay={0.2}>
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-6">
              <h4 className="text-3xl font-black text-white tracking-tight">{result.detectedRole}</h4>
              <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest">Inferred Target</span>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-500/20 rounded-full" />
              <p className="text-slate-400 text-lg leading-relaxed font-medium italic pl-4">
                "{result.summary}"
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {result.missingSkills.slice(0, 3).map((s, i) => (
              <Tag key={i} label={s} variant="red" />
            ))}
            {result.recommendedTechnologies.slice(0, 4).map((t, i) => (
              <Tag key={i} label={t} variant="blue" />
            ))}
          </div>
        </Card>
      </div>

      {/* Interactive Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {actionCards.map((a, i) => (
          <div
            key={a.id}
            onClick={() => setActiveModal(a.id)}
            className="glass-card group rounded-[2rem] p-8 cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-500 animate-slide-up flex flex-col justify-between min-h-[220px] shadow-lg hover:shadow-indigo-500/5"
            style={{ animationDelay: `${0.3 + i * 0.1}s`, opacity: 0 }}
          >
            <div>
              <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 group-hover:border-indigo-500/30 transition-all duration-500 shadow-inner">
                {a.icon}
              </div>
              <p className="text-white text-xl font-black tracking-tight mb-2">{a.label}</p>
              <p className="text-slate-500 text-[11px] font-bold leading-relaxed">{a.desc}</p>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-all duration-500">
              EXPLORE DETAILS <span className="text-lg">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Strengths + Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <Card title="Professional Strengths" icon="💪" delay={0.5}>
          <div className="grid grid-cols-1 gap-4">
            {result.candidateStrengths.map((s, i) => (
              <div key={i} className="flex gap-5 p-6 rounded-[1.5rem] bg-slate-900/30 border border-slate-800/40 hover:border-emerald-500/20 transition-all duration-500 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-sm font-black group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm">
                  ✓
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium group-hover:text-slate-200 transition-colors">{s}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Career Trajectory" icon="🗺️" delay={0.6}>
          <div className="space-y-6 py-2">
            {result.careerRoadmap.map((phase, i) => (
              <div key={i} className="relative pl-10 pb-8 border-l-2 border-slate-800/60 last:pb-0 group">
                <div className="absolute left-[-11px] top-0 w-5 h-5 rounded-full bg-slate-950 border-4 border-indigo-500/40 group-hover:border-indigo-500 transition-all duration-500 shadow-sm" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h5 className="text-white font-black text-lg tracking-tight leading-none">{phase.phase}</h5>
                    <span className="text-indigo-500 text-[10px] font-black uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.goals.map((g, j) => (
                      <span key={j} className="text-[11px] font-bold text-slate-500 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>


      {/* Modals */}
      <Modal 
        isOpen={activeModal === "ats"} 
        onClose={() => setActiveModal(null)} 
        title="Improve ATS Score" 
        icon="📈"
      >
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h4 className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">Critical Improvements</h4>
            <ul className="space-y-3">
              {result.resumeImprovements.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="text-amber-500 font-bold">!</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">Missing Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((s, i) => (
                <Tag key={i} label={s} variant="red" />
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
            <h4 className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">Pro Tip</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Tailor your resume for each job by including these missing keywords naturally within your project descriptions. Focus on results-oriented bullet points starting with strong action verbs.
            </p>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === "interviews"} 
        onClose={() => setActiveModal(null)} 
        title="Practice Interviews" 
        icon="🎤"
      >
        <div className="space-y-4">
          {result.interviewQuestions.map((q, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{q.category}</span>
                <span className="text-slate-600 text-[10px]">#0{i+1}</span>
              </div>
              <p className="text-white font-bold text-sm mb-3">{q.question}</p>
              <div className="pt-3 border-t border-slate-800/50">
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  <span className="text-indigo-500 font-bold">HINT:</span> Focus on specific examples from your projects like the "Apex Reapers" or "E-Learning Platform" to demonstrate your mastery.
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === "linkedin"} 
        onClose={() => setActiveModal(null)} 
        title="LinkedIn Profile Optimization" 
        icon="🔗"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest">Optimized Headline</h4>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-sm">
              {result.detectedRole} | React.js & Python Specialist | Full Stack AI Engineer
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest">Professional Summary</h4>
            <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 text-slate-300 text-sm leading-relaxed italic">
              {result.summary}
            </div>
          </div>
          <div>
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">Top Skills to Feature</h4>
            <div className="flex flex-wrap gap-2">
              {result.recommendedTechnologies.map((t, i) => (
                <Tag key={i} label={t} variant="blue" />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === "roadmap"} 
        onClose={() => setActiveModal(null)} 
        title="30-Day Mastery Roadmap" 
        icon="🗺️"
      >
        <div className="space-y-8">
          {result.careerRoadmap.map((phase, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {i + 1}
                </div>
                {i < result.careerRoadmap.length - 1 && (
                  <div className="w-px flex-1 bg-indigo-500/20 mt-2" />
                )}
              </div>
              <div className="pb-8">
                <h4 className="text-white font-black text-lg leading-none mb-1">{phase.phase}</h4>
                <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4">{phase.duration}</p>
                <div className="grid grid-cols-1 gap-2">
                  {phase.goals.map((g, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/40 text-xs text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <footer className="mt-24 pt-8 border-t border-slate-800/60 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
          ✨ PromptWars @ Ascent 2026 — Zero-Prompt AI Submission
        </p>
      </footer>
    </section>
  );
}
