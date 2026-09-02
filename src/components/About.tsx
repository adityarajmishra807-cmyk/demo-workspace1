import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function About({ client }: { client: ClientConfig }) {
  if (!client.about) return null;

  const { heading, body, image } = client.about;

  return (
    <Section id="about" className="relative py-24 md:py-36 overflow-hidden">
      <div
        className="absolute -right-32 top-16 h-80 w-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'var(--brand-accent)' }}
      />
      <Container>
        <div className="grid lg:grid-cols-[120px_1fr] gap-8 lg:gap-14 items-start">
          <div className="hidden lg:flex flex-col items-center gap-4 pt-2">
            <span className="text-xs tracking-[0.35em]" style={{ color: 'var(--brand-accent)' }}>01</span>
            <div className="h-28 w-px" style={{ background: 'var(--brand-accent-border)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] [writing-mode:vertical-rl]" style={{ color: 'var(--brand-muted)' }}>
              The story
            </span>
          </div>

          <div className={`grid ${image ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''} gap-12 lg:gap-20 items-center`}>
            <div>
              <p
                className="text-xs md:text-sm uppercase tracking-[0.35em] mb-5"
                style={{ color: 'var(--brand-accent)' }}
              >
                About
              </p>
              {heading && (
                <h2
                  className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] mb-8 max-w-3xl"
                  style={{ color: 'var(--brand-text)' }}
                >
                  {heading}
                </h2>
              )}
              <div className="h-px w-20 mb-8" style={{ background: 'var(--brand-accent)' }} />
              <div className="space-y-5 max-w-2xl">
                {body.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-base md:text-lg leading-8"
                    style={{ color: 'var(--brand-muted)' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {image && (
              <div className="relative lg:pt-10">
                <div
                  className="absolute -left-5 top-5 w-full h-full rounded-[2rem] border opacity-40"
                  style={{ borderColor: 'var(--brand-accent-border)' }}
                />
                <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] max-h-[560px]">
                  <img
                    src={image}
                    alt={heading || client.businessName}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
