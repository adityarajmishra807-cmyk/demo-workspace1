import type { ClientConfig } from '@/types/client';

export default function Hero({ client }: { client: ClientConfig }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {client.heroImage ? (
        <div className="absolute inset-0 z-0">
          <img
            src={client.heroImage}
            alt={client.businessName}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(var(--brand-secondary-rgb), 0.85) 0%, rgba(var(--brand-primary-rgb), 0.7) 100%)',
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

      {/* decorative accent line */}
      <div
        className="absolute left-0 top-1/2 w-1 h-24 -translate-y-1/2 hidden md:block z-10"
        style={{ background: 'var(--brand-accent)' }}
      />

      <div className="container-base relative z-10 pt-28 pb-20">
        <div className="max-w-3xl">
          {client.tagline && (
            <p
              className="text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-in-up"
              style={{ color: 'var(--brand-accent)' }}
            >
              {client.tagline}
            </p>
          )}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-fade-in-up animation-delay-100"
            style={{ color: 'var(--brand-text)' }}
          >
            {client.headline || client.businessName}
          </h1>
          {client.description && (
            <p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mb-10 animate-fade-in-up animation-delay-200"
              style={{ color: 'var(--brand-muted)' }}
            >
              {client.description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
            {client.ctaText && (
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'var(--brand-accent)',
                  color: 'var(--brand-background)',
                }}
              >
                {client.ctaText}
              </a>
            )}
            {client.secondaryCtaText && (
              <a
                href="#services"
                className="inline-flex items-center px-8 py-4 rounded-full text-base font-semibold border-2 transition-all duration-300 hover:bg-white/5"
                style={{
                  borderColor: 'var(--brand-text)',
                  color: 'var(--brand-text)',
                }}
              >
                {client.secondaryCtaText}
              </a>
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <div className="w-px h-16 animate-scroll-line" style={{ background: 'var(--brand-muted)' }} />
      </div>
    </section>
  );
}
