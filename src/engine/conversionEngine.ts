import type { BusinessGoal, BusinessProfile } from './businessIntelligence';
import type { IndustryArchetype } from './industryArchetypes';

export type ConversionPlacement = 'hero' | 'mid-page' | 'sticky' | 'final' | 'footer';
export interface ConversionAction { id: string; label: string; goal: BusinessGoal; placement: ConversionPlacement; priority: 'primary' | 'secondary'; hrefType: 'phone' | 'email' | 'whatsapp' | 'url' | 'anchor'; }
export interface ConversionPlan { primary: ConversionAction; secondary: ConversionAction[]; actions: ConversionAction[]; strategy: string[]; trustRequirements: string[]; }

const hrefTypeFor = (label: string, profile: BusinessProfile): ConversionAction['hrefType'] => {
  const lower = label.toLowerCase();
  if (/call|phone/i.test(lower) && profile.contact?.phone) return 'phone';
  if (/whatsapp/i.test(lower) && profile.contact?.whatsapp) return 'whatsapp';
  if (/email|enquir|contact/i.test(lower) && profile.contact?.email) return 'email';
  return 'anchor';
};

export function buildConversionPlan(profile: BusinessProfile, archetype: IndustryArchetype): ConversionPlan {
  const labels = archetype.ctaStrategy.length ? archetype.ctaStrategy : ['Contact Us'];
  const primary: ConversionAction = { id: 'primary-cta', label: labels[0], goal: profile.primaryGoal, placement: 'hero', priority: 'primary', hrefType: hrefTypeFor(labels[0], profile) };
  const secondary = labels.slice(1, 3).map((label, index): ConversionAction => ({ id: `secondary-cta-${index + 1}`, label, goal: profile.primaryGoal, placement: index === 0 ? 'mid-page' : 'final', priority: 'secondary', hrefType: hrefTypeFor(label, profile) }));
  return { primary, secondary, actions: [primary, ...secondary], strategy: ['Make the primary action visible without competing with the headline.', 'Repeat the primary conversion path after high-intent content.', 'Keep secondary actions contextual rather than decorative.', 'Use real contact destinations only when supplied by the client.'], trustRequirements: ['Do not fabricate reviews, guarantees, credentials, results, or urgency claims.', 'Only surface proof supplied by the client.'] };
}
