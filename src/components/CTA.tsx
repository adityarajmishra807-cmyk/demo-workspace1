import type { ClientConfig } from '@/types/client';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';

export default function CTA({ client }: { client: ClientConfig }) {
  if (!client.ctaText) return null;

  return (
    <Section className="py-20 md:py-28">
      <Container>
        <div
          className="relative overflow-hidden rounded-[2rem] border px-6 py-14 sm:px-8 sm:py-16 md:px-16 md:py-24"
          style={{ borderColor: 'var(--brand-accent-border)', background: 'var(--brand-surface)' }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{ background: 'radial-gradient(circle at 85% 15%, var(--brand-accent) 0, transparent 28%), radial-gradient(circle at 10% 90%, var(--brand-accent) 0, transparent 22%)' }}
          />
          <div className="relative z-10 max-w-4xl">
            <p className="mb-5 text-xs uppercase tracking-[0.32em] md:mb-6 md:text-sm md:tracking-[0.35em]" style={{ color: 'var(--brand-accent)' }}>Begin the conversation</p>
            <h2 className="mb-6 text-4xl font-medium leading-[1.02] tracking-[-0.02em] sm:text-5xl md:mb-7 md:text-6xl lg:text-7xl" style={{ color: 'var(--brand-surface-text)' }}>
              {client.headline || `Ready to work with ${client.businessName}?`}
            </h2>
            <p className="mb-8 max-w-2xl text-base leading-7 md:mb-10 md:text-xl md:leading-8" style={{ color: 'var(--brand-surface-muted)' }}>
              {client.tagline || "Get in touch today and let's discuss how we can help."}
            </p>
            <a
              href="#contact"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:gap-5 hover:shadow-2xl sm:px-7 sm:py-4 sm:text-base"
              style={{ background: 'var(--brand-accent)', color: 'var(--brand-on-accent)' }}
            >
              {client.ctaText}
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>
          <div className="pointer-events-none absolute bottom-4 right-6 hidden text-[9rem] font-medium leading-none opacity-[0.035] select-none md:block" style={{ color: 'var(--brand-surface-text)' }}>→</div>
        </div>
      </Container>
    </Section>
  );
}
