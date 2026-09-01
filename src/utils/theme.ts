import type { ClientConfig, BrandColors, FontStyle } from '@/types/client';

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
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
  root.style.setProperty('--brand-primary', colors.primary);
  root.style.setProperty('--brand-secondary', colors.secondary);
  root.style.setProperty('--brand-accent', colors.accent);
  root.style.setProperty('--brand-background', colors.background);
  root.style.setProperty('--brand-surface', colors.surface);
  root.style.setProperty('--brand-text', colors.text);
  root.style.setProperty('--brand-muted', colors.muted);
  root.style.setProperty('--brand-primary-rgb', rgbString(colors.primary));
  root.style.setProperty('--brand-secondary-rgb', rgbString(colors.secondary));
  root.style.setProperty('--brand-accent-rgb', rgbString(colors.accent));
  root.style.setProperty('--brand-text-rgb', rgbString(colors.text));
  root.style.setProperty('--brand-muted-rgb', rgbString(colors.muted));
  root.style.setProperty('--brand-accent-soft', withAlpha(colors.accent, 0.15));
  root.style.setProperty('--brand-accent-border', withAlpha(colors.accent, 0.4));
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
    '--brand-accent-rgb',
    '--brand-text-rgb',
    '--brand-muted-rgb',
    '--brand-accent-soft',
    '--brand-accent-border',
  ];
  props.forEach((p) => root.style.removeProperty(p));
  root.removeAttribute('data-font');
}
