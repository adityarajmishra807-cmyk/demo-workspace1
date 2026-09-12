import type { BusinessProfile } from './businessIntelligence';
import { resolveIndustryArchetype, type DesignDirection } from './industryArchetypes';

export type RadiusScale = 'sharp' | 'soft' | 'round';
export type ShadowScale = 'none' | 'subtle' | 'elevated';

export interface DesignTokens {
  typography: { heading: string; body: string; headingWeight: number; bodyWeight: number; displayTracking: string };
  spacing: { section: string; container: string; contentGap: string };
  shape: { radius: RadiusScale; cardRadius: string; buttonRadius: string };
  surface: { border: string; shadow: ShadowScale; overlay: string };
  motion: { duration: string; easing: string };
  direction: DesignDirection;
}

const typographyFor = (fontStyle?: string, visualLanguage: string[] = []) => {
  const source = `${fontStyle || ''} ${visualLanguage.join(' ')}`.toLowerCase();
  if (source.includes('editorial') || source.includes('luxury') || source.includes('refined')) return { heading: 'Playfair Display', body: 'Inter', headingWeight: 600, bodyWeight: 400, displayTracking: '-0.025em' };
  if (source.includes('modern') || source.includes('dynamic') || source.includes('energetic')) return { heading: 'Space Grotesk', body: 'DM Sans', headingWeight: 600, bodyWeight: 400, displayTracking: '-0.035em' };
  return { heading: 'Inter', body: 'Inter', headingWeight: 600, bodyWeight: 400, displayTracking: '-0.02em' };
};

export function createDesignTokens(profile: BusinessProfile): DesignTokens {
  const archetype = resolveIndustryArchetype(profile);
  const direction = archetype.design;
  const typography = typographyFor(profile.brandCharacter[0], direction.visualLanguage);
  const visual = direction.visualLanguage.join(' ').toLowerCase();
  const radius: RadiusScale = visual.includes('refined') || visual.includes('editorial') ? 'soft' : visual.includes('playful') ? 'round' : 'soft';
  const shadow: ShadowScale = direction.contentDensity === 'light' ? 'subtle' : 'elevated';
  return {
    typography,
    spacing: { section: direction.contentDensity === 'rich' ? 'clamp(5rem, 10vw, 9rem)' : 'clamp(4rem, 8vw, 7rem)', container: 'min(1280px, calc(100vw - 3rem))', contentGap: direction.contentDensity === 'rich' ? '2rem' : '1.5rem' },
    shape: { radius, cardRadius: radius === 'round' ? '1.5rem' : radius === 'soft' ? '0.75rem' : '0', buttonRadius: radius === 'round' ? '999px' : radius === 'soft' ? '0.5rem' : '0.125rem' },
    surface: { border: '1px solid rgb(var(--brand-text-rgb) / 0.12)', shadow, overlay: 'rgb(0 0 0 / 0.38)' },
    motion: { duration: '650ms', easing: 'cubic-bezier(.22,1,.36,1)' },
    direction,
  };
}

export function designTokensToCss(tokens: DesignTokens): string {
  return `--ds-section-space:${tokens.spacing.section};--ds-container:${tokens.spacing.container};--ds-content-gap:${tokens.spacing.contentGap};--ds-heading-font:${tokens.typography.heading},system-ui,sans-serif;--ds-body-font:${tokens.typography.body},system-ui,sans-serif;--ds-heading-weight:${tokens.typography.headingWeight};--ds-body-weight:${tokens.typography.bodyWeight};--ds-display-tracking:${tokens.typography.displayTracking};--ds-card-radius:${tokens.shape.cardRadius};--ds-button-radius:${tokens.shape.buttonRadius};--ds-motion-duration:${tokens.motion.duration};--ds-motion-easing:${tokens.motion.easing};`;
}
