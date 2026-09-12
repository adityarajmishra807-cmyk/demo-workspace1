import type { ClientConfig } from '@/types/client';
import type { IndustryArchetype } from './industryArchetypes';

export type ContentPriority = 'required' | 'recommended' | 'optional';
export type ContentSource = 'client' | 'derived' | 'placeholder';

export interface ContentField {
  key: string;
  label: string;
  value?: string;
  priority: ContentPriority;
  source: ContentSource;
  wordBudget: number;
  allowGeneration: boolean;
}

export interface ContentPlan {
  fields: ContentField[];
  totalSourceWords: number;
  coverageScore: number;
  missingRequired: string[];
  generationPolicy: {
    neverInvent: string[];
    safeToExpand: string[];
  };
}

const clean = (value: unknown): string => typeof value === 'string' ? value.trim() : '';
const words = (value: string): number => clean(value).split(/\s+/).filter(Boolean).length;

function field(key: string, label: string, value: string | undefined, priority: ContentPriority, wordBudget: number, allowGeneration: boolean): ContentField {
  return { key, label, value: clean(value) || undefined, priority, source: clean(value) ? 'client' : 'placeholder', wordBudget, allowGeneration };
}

export function buildContentPlan(client: ClientConfig, archetype: IndustryArchetype): ContentPlan {
  const about = client.about?.body?.filter(Boolean).join('\n\n') || '';
  const services = (client.services || []).map((service) => [service.name, service.description].filter(Boolean).join(': ')).join('\n');
  const contact = [client.contact?.phone, client.contact?.email, client.contact?.whatsapp].filter(Boolean).join(' | ');
  const sourceWords = words([client.businessName, client.description, about, services, contact].filter(Boolean).join(' '));

  const fields: ContentField[] = [
    field('hero.headline', 'Hero headline', client.businessName, 'required', 12, false),
    field('hero.description', 'Hero description', client.description, 'required', 45, true),
    field('about.body', 'About', about, 'recommended', 180, true),
    field('offerings', 'Offerings', services, 'required', Math.max(120, (client.services || []).length * 45), true),
    field('primaryCta', 'Primary CTA', client.ctaText, 'required', 6, false),
    field('secondaryCta', 'Secondary CTA', client.secondaryCtaText, 'recommended', 8, false),
    field('contact', 'Contact information', contact, 'required', 40, false),
  ];

  const missingRequired = fields.filter((item) => item.priority === 'required' && !item.value).map((item) => item.key);
  const available = fields.filter((item) => item.value).length;
  const coverageScore = Math.round((available / fields.length) * 100);

  return {
    fields,
    totalSourceWords: sourceWords,
    coverageScore,
    missingRequired,
    generationPolicy: {
      neverInvent: ['prices', 'reviews/testimonials', 'credentials', 'awards', 'locations', 'opening hours', 'statistics', 'customer results', 'claims of expertise'],
      safeToExpand: ['headings', 'transitions', 'benefit framing based on supplied offerings', 'CTA microcopy', 'section introductions', 'descriptive structure that does not add new facts'],
    },
  };
}

export function contentDepthFor(plan: ContentPlan, archetype: IndustryArchetype): 'compact' | 'standard' | 'rich' {
  if (plan.coverageScore < 45) return 'compact';
  if (archetype.design.contentDensity === 'rich' || plan.totalSourceWords > 300) return 'rich';
  return 'standard';
}
