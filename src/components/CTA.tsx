import type { ClientConfig } from '@/types/client';
import { ArrowUpRight } from 'lucide-react';
import { Section, Container } from '@/components/ui/Section';

export default function CTA({ client }: { client: ClientConfig }) {
  if (!client.ctaText) return null;

  return (
    <Section className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border px-7 py-16 md:px-16 md:py-24" style={{ borderColor: 'var(--brand-accent-border)', background: 'var(--brand-surface)' }}>
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle at 85% 15%, var(--brand-accent) 0, transparent 28%), radial-gradient(circle at 10% 90%, var(--brand-accent) 0, transparent 22%)' }} />
          <div className="relative z-10 max-w-4xl">
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] mb-6" style={{ color: 'var(--brand-accent)' }}>Begin the conversation</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.02] mb-7" style={{ color: 'var(--brand-text)' }}>{client.headline || `Ready to work with ${client.businessName}?`}</h2>
            <p className="text-lg md:text-xl leading-8 max-w-2xl mb-10" style={{ color: 'var(--brand-muted)' }}>{client.tagline || 'Get in touch today and let\'s discuss how we can help.'}</p>
            <a href="#contact" className="group inline-flex items-center gap-3 px-7 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:gap-5" style={{ background: 'var(--brand-accent)', color: 'var(--brand-background)' }}>
              {client.ctaText}<ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </a>
          </div>
          <div className="absolute right-10 bottom-8 hidden md:block text-[9rem] leading-none font-medium opacity-[0.035] select-none" style={{ color: 'var(--brand-text)' }}>→</div>
        </div>
      </Container>
    </Section>
  );
}
