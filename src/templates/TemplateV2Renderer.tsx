import type { ReactNode } from 'react';
import type { ClientConfig } from '@/types/client';
import { analyzeBusiness } from '@/engine/businessIntelligence';
import { resolveIndustryArchetype } from '@/engine/industryArchetypes';
import { getTemplateV2SectionOrder } from './templateV2';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Services from '@/components/Services';
import Gallery from '@/components/Gallery';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { Container, Section } from '@/components/ui/Section';

function LocationSection({ client }: { client: ClientConfig }) {
  const location = client.location;
  if (!location || !Object.values(location).some(Boolean)) return null;
  const parts = [location.city, location.region, location.country].filter(Boolean);
  return (
    <Section id="location" className="py-20 md:py-28" style={{ background: 'var(--brand-surface)' }}>
      <Container>
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.35em]" style={{ color: 'var(--brand-accent)' }}>Location</p>
            <h2 className="text-4xl font-medium md:text-5xl" style={{ color: 'var(--brand-surface-text)' }}>Find us.</h2>
          </div>
          <div className="max-w-2xl">
            {location.address && <p className="text-xl leading-8 md:text-2xl" style={{ color: 'var(--brand-surface-text)' }}>{location.address}</p>}
            {parts.length > 0 && <p className="mt-3 text-base leading-7" style={{ color: 'var(--brand-surface-muted)' }}>{parts.join(' · ')}</p>}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function renderSection(family: string, client: ClientConfig): ReactNode {
  switch (family) {
    case 'hero': return <Hero key={family} client={client} />;
    case 'about': return client.about ? <About key={family} client={client} /> : null;
    case 'offerings': return client.services?.length ? <Services key={family} client={client} /> : null;
    case 'visual': return client.galleryImages?.length ? <Gallery key={family} client={client} /> : null;
    case 'trust': return client.features?.length ? <Features key={family} client={client} /> : null;
    case 'location': return <LocationSection key={family} client={client} />;
    case 'conversion': return client.ctaText ? <CTA key={family} client={client} /> : null;
    case 'contact': return client.contact ? <Contact key={family} client={client} /> : null;
    case 'footer': return <Footer key={family} client={client} />;
    case 'faq': return null;
    default: return null;
  }
}

export default function TemplateV2Renderer({ client }: { client: ClientConfig }) {
  const profile = analyzeBusiness(client);
  const archetype = resolveIndustryArchetype(profile);
  const order = getTemplateV2SectionOrder(client);
  const classes = `template-v2 template-v2-${archetype.id} template-v2-${profile.primaryGoal}`;

  return (
    <div className={classes} data-archetype={archetype.id} data-goal={profile.primaryGoal}>
      <Navbar client={client} />
      <main>{order.map((family) => renderSection(family, client))}</main>
    </div>
  );
}
