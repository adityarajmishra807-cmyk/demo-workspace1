import { useEffect, useState } from 'react';
import type { ClientConfig } from '@/types/client';

export default function Hero({ client }: { client: ClientConfig }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrollY(Math.min(window.scrollY, window.innerHeight));
        frame = 0;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const progress = Math.min(scrollY / Math.max(window.innerHeight, 1), 1);
  const mediaTransform = `translate3d(0, ${progress * 6}%, 0) scale(${1 + progress * 0.045})`;
  const contentTransform = `translate3d(0, ${progress * -5}%, 0)`;
  const contentOpacity = Math.max(0.42, 1 - progress * 0.7);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {client.heroImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img
            src={client.heroImage}
            alt={client.businessName}
            className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
            style={{ transform: mediaTransform }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,255,255,0.12),transparent_32%)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, rgba(var(--brand-secondary-rgb), 0.92) 0%, rgba(var(--brand-primary-rgb), 0.68) 52%, rgba(var(--brand-primary-rgb), 0.32) 100%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, var(--brand-background) 0%, transparent 42%)',
              opacity: 0.72 + progress * 0.16,
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)' }}
        />
      )}

      <div
        className="absolute left-0 top-1/2 hidden h-28 w-1 -translate-y-1/2 md:block z-10"
        style={{ background: 'var(--brand-accent)' }}
      />

      <div
        className="container-base relative z-10 flex min-h-[100svh] items-end pb-20 pt-32 md:items-center md:pb-24"
        style={{ transform: contentTransform, opacity: contentOpacity }}
      >
        <div className="max-w-4xl">
          {client.tagline && (
            <p
              className="mb-6 text-xs uppercase tracking-[0.28em] sm:text-sm md:mb-7 md:text-base md:tracking-[0.35em] animate-fade-in-up"
              style={{ color: 'var(--brand-accent)' }}
            >
              {client.tagline}
            </p>
          )}
          <h1
            className="mb-6 max-w-4xl text-[clamp(2.6rem,8vw,5.7rem)] font-bold leading-[0.96] tracking-[-0.035em] animate-fade-in-up animation-delay-100 md:mb-7"
            style={{ color: 'var(--brand-text)' }}
          >
            {client.headline || client.businessName}
          </h1>
          {client.description && (
            <p
              className="mb-9 max-w-2xl text-base leading-7 sm:text-lg md:mb-11 md:text-xl md:leading-relaxed animate-fade-in-up animation-delay-200"
              style={{ color: 'var(--brand-muted)' }}
            >
              {client.description}
            </p>
          )}
          <div className="flex flex-wrap gap-3 sm:gap-4 animate-fade-in-up animation-delay-300">
            {client.ctaText && (
              <a
                href="#contact"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl sm:px-8 sm:py-4 sm:text-base"
                style={{ background: 'var(--brand-accent)', color: 'var(--brand-on-accent)' }}
              >
                <span>{client.ctaText}</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            )}
            {client.secondaryCtaText && (
              <a
                href="#services"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full border-2 px-6 py-3.5 text-sm font-semibold transition-all duration-500 hover:bg-white/10 sm:px-8 sm:py-4 sm:text-base"
                style={{ borderColor: 'rgba(var(--brand-text-rgb), 0.72)', color: 'var(--brand-text)' }}
              >
                <span>{client.secondaryCtaText}</span>
                <span className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex">
        <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: 'var(--brand-muted)' }}>Scroll</span>
        <div className="h-14 w-px overflow-hidden bg-white/20">
          <div className="h-full w-full animate-scroll-line" style={{ background: 'var(--brand-accent)' }} />
        </div>
      </div>
    </section>
  );
}
