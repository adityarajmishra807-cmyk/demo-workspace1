import type { ClientConfig } from '@/types/client';
import { analyzeBusiness, type BusinessProfile } from './businessIntelligence';
import { resolveIndustryArchetype, type IndustryArchetype, type SectionFamily } from './industryArchetypes';

export type PageLength = 'compact' | 'standard' | 'long' | 'immersive';
export type ContentPriority = 'required' | 'recommended' | 'optional';

export interface SectionContentBudget {
  family: SectionFamily;
  priority: ContentPriority;
  minWords: number;
  maxWords: number;
  suggestedBlocks: number;
  reason: string;
}

export interface LongFormPlan {
  length: PageLength;
  targetSections: number;
  targetWords: number;
  sections: SectionContentBudget[];
  contentRules: string[];
  sourceCoverage: number;
}

const BASE_BUDGETS: Record<SectionFamily, Omit<SectionContentBudget, 'family' | 'reason'>> = {
  hero: { priority: 'required', minWords: 20, maxWords: 70, suggestedBlocks: 1 },
  about: { priority: 'recommended', minWords: 100, maxWords: 260, suggestedBlocks: 2 },
  offerings: { priority: 'required', minWords: 120, maxWords: 420, suggestedBlocks: 2 },
  visual: { priority: 'recommended', minWords: 20, maxWords: 100, suggestedBlocks: 1 },
  trust: { priority: 'recommended', minWords: 60, maxWords: 220, suggestedBlocks: 2 },
  conversion: { priority: 'required', minWords: 50, maxWords: 160, suggestedBlocks: 1 },
  location: { priority: 'recommended', minWords: 40, maxWords: 140, suggestedBlocks: 1 },
  faq: { priority: 'optional', minWords: 120, maxWords: 360, suggestedBlocks: 3 },
  contact: { priority: 'required', minWords: 40, maxWords: 120, suggestedBlocks: 1 },
  footer: { priority: 'required', minWords: 10, maxWords: 40, suggestedBlocks: 1 },
};

function chooseLength(profile: BusinessProfile, archetype: IndustryArchetype): PageLength {
  const sourceWords = profile.signals.sourceWordCount;
  if (archetype.design.contentDensity === 'rich' || sourceWords >= 180) return 'immersive';
  if (sourceWords >= 90 || profile.offerings.length >= 5) return 'long';
  if (sourceWords >= 40 || profile.offerings.length >= 2) return 'standard';
  return 'compact';
}

function scaleFor(length: PageLength): number {
  return { compact: 0.7, standard: 1, long: 1.25, immersive: 1.5 }[length];
}

function requiredFamilies(profile: BusinessProfile, archetype: IndustryArchetype): Set<SectionFamily> {
  const families = new Set<SectionFamily>(archetype.sectionPriority);
  families.add('hero');
  families.add('offerings');
  families.add('conversion');
  families.add('contact');
  families.add('footer');
  if (profile.location.hasLocation) families.add('location');
  if (profile.signals.hasAbout) families.add('about');
  if (profile.assets.galleryImages) families.add('visual');
  return families;
}

function reasonFor(family: SectionFamily, profile: BusinessProfile): string {
  if (family === 'hero') return 'Establish the business proposition and primary action immediately.';
  if (family === 'offerings') return profile.offerings.length ? 'Expand the supplied offerings without inventing unsupported services.' : 'Provide a clear place for verified offerings when supplied.';
  if (family === 'visual') return 'Use supplied visual assets to create pacing and demonstrate the business.';
  if (family === 'location') return 'Make supplied location information useful for local conversion.';
  if (family === 'trust') return profile.signals.hasSocialProof ? 'Surface verified proof supplied by the business.' : 'Reserve space for proof only when credible proof is available.';
  if (family === 'faq') return 'Answer recurring objections using verified business information only.';
  if (family === 'conversion') return `Reinforce the ${profile.primaryGoal.replace('_', ' ')} goal with a focused action.`;
  if (family === 'about') return 'Build context and differentiation from supplied business information.';
  if (family === 'contact') return 'Provide a direct path to the available contact channels.';
  return 'Close the page with essential navigation and business identity.';
}

function clampWords(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function buildLongFormPlan(client: ClientConfig, profile = analyzeBusiness(client)): LongFormPlan {
  const archetype = resolveIndustryArchetype(profile);
  const length = chooseLength(profile, archetype);
  const scale = scaleFor(length);
  const families = requiredFamilies(profile, archetype);
  const sections = archetype.sectionPriority
    .filter((family) => families.has(family))
    .map((family) => {
      const base = BASE_BUDGETS[family];
      const priority: ContentPriority = family === 'visual' && !profile.assets.galleryImages ? 'optional' : base.priority;
      return {
        family,
        priority,
        minWords: clampWords(base.minWords * scale, 10, 500),
        maxWords: clampWords(base.maxWords * scale, 20, 700),
        suggestedBlocks: Math.max(1, Math.round(base.suggestedBlocks * scale)),
        reason: reasonFor(family, profile),
      };
    });

  const targetSections = sections.length;
  const minTarget = sections.reduce((sum, section) => sum + section.minWords, 0);
  const maxTarget = sections.reduce((sum, section) => sum + section.maxWords, 0);
  const targetWords = Math.round((minTarget + maxTarget) / 2);
  const sourceCoverage = Math.min(1, profile.signals.sourceWordCount / Math.max(1, targetWords));

  return {
    length,
    targetSections,
    targetWords,
    sections,
    sourceCoverage,
    contentRules: [
      'Prefer supplied business facts over generic filler.',
      'Do not fabricate testimonials, credentials, prices, awards, guarantees, locations, or service claims.',
      'Use section budgets to create meaningful depth rather than repeating the same message.',
      'Keep the primary conversion goal visible at multiple natural decision points.',
      'Let available assets determine visual sections; never create fake portfolio or gallery content.',
      'Long pages should vary section composition and rhythm instead of becoming a stack of identical cards.',
    ],
  };
}

export function getSectionBudget(plan: LongFormPlan, family: SectionFamily): SectionContentBudget | undefined {
  return plan.sections.find((section) => section.family === family);
}

export function shouldUseSection(plan: LongFormPlan, family: SectionFamily): boolean {
  return Boolean(getSectionBudget(plan, family));
}
