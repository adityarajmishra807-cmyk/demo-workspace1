import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function About({ client }: { client: ClientConfig }) {
  if (!client.about) return null;

  const { heading, body, image } = client.about;

  return (
    <Section id="about" className="py-20 md:py-32">
      <Container className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="order-2 md:order-1">
          {heading && (
            <p
              className="text-sm uppercase tracking-[0.3em] mb-4"
              style={{ color: 'var(--brand-accent)' }}
            >
              About
            </p>
          )}
          {heading && (
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ color: 'var(--brand-text)' }}
            >
              {heading}
            </h2>
          )}
          <div className="space-y-5">
            {body.map((paragraph, i) => (
              <p
                key={i}
                className="text-base md:text-lg leading-relaxed"
                style={{ color: 'var(--brand-muted)' }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        {image && (
          <div className="order-1 md:order-2 relative">
            <div
              className="absolute -inset-3 rounded-2xl opacity-20"
              style={{ background: 'var(--brand-accent)' }}
            />
            <img
              src={image}
              alt={heading || client.businessName}
              className="relative w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        )}
      </Container>
    </Section>
  );
}
