"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import UploadSection from "@/components/UploadSection";
import LoadingState from "@/components/LoadingState";
import ResultsDashboard from "@/components/ResultsDashboard";
import { AnalysisResult } from "@/types";

type Phase = "idle" | "loading" | "results" | "error";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── Toast System ───────────────────────────────────────────────────────────

  const addToast = (message: string, type: Toast["type"] = "info") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleAnalyze = async (file: File) => {
    setFileName(file.name);
    setPhase("loading");
    setError("");
    addToast("Extracting context from PDF...", "info");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI analysis failed. Please try again.");
      }

      setResult(data as AnalysisResult);
      setPhase("results");
      addToast("Analysis complete!", "success");

      // Smooth scroll to results after a short delay for animation
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error.";
      setError(msg);
      setPhase("error");
      addToast(msg, "error");
    }
  };

  const handleReset = () => {
    setPhase("idle");
    setResult(null);
    setError("");
    setFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#05050f] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Overlay */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-3xl shadow-2xl border backdrop-blur-2xl animate-scale-in flex items-center gap-4
              ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
              }
            `}
          >
            <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-current" />
            <p className="text-xs font-black uppercase tracking-[0.15em]">{toast.message}</p>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-all duration-500">
              <span className="text-xl">✨</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none">
                PromptLess<span className="text-indigo-500">AI</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Zero-Prompt Intelligence
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              v1.0 Submission
            </span>
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            >
              Analyze Resume
            </button>
          </div>
        </div>
      </nav>

      {/* Content Rendering */}
      <div className="pt-20">
        {(phase === "idle" || phase === "loading") && (
          <div className="animate-fade-in">
            <HeroSection />
            <UploadSection onAnalyze={handleAnalyze} loading={phase === "loading"} />
            {phase === "loading" && <LoadingState />}
          </div>
        )}

        {phase === "error" && (
          <div className="py-40 px-4 text-center max-w-lg mx-auto animate-scale-in">
            <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-10">
              <span className="text-4xl text-red-500">⚠️</span>
            </div>
            <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Analysis Failed</h2>
            <div className="glass-card rounded-[2rem] p-8 mb-12 text-left shadow-2xl">
              <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">{error}</p>
              <div className="p-5 rounded-2xl bg-slate-950/40 text-[11px] text-slate-500 border border-slate-800/60 leading-loose">
                <span className="text-indigo-400 font-black uppercase tracking-widest mr-2">Quick Fix:</span>
                Ensure your PDF contains selectable text (not an image scan) and is smaller than 10MB.
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-12 py-5 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl shadow-white/10"
            >
              ↩ Return to Dashboard
            </button>
          </div>
        )}

        {phase === "results" && result && (
          <div className="animate-fade-in">
            <ResultsDashboard
              result={result}
              fileName={fileName}
              onReset={handleReset}
            />
          </div>
        )}
      </div>

      <footer className="py-24 border-t border-white/5 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-sm shadow-lg shadow-indigo-500/10">✨</div>
                <span className="font-black text-lg text-white tracking-tighter">PromptLessAI</span>
              </div>
              <p className="text-slate-500 text-xs font-medium max-w-xs leading-relaxed">
                The next evolution of career intelligence. 
                Zero prompts. Zero forms. Just pure AI inference for your professional future.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right">
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                <span className="text-slate-400">Gemini 1.5 Flash</span>
                <span className="text-slate-400">PromptWars 2026</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Problem Statement 3: Zero-Prompt AI
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em]">
              Designed & Built for PromptWars x Ascent 2026
            </p>
          </div>
        </div>
      </footer>
    </main>

  );
}
