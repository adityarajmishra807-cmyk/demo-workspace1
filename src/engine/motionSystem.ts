export type MotionIntensity = 'none' | 'subtle' | 'expressive';
export type MotionTrigger = 'load' | 'scroll' | 'hover' | 'focus';

export interface MotionPreset {
  name: string;
  trigger: MotionTrigger;
  durationMs: number;
  delayMs?: number;
  easing: string;
  distancePx?: number;
  once: boolean;
}

export interface MotionSystem {
  intensity: MotionIntensity;
  presets: MotionPreset[];
  accessibility: { reducedMotion: 'respect'; disableTransform: boolean };
}

const preset = (name: string, trigger: MotionTrigger, durationMs: number, distancePx: number, once = true): MotionPreset => ({
  name, trigger, durationMs, distancePx, once, easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
});

export function buildMotionSystem(intensity: MotionIntensity = 'subtle'): MotionSystem {
  const scale = intensity === 'expressive' ? 1.15 : intensity === 'none' ? 0 : 1;
  return {
    intensity,
    presets: [
      preset('fade-up', 'scroll', Math.round(600 * scale), 24),
      preset('fade-in', 'load', Math.round(500 * scale), 0),
      preset('image-reveal', 'scroll', Math.round(800 * scale), 0),
      preset('hover-lift', 'hover', Math.round(220 * scale), 6, false),
      preset('focus-lift', 'focus', Math.round(220 * scale), 4, false),
    ],
    accessibility: { reducedMotion: 'respect', disableTransform: true },
  };
}

export function motionCssVariables(system: MotionSystem): Record<string, string> {
  const scroll = system.presets.find((item) => item.name === 'fade-up');
  const hover = system.presets.find((item) => item.name === 'hover-lift');
  return {
    '--motion-duration': `${scroll?.durationMs ?? 600}ms`,
    '--motion-hover-duration': `${hover?.durationMs ?? 220}ms`,
    '--motion-distance': `${scroll?.distancePx ?? 24}px`,
    '--motion-ease': scroll?.easing ?? 'cubic-bezier(0.22, 1, 0.36, 1)',
  };
}
