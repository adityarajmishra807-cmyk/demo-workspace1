import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';
import { Award, Shield, Sparkles, Clock, Heart, Star, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = { award: Award, shield: Shield, sparkles: Sparkles, clock: Clock, heart: Heart, star: Star };

export default function Features({ client }: { client: ClientConfig }) {
  if (!client.features?.length) return null;

  return (
    <Section id="features" className="relative overflow-hidden py-24 md:py-36" style={{ background: 'var(--brand-surface)' }}>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-32">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] md:text-sm" style={{ color: 'var(--brand-accent)' }}>The Experience</p>
            <h2 className="mb-6 text-5xl font-medium leading-[1.05] tracking-[-0.02em] md:text-6xl" style={{ color: 'var(--brand-surface-text)' }}>Why it feels different.</h2>
            <p className="max-w-md text-base leading-7 md:text-lg md:leading-8" style={{ color: 'var(--brand-surface-muted)' }}>The details behind a considered experience matter just as much as the destination.</p>
          </div>
          <div className="divide-y border-t" style={{ borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.2)' }}>
            {client.features.map((feature, i) => {
              const Icon = iconMap[feature.icon || 'sparkles'] || Sparkles;
              return (
                <div key={i} className="group grid grid-cols-[48px_minmax(0,1fr)] gap-4 py-7 transition-transform duration-300 md:grid-cols-[56px_1fr] md:gap-6 md:py-10 md:hover:translate-x-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border md:h-12 md:w-12" style={{ borderColor: 'var(--brand-accent-border)', color: 'var(--brand-accent)' }}><Icon size={19} /></div>
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-xs tracking-widest" style={{ color: 'var(--brand-accent)' }}>{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl font-medium tracking-[-0.015em] md:text-2xl" style={{ color: 'var(--brand-surface-text)' }}>{feature.title}</h3></div>
                    <p className="max-w-xl text-sm leading-6 md:text-base md:leading-7" style={{ color: 'var(--brand-surface-muted)' }}>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
