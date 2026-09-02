import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';
import { ArrowUpRight } from 'lucide-react';

export default function Services({ client }: { client: ClientConfig }) {
  if (!client.services?.length) return null;

  return (
    <Section
      id="services"
      className="relative py-24 md:py-36 overflow-hidden"
      style={{ background: 'var(--brand-surface)' }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(var(--brand-muted-rgb),0.06) 1px, transparent 1px)', backgroundSize: '100% 72px' }} />
      <Container className="relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-20">
          <div>
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] mb-5" style={{ color: 'var(--brand-accent)' }}>What We Offer</p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-none" style={{ color: 'var(--brand-text)' }}>Services</h2>
          </div>
          <p className="max-w-sm text-base leading-7" style={{ color: 'var(--brand-muted)' }}>
            Carefully considered experiences, designed around what makes this business distinctive.
          </p>
        </div>

        <div className="border-t" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.18)' }}>
          {client.services.map((service, i) => (
            <article key={i} className="group relative grid md:grid-cols-[100px_1fr_56px] gap-6 md:gap-10 items-center py-8 md:py-10 border-b transition-all duration-500 hover:px-4" style={{ borderColor: 'rgba(var(--brand-muted-rgb), 0.18)' }}>
              <span className="text-sm tracking-[0.2em]" style={{ color: 'var(--brand-accent)' }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3" style={{ color: 'var(--brand-text)' }}>{service.name}</h3>
                <p className="max-w-2xl text-base md:text-lg leading-7" style={{ color: 'var(--brand-muted)' }}>{service.description}</p>
              </div>
              <div className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:scale-110" style={{ borderColor: 'var(--brand-accent-border)', color: 'var(--brand-accent)' }}>
                <ArrowUpRight size={20} />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
