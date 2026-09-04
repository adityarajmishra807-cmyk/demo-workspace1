import type { ClientConfig, BrandColors, FontStyle } from '@/types/client';

const WHITE = '#f8fafc';
const INK = '#111827';
const LIGHT_MUTED = '#64748b';
const DARK_MUTED = '#cbd5e1';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}

function isValidHex(hex: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim());
}

function normalizeHex(hex: string, fallback: string): string {
  return isValidHex(hex) ? hex.trim() : fallback;
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string): number {
  const first = luminance(a);
  const second = luminance(b);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

function readableAgainst(background: string, light: string, dark: string): string {
  return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark;
}

function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mix(a: string, b: string, amount: number): string {
  const first = hexToRgb(a);
  const second = hexToRgb(b);
  const t = Math.max(0, Math.min(1, amount));
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${channel(first.r, second.r)}${channel(first.g, second.g)}${channel(first.b, second.b)}`;
}

function deriveSemanticPalette(colors: Pick<BrandColors, 'primary' | 'secondary' | 'accent'>) {
  const primary = normalizeHex(colors.primary, '#111827');
  const secondary = normalizeHex(colors.secondary, '#f3f4f6');
  const accent = normalizeHex(colors.accent, '#b0893d');
  const pLum = luminance(primary);
  const sLum = luminance(secondary);

  let background: string;
  let surface: string;

  // Always establish a coherent two-surface system. Never place light text on a light
  // surface or dark text on a dark surface simply because Gemini returned two brand colors.
  if (pLum < 0.45 && sLum > 0.55) {
    background = primary;
    surface = secondary;
  } else if (pLum > 0.55 && sLum < 0.45) {
    background = secondary;
    surface = primary;
  } else if (pLum > 0.55 && sLum > 0.55) {
    background = mix(primary, '#ffffff', 0.78);
    surface = mix(secondary, '#ffffff', 0.58);
  } else if (pLum < 0.45 && sLum < 0.45) {
    background = pLum <= sLum ? primary : secondary;
    const lighter = pLum <= sLum ? secondary : primary;
    surface = mix(lighter, '#ffffff', 0.08);
  } else {
    background = pLum <= sLum ? primary : secondary;
    surface = pLum <= sLum ? secondary : primary;
  }

  const backgroundText = readableAgainst(background, WHITE, INK);
  const surfaceText = readableAgainst(surface, WHITE, INK);
  const backgroundMuted = contrastRatio(DARK_MUTED, background) >= contrastRatio(LIGHT_MUTED, background) ? DARK_MUTED : LIGHT_MUTED;
  const surfaceMuted = contrastRatio(DARK_MUTED, surface) >= contrastRatio(LIGHT_MUTED, surface) ? DARK_MUTED : LIGHT_MUTED;
  const onAccent = readableAgainst(accent, WHITE, INK);

  return { primary, secondary, accent, background, surface, backgroundText, surfaceText, backgroundMuted, surfaceMuted, onAccent };
}

export function applyBrandTheme(colors: BrandColors): void {
  const root = document.documentElement;
  const palette = deriveSemanticPalette(colors);

  root.style.setProperty('--brand-primary', palette.primary);
  root.style.setProperty('--brand-secondary', palette.secondary);
  root.style.setProperty('--brand-accent', palette.accent);
  root.style.setProperty('--brand-background', palette.background);
  root.style.setProperty('--brand-surface', palette.surface);
  root.style.setProperty('--brand-background-text', palette.backgroundText);
  root.style.setProperty('--brand-background-muted', palette.backgroundMuted);
  root.style.setProperty('--brand-surface-text', palette.surfaceText);
  root.style.setProperty('--brand-surface-muted', palette.surfaceMuted);
  // Backwards-compatible aliases for components that still use generic tokens.
  root.style.setProperty('--brand-text', palette.backgroundText);
  root.style.setProperty('--brand-muted', palette.backgroundMuted);
  root.style.setProperty('--brand-primary-rgb', rgbString(palette.primary));
  root.style.setProperty('--brand-secondary-rgb', rgbString(palette.secondary));
  root.style.setProperty('--brand-background-rgb', rgbString(palette.background));
  root.style.setProperty('--brand-surface-rgb', rgbString(palette.surface));
  root.style.setProperty('--brand-accent-rgb', rgbString(palette.accent));
  root.style.setProperty('--brand-text-rgb', rgbString(palette.backgroundText));
  root.style.setProperty('--brand-muted-rgb', rgbString(palette.backgroundMuted));
  root.style.setProperty('--brand-background-text-rgb', rgbString(palette.backgroundText));
  root.style.setProperty('--brand-background-muted-rgb', rgbString(palette.backgroundMuted));
  root.style.setProperty('--brand-surface-text-rgb', rgbString(palette.surfaceText));
  root.style.setProperty('--brand-surface-muted-rgb', rgbString(palette.surfaceMuted));
  root.style.setProperty('--brand-accent-soft', withAlpha(palette.accent, 0.15));
  root.style.setProperty('--brand-accent-border', withAlpha(palette.accent, 0.4));
  root.style.setProperty('--brand-on-accent', palette.onAccent);
}

export function applyFontStyle(font: FontStyle): void {
  document.documentElement.setAttribute('data-font', font);
}

export function applyClientTheme(client: ClientConfig): void {
  applyBrandTheme(client.brandColors);
  applyFontStyle(client.fontStyle);
}

export function resetTheme(): void {
  const root = document.documentElement;
  [
    '--brand-primary','--brand-secondary','--brand-accent','--brand-background','--brand-surface','--brand-background-text','--brand-background-muted',
    '--brand-surface-text','--brand-surface-muted','--brand-text','--brand-muted','--brand-primary-rgb','--brand-secondary-rgb','--brand-background-rgb',
    '--brand-surface-rgb','--brand-accent-rgb','--brand-text-rgb','--brand-muted-rgb','--brand-background-text-rgb','--brand-background-muted-rgb',
    '--brand-surface-text-rgb','--brand-surface-muted-rgb','--brand-accent-soft','--brand-accent-border','--brand-on-accent',
  ].forEach((property) => root.style.removeProperty(property));
  root.removeAttribute('data-font');
}
