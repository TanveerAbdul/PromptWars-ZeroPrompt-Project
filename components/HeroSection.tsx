export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-40 pb-20 px-6 text-center grid-bg">
      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="absolute top-60 left-10 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-10 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-black tracking-[0.3em] uppercase mb-12 animate-fade-in shadow-xl backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
          </span>
          Zero-Prompt AI Intelligence — v1.0
        </div>

        {/* Heading */}
        <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter mb-10 animate-slide-up text-white">
          The Future Is <span className="text-gradient">PromptLess.</span>
          <br />
          <span className="opacity-20 text-slate-400">Upload. Inferred. Results.</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-2xl text-slate-500 max-w-2xl mx-auto mb-16 animate-slide-up leading-relaxed font-medium" style={{ animationDelay: "0.1s", opacity: 0, animationFillMode: "forwards" }}>
          Forget typing complex prompts. Our AI analyzes your trajectory instantly to map your entire professional future.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards" }}>
          {[
            "ATS Score",
            "Role Detection",
            "Skill Gap Matrix",
            "30-Day Growth Plan",
            "Interview Simulation",
          ].map((tag) => (
            <span
              key={tag}
              className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900/40 border border-slate-800/60 text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all duration-500 cursor-default shadow-2xl"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
