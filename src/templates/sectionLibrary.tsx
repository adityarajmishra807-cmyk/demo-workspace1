import type { ClientConfig } from '@/types/client';

export type SectionVariant = 'hero-editorial' | 'hero-split' | 'hero-minimal' | 'about-story' | 'about-split' | 'offerings-grid' | 'offerings-list' | 'offerings-featured' | 'visual-mosaic' | 'visual-marquee' | 'proof-grid' | 'proof-stats' | 'faq-stack' | 'location-panel' | 'conversion-banner' | 'contact-panel';
export interface SectionSpec { id: string; family: string; variant: SectionVariant; density: 'light' | 'medium' | 'rich'; imageRequired: boolean; }

export const SECTION_LIBRARY: SectionSpec[] = [
  { id: 'hero-editorial', family: 'hero', variant: 'hero-editorial', density: 'light', imageRequired: true },
  { id: 'hero-split', family: 'hero', variant: 'hero-split', density: 'medium', imageRequired: true },
  { id: 'hero-minimal', family: 'hero', variant: 'hero-minimal', density: 'light', imageRequired: false },
  { id: 'about-story', family: 'about', variant: 'about-story', density: 'medium', imageRequired: false },
  { id: 'about-split', family: 'about', variant: 'about-split', density: 'medium', imageRequired: true },
  { id: 'offerings-grid', family: 'offerings', variant: 'offerings-grid', density: 'rich', imageRequired: false },
  { id: 'offerings-list', family: 'offerings', variant: 'offerings-list', density: 'medium', imageRequired: false },
  { id: 'offerings-featured', family: 'offerings', variant: 'offerings-featured', density: 'rich', imageRequired: true },
  { id: 'visual-mosaic', family: 'visual', variant: 'visual-mosaic', density: 'rich', imageRequired: true },
  { id: 'visual-marquee', family: 'visual', variant: 'visual-marquee', density: 'medium', imageRequired: true },
  { id: 'proof-grid', family: 'trust', variant: 'proof-grid', density: 'medium', imageRequired: false },
  { id: 'proof-stats', family: 'trust', variant: 'proof-stats', density: 'light', imageRequired: false },
  { id: 'faq-stack', family: 'faq', variant: 'faq-stack', density: 'medium', imageRequired: false },
  { id: 'location-panel', family: 'location', variant: 'location-panel', density: 'medium', imageRequired: false },
  { id: 'conversion-banner', family: 'conversion', variant: 'conversion-banner', density: 'light', imageRequired: false },
  { id: 'contact-panel', family: 'contact', variant: 'contact-panel', density: 'medium', imageRequired: false },
];

export function selectSectionVariant(family: string, index: number, client: ClientConfig): SectionSpec | undefined {
  const candidates = SECTION_LIBRARY.filter((item) => item.family === family);
  if (!candidates.length) return undefined;
  const imageRich = (client.images?.length || 0) > 1;
  const preferred = imageRich && candidates.some((item) => item.imageRequired) ? candidates.filter((item) => item.imageRequired) : candidates;
  return preferred[index % preferred.length] || candidates[0];
}

export function sectionVariantClass(variant: SectionVariant): string {
  return `demo-section demo-section--${variant}`;
}
