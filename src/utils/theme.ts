import type { ClientConfig, BrandColors, FontStyle } from '@/types/client';

const LIGHT_TEXT = '#f8fafc';
const DARK_TEXT = '#111827';
const LIGHT_MUTED = '#cbd5e1';
const DARK_MUTED = '#4b5563';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

function isValidHex(hex: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim());
}

function normalizeHex(hex: string, fallback: string): string {
  return isValidHex(hex) ? hex.trim() : fallback;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channels = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string): number {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

function bestReadableColor(backgrounds: string[], light: string, dark: string): string {
  const lightScore = Math.min(...backgrounds.map((background) => contrastRatio(light, background)));
  const darkScore = Math.min(...backgrounds.map((background) => contrastRatio(dark, background)));
  return lightScore >= darkScore ? light : dark;
}

function rgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyBrandTheme(colors: BrandColors): void {
  const root = document.documentElement;

  // Gemini supplies the three brand colors. Derive the semantic surface and
  // typography tokens from them so light palettes never inherit white text and
  // dark palettes never inherit low-contrast dark text.
  const primary = normalizeHex(colors.primary, '#1a1a2e');
  const secondary = normalizeHex(colors.secondary, '#16213e');
  const accent = normalizeHex(colors.accent, '#c9a227');
  const readableText = bestReadableColor([primary, secondary], LIGHT_TEXT, DARK_TEXT);
  const readableMuted = bestReadableColor([primary, secondary], LIGHT_MUTED, DARK_MUTED);
  const onAccent = contrastRatio('#ffffff', accent) >= contrastRatio('#111111', accent) ? '#ffffff' : '#111111';

  root.style.setProperty('--brand-primary', primary);
  root.style.setProperty('--brand-secondary', secondary);
  root.style.setProperty('--brand-accent', accent);
  root.style.setProperty('--brand-background', primary);
  root.style.setProperty('--brand-surface', secondary);
  root.style.setProperty('--brand-text', readableText);
  root.style.setProperty('--brand-muted', readableMuted);
  root.style.setProperty('--brand-primary-rgb', rgbString(primary));
  root.style.setProperty('--brand-secondary-rgb', rgbString(secondary));
  root.style.setProperty('--brand-background-rgb', rgbString(primary));
  root.style.setProperty('--brand-accent-rgb', rgbString(accent));
  root.style.setProperty('--brand-text-rgb', rgbString(readableText));
  root.style.setProperty('--brand-muted-rgb', rgbString(readableMuted));
  root.style.setProperty('--brand-accent-soft', withAlpha(accent, 0.15));
  root.style.setProperty('--brand-accent-border', withAlpha(accent, 0.4));
  root.style.setProperty('--brand-on-accent', onAccent);
}

export function applyFontStyle(font: FontStyle): void {
  const root = document.documentElement;
  root.setAttribute('data-font', font);
}

export function applyClientTheme(client: ClientConfig): void {
  applyBrandTheme(client.brandColors);
  applyFontStyle(client.fontStyle);
}

export function resetTheme(): void {
  const root = document.documentElement;
  const props = [
    '--brand-primary',
    '--brand-secondary',
    '--brand-accent',
    '--brand-background',
    '--brand-surface',
    '--brand-text',
    '--brand-muted',
    '--brand-primary-rgb',
    '--brand-secondary-rgb',
    '--brand-background-rgb',
    '--brand-accent-rgb',
    '--brand-text-rgb',
    '--brand-muted-rgb',
    '--brand-accent-soft',
    '--brand-accent-border',
    '--brand-on-accent',
  ];
  props.forEach((p) => root.style.removeProperty(p));
  root.removeAttribute('data-font');
}
