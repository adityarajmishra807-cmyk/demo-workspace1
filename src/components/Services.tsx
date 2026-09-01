import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function Services({ client }: { client: ClientConfig }) {
  if (!client.services?.length) return null;

  return (
    <Section
      id="services"
      className="py-20 md:py-32"
      style={{ background: 'var(--brand-surface)' }}
    >
      <Container>
        <div className="text-center mb-14 md:mb-20">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-4"
            style={{ color: 'var(--brand-accent)' }}
          >
            What We Offer
          </p>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: 'var(--brand-text)' }}
          >
            Services
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {client.services.map((service, i) => (
            <div
              key={i}
              className="group rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] border"
              style={{
                background: 'var(--brand-background)',
                borderColor: 'rgba(var(--brand-muted-rgb), 0.12)',
              }}
            >
              {service.image && (
                <div className="mb-6 overflow-hidden rounded-xl">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shrink-0"
                  style={{
                    background: 'var(--brand-accent-soft)',
                    color: 'var(--brand-accent)',
                    border: '1px solid var(--brand-accent-border)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className="text-xl md:text-2xl font-semibold"
                  style={{ color: 'var(--brand-text)' }}
                >
                  {service.name}
                </h3>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--brand-muted)' }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
