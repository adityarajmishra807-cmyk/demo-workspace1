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
  const mediaTransform = `translate3d(0, ${progress * 8}%, 0) scale(${1 + progress * 0.06})`;
  const contentTransform = `translate3d(0, ${progress * -7}%, 0)`;
  const contentOpacity = Math.max(0.3, 1 - progress * 0.8);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {client.heroImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={client.heroImage}
            alt={client.businessName}
            className="absolute inset-0 w-full h-full object-cover will-change-transform"
            style={{ transform: mediaTransform }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.1),transparent_35%)]" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(110deg, rgba(var(--brand-secondary-rgb), 0.9) 0%, rgba(var(--brand-primary-rgb), 0.64) 55%, rgba(var(--brand-primary-rgb), 0.35) 100%)',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to top, var(--brand-background), transparent 38%)',
              opacity: 0.68 + progress * 0.2,
            }}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
          }}
        />
      )}

      <div
        className="absolute left-0 top-1/2 w-1 h-28 -translate-y-1/2 hidden md:block z-10"
        style={{ background: 'var(--brand-accent)' }}
      />

      <div
        className="container-base relative z-10 pt-32 pb-24"
        style={{ transform: contentTransform, opacity: contentOpacity }}
      >
        <div className="max-w-4xl">
          {client.tagline && (
            <p
              className="text-sm md:text-base uppercase tracking-[0.35em] mb-7 animate-fade-in-up"
              style={{ color: 'var(--brand-accent)' }}
            >
              {client.tagline}
            </p>
          )}
          <h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.7rem] font-bold leading-[0.98] mb-7 max-w-4xl animate-fade-in-up animation-delay-100"
            style={{ color: 'var(--brand-text)', letterSpacing: '-0.035em' }}
          >
            {client.headline || client.businessName}
          </h1>
          {client.description && (
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mb-11 animate-fade-in-up animation-delay-200"
              style={{ color: 'var(--brand-muted)' }}
            >
              {client.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
            {client.ctaText && (
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
                style={{ background: 'var(--brand-accent)', color: 'var(--brand-background)' }}
              >
                <span>{client.ctaText}</span>
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </a>
            )}
            {client.secondaryCtaText && (
              <a
                href="#services"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold border-2 transition-all duration-500 hover:bg-white/10"
                style={{ borderColor: 'rgba(var(--brand-text-rgb), 0.75)', color: 'var(--brand-text)' }}
              >
                <span>{client.secondaryCtaText}</span>
                <span className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: 'var(--brand-muted)' }}>Scroll</span>
        <div className="w-px h-14 overflow-hidden bg-white/20">
          <div className="w-full h-full animate-scroll-line" style={{ background: 'var(--brand-accent)' }} />
        </div>
      </div>
    </section>
  );
}
