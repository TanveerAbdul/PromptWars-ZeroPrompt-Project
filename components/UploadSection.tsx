"use client";

import { useState, useRef } from "react";

interface Props {
  onAnalyze: (file: File) => void;
  loading: boolean;
}

export default function UploadSection({ onAnalyze, loading }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type === "application/pdf") {
      onAnalyze(file);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards" }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative group transition-all duration-700 rounded-[3rem] p-16 text-center overflow-hidden
          ${
            loading 
              ? "cursor-wait bg-slate-900/60 border-slate-800 shadow-inner"
              : isDragging
                ? "cursor-copy bg-indigo-500/10 border-indigo-500 scale-[0.98]"
                : "cursor-pointer bg-slate-900/40 border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-2xl shadow-indigo-500/5"
          }
          border-2 border-dashed
        `}
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_70%)]" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          accept=".pdf"
          className="hidden"
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-28 h-28 rounded-[2rem] bg-slate-950 border border-slate-800 flex items-center justify-center mb-10 shadow-inner transition-all duration-700 
            ${loading ? "animate-pulse" : "group-hover:scale-110 group-hover:rotate-6 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20"}
          `}>
            {loading ? (
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            ) : (
              <svg
                className="w-12 h-12 text-indigo-500 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            )}
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">
            {loading ? "Analyzing trajectory..." : "Drop your résumé here"}
          </h3>
          <p className="text-slate-500 text-sm md:text-lg max-w-sm mb-12 leading-relaxed font-medium">
            {loading 
              ? "Gemini 1.5 Flash is mapping your career path contextually." 
              : "PDF only. Our zero-prompt engine interprets your intent instantly."}
          </p>

          {!loading && (
            <div className="flex flex-col items-center gap-6">
              <button className="px-12 py-5 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-2xl shadow-indigo-500/30 active:scale-95">
                ✨ Start Pure AI Analysis
              </button>
              
              <div className="flex items-center gap-10 mt-6">
                {[
                  { label: "Encrypted", icon: "🔒" },
                  { label: "No Prompts", icon: "⚡" },
                  { label: "Private", icon: "🛡️" }
                ].map((tag) => (
                  <div key={tag.label} className="flex items-center gap-3">
                    <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{tag.icon}</span>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">{tag.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust section */}
      {!loading && (
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: "ATS Optimization", desc: "Instantly see how top systems rank your career history." },
            { title: "Intent Inference", desc: "No forms. Our engine deduces your target role automatically." },
            { title: "30-Day Roadmaps", desc: "Step-by-step skill acquisition plans tailored to your gaps." }
          ].map((item, i) => (
            <div key={i} className="text-center p-10 rounded-[2.5rem] bg-slate-900/20 border border-slate-800/40 hover:bg-slate-900/30 hover:border-slate-700/60 transition-all duration-500 group">
              <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-4 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
