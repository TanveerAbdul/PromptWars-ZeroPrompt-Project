export default function LoadingState() {
  const steps = [
    { label: "Extracting trajectory context…", icon: "📄" },
    { label: "Inferring professional intent…", icon: "🎯" },
    { label: "Calculating ATS compatibility…", icon: "📊" },
    { label: "Synthesizing skill gap matrix…", icon: "🛠️" },
    { label: "Mapping 30-day roadmap…", icon: "🗺️" },
    { label: "Simulating interview context…", icon: "🎤" },
  ];

  return (
    <div className="py-24 px-6 max-w-xl mx-auto text-center">
      {/* Premium Spinning Orb */}
      <div className="relative w-32 h-32 mx-auto mb-12">
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 animate-spin opacity-20 blur-xl" />
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500 to-violet-500 animate-spin-slow shadow-2xl" />
        <div className="absolute inset-3 rounded-[2rem] bg-slate-950 flex items-center justify-center">
          <div className="text-3xl animate-bounce">✨</div>
        </div>
      </div>

      <h2 className="text-3xl font-black text-white mb-3 tracking-tighter">
        Inference Engines Active
      </h2>
      <p className="text-slate-500 text-sm mb-12 font-medium">
        Zero-prompt analysis in progress. Gemini is mapping your future.
      </p>

      {/* Progress Steps */}
      <div className="space-y-4 text-left">
        {steps.map((step, i) => (
          <div
            key={step.label}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-fade-in shadow-sm"
            style={{ animationDelay: `${i * 0.3}s`, opacity: 0, animationFillMode: "forwards" }}
          >
            <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{step.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex-1">{step.label}</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] animate-pulse">
        Processing Multi-Dimensional Context
      </div>
    </div>
  );
}
