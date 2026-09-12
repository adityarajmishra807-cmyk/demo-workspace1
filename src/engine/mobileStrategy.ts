export type MobileDensity = 'compact' | 'balanced' | 'immersive';
export type MobileNav = 'bottom' | 'top' | 'drawer';

export interface MobileStrategy {
  density: MobileDensity;
  navigation: MobileNav;
  content: {
    maxLineLength: number;
    minBodySize: number;
    sectionGap: string;
    horizontalPadding: string;
  };
  media: {
    defaultAspectRatio: string;
    fullBleed: boolean;
    preventLayoutShift: boolean;
  };
  interaction: {
    minimumTapTargetPx: number;
    stickyPrimaryCta: boolean;
    avoidHoverOnly: boolean;
  };
  accessibility: {
    respectReducedMotion: boolean;
    preserveFocusVisibility: boolean;
  };
}

export function buildMobileStrategy(density: MobileDensity = 'balanced', navigation: MobileNav = 'drawer'): MobileStrategy {
  return {
    density,
    navigation,
    content: {
      maxLineLength: 42,
      minBodySize: 16,
      sectionGap: density === 'compact' ? '3rem' : density === 'immersive' ? '5rem' : '4rem',
      horizontalPadding: '1.25rem',
    },
    media: { defaultAspectRatio: '4 / 3', fullBleed: true, preventLayoutShift: true },
    interaction: { minimumTapTargetPx: 44, stickyPrimaryCta: true, avoidHoverOnly: true },
    accessibility: { respectReducedMotion: true, preserveFocusVisibility: true },
  };
}

export function mobileCssVariables(strategy: MobileStrategy): Record<string, string> {
  return {
    '--mobile-content-width': `${strategy.content.maxLineLength}ch`,
    '--mobile-body-size': `${strategy.content.minBodySize}px`,
    '--mobile-section-gap': strategy.content.sectionGap,
    '--mobile-padding': strategy.content.horizontalPadding,
    '--mobile-tap-target': `${strategy.interaction.minimumTapTargetPx}px`,
    '--mobile-media-ratio': strategy.media.defaultAspectRatio,
  };
}
