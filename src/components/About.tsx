import type { ClientConfig } from '@/types/client';
import { Section, Container } from '@/components/ui/Section';

export default function About({ client }: { client: ClientConfig }) {
  if (!client.about) return null;

  const { heading, body, image } = client.about;

  return (
    <Section id="about" className="relative overflow-hidden py-24 md:py-36">
      <div
        className="pointer-events-none absolute -right-32 top-16 h-80 w-80 rounded-full blur-3xl opacity-10"
        style={{ background: 'var(--brand-accent)' }}
      />
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[120px_1fr] lg:gap-14">
          <div className="hidden flex-col items-center gap-4 pt-2 lg:flex">
            <span className="text-xs tracking-[0.35em]" style={{ color: 'var(--brand-accent)' }}>01</span>
            <div className="h-28 w-px" style={{ background: 'var(--brand-accent-border)' }} />
            <span className="text-[10px] uppercase tracking-[0.25em] [writing-mode:vertical-rl]" style={{ color: 'var(--brand-muted)' }}>The story</span>
          </div>

          <div className={`grid items-center gap-12 lg:gap-20 ${image ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
            <div className="min-w-0">
              <p className="mb-5 text-xs uppercase tracking-[0.35em] md:text-sm" style={{ color: 'var(--brand-accent)' }}>About</p>
              {heading && (
                <h2 className="mb-7 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.02em] md:text-5xl lg:mb-8 lg:text-6xl" style={{ color: 'var(--brand-text)' }}>
                  {heading}
                </h2>
              )}
              <div className="mb-7 h-px w-16 md:mb-8 md:w-20" style={{ background: 'var(--brand-accent)' }} />
              <div className="max-w-2xl space-y-5">
                {body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-7 md:text-lg md:leading-8" style={{ color: 'var(--brand-muted)' }}>{paragraph}</p>
                ))}
              </div>
            </div>

            {image && (
              <div className="relative lg:pt-10">
                <div className="absolute -left-3 top-4 h-full w-full rounded-[1.5rem] border opacity-40 sm:-left-5 sm:top-5 sm:rounded-[2rem]" style={{ borderColor: 'var(--brand-accent-border)' }} />
                <div className="relative aspect-[4/5] max-h-[560px] overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                  <img src={image} alt={heading || client.businessName} className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]" loading="lazy" decoding="async" />
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
