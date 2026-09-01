import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function CTA({ client }: { client: ClientConfig }) {
  if (!client.ctaText) return null;

  return (
    <Section className="py-16 md:py-24">
      <Container>
        <div
          className="relative rounded-3xl overflow-hidden px-6 py-16 md:px-16 md:py-24 text-center"
          style={{
            background:
              'linear-gradient(135deg, var(--brand-secondary) 0%, var(--brand-primary) 100%)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--brand-accent)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 blur-3xl"
            style={{ background: 'var(--brand-accent)' }}
          />
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 relative z-10"
            style={{ color: 'var(--brand-text)' }}
          >
            {client.headline || `Ready to work with ${client.businessName}?`}
          </h2>
          <p
            className="text-lg mb-10 max-w-2xl mx-auto relative z-10"
            style={{ color: 'var(--brand-muted)' }}
          >
            {client.tagline || 'Get in touch today and let\'s discuss how we can help.'}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl relative z-10"
            style={{
              background: 'var(--brand-accent)',
              color: 'var(--brand-background)',
            }}
          >
            {client.ctaText}
          </a>
        </div>
      </Container>
    </Section>
  );
}
