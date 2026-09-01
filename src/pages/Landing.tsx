import { LayoutDashboard, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-white/60 mb-8">
          <Sparkles size={14} className="text-sky-400" />
          Horizon Works Demo Engine
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          One Engine.
          <br />
          <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
            Many Client Websites.
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-2xl mb-10 leading-relaxed">
          A reusable website system that generates unique client demos from a single codebase. Each client gets their own design, content, and branding — all driven by configuration.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20"
          >
            <LayoutDashboard size={18} />
            Open Dashboard
          </button>
          <button
            onClick={() => navigate('/demo-business')}
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-semibold text-sm transition-all duration-300"
          >
            View Demo Client
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl w-full">
          {[
            { label: 'Templates', value: '5' },
            { label: 'Reusable Components', value: '9' },
            { label: 'Config-Driven', value: '100%' },
            { label: 'Per-Client Code', value: '0' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <p className="text-2xl font-bold text-sky-400">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
