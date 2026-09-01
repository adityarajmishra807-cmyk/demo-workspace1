import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';
import { Award, Shield, Sparkles, Clock, Heart, Star, type LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  award: Award,
  shield: Shield,
  sparkles: Sparkles,
  clock: Clock,
  heart: Heart,
  star: Star,
};

export default function Features({ client }: { client: ClientConfig }) {
  if (!client.features?.length) return null;

  return (
    <Section
      id="features"
      className="py-20 md:py-32"
      style={{ background: 'var(--brand-surface)' }}
    >
      <Container>
        <div className="text-center mb-14 md:mb-20">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: 'var(--brand-accent)' }}
          >
            Why Choose Us
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: 'var(--brand-text)' }}
          >
            Experience
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {client.features.map((feature, i) => {
            const Icon = iconMap[feature.icon || 'sparkles'] || Sparkles;
            return (
              <div key={i} className="text-center">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-transform duration-300 hover:scale-110"
                  style={{
                    background: 'var(--brand-accent-soft)',
                    border: '1px solid var(--brand-accent-border)',
                  }}
                >
                  <Icon size={28} style={{ color: 'var(--brand-accent)' }} />
                </div>
                <h3
                  className="text-xl md:text-2xl font-semibold mb-3"
                  style={{ color: 'var(--brand-text)' }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-base leading-relaxed max-w-xs mx-auto"
                  style={{ color: 'var(--brand-muted)' }}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
