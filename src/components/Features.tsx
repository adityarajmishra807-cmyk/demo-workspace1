import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';
import { Award, Shield, Sparkles, Clock, Heart, Star, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = { award: Award, shield: Shield, sparkles: Sparkles, clock: Clock, heart: Heart, star: Star };

export default function Features({ client }: { client: ClientConfig }) {
  if (!client.features?.length) return null;

  return (
    <Section id="features" className="relative py-24 md:py-36 overflow-hidden" style={{ background: 'var(--brand-surface)' }}>
      <Container>
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs md:text-sm uppercase tracking-[0.35em] mb-5" style={{ color: 'var(--brand-accent)' }}>The Experience</p>
            <h2 className="text-5xl md:text-6xl font-medium leading-[1.05] mb-6" style={{ color: 'var(--brand-surface-text)' }}>Why it feels different.</h2>
            <p className="text-base md:text-lg leading-8 max-w-md" style={{ color: 'var(--brand-surface-muted)' }}>The details behind a considered experience matter just as much as the destination.</p>
          </div>
          <div className="divide-y border-t" style={{ borderColor: 'rgba(var(--brand-surface-muted-rgb), 0.2)' }}>
            {client.features.map((feature, i) => {
              const Icon = iconMap[feature.icon || 'sparkles'] || Sparkles;
              return (
                <div key={i} className="group grid grid-cols-[56px_1fr] gap-6 py-8 md:py-10 transition-transform duration-300 hover:translate-x-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border" style={{ borderColor: 'var(--brand-accent-border)', color: 'var(--brand-accent)' }}><Icon size={20} /></div>
                  <div>
                    <div className="flex items-baseline gap-4 mb-2"><span className="text-xs tracking-widest" style={{ color: 'var(--brand-accent)' }}>{String(i + 1).padStart(2, '0')}</span><h3 className="text-xl md:text-2xl font-medium" style={{ color: 'var(--brand-surface-text)' }}>{feature.title}</h3></div>
                    <p className="text-base leading-7 max-w-xl" style={{ color: 'var(--brand-surface-muted)' }}>{feature.description}</p>
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
