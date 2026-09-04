import { ArrowRight, CheckCircle2, LayoutDashboard, Sparkles } from 'lucide-react';

const stats = [
  { value: '5', label: 'Templates' },
  { value: '9', label: 'Reusable components' },
  { value: '100%', label: 'Config-driven' },
  { value: '0', label: 'Per-client code' },
];

export default function Landing({ navigate }: { navigate: (to: string) => void }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#07090d] text-white selection:bg-sky-400/30">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(14,165,233,0.12),transparent_32%),radial-gradient(circle_at_82%_72%,rgba(99,102,241,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
      </div>

      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
            <Sparkles size={16} className="text-sky-300" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Horizon Works</p>
            <p className="text-[11px] text-white/35">Demo Engine</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-white/75 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
        >
          Dashboard
          <ArrowRight size={14} />
        </button>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-6xl flex-col items-center px-5 pb-10 pt-12 text-center sm:px-8 sm:pt-16 lg:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/[0.07] px-3.5 py-2 text-[11px] font-medium tracking-wide text-sky-200 shadow-[0_0_30px_rgba(14,165,233,0.08)] sm:text-xs">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
          </span>
          Reusable website infrastructure
        </div>

        <h1 className="mt-7 max-w-5xl text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.94] tracking-[-0.055em]">
          One engine.
          <span className="block bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            Many client websites.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-[15px] leading-7 text-white/50 sm:text-lg sm:leading-8">
          Build and ship personalized client demos from one reusable codebase — with custom content, branding, and configuration for every business.
        </p>

        <div className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="group inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-sky-500 px-7 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(14,165,233,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-sky-400 hover:shadow-[0_18px_55px_rgba(14,165,233,0.28)] sm:w-auto"
          >
            <LayoutDashboard size={18} />
            Open Dashboard
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate('/demo-business')}
            className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] px-7 text-sm font-semibold text-white/85 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:w-auto"
          >
            View live demo
            <ArrowRight size={17} className="text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-white" />
          </button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-white/35 sm:mt-14 sm:text-xs">
          {['Single codebase', 'Custom per client', 'Fast to deploy'].map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-sky-400/80" />
              {item}
            </span>
          ))}
        </div>

        <div className="relative mt-12 w-full max-w-4xl sm:mt-14">
          <div className="absolute -inset-8 -z-10 rounded-[40px] bg-sky-500/[0.06] blur-3xl" />
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-1.5 shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:rounded-3xl sm:p-2">
            <div className="rounded-[13px] border border-white/[0.07] bg-[#0c0f15] p-4 sm:rounded-[22px] sm:p-6">
              <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[9px] font-medium text-emerald-300/80 sm:text-[10px]">
                  LIVE SYSTEM
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 pt-4 sm:grid-cols-4 sm:gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-4 text-left sm:rounded-2xl sm:px-4 sm:py-5">
                    <p className="text-xl font-semibold tracking-tight text-sky-300 sm:text-2xl">{stat.value}</p>
                    <p className="mt-1 text-[9px] leading-4 text-white/35 sm:text-[10px]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
