import type { ClientConfig, FontStyle, TemplateId, BrandColors } from '@/types/client';

export function generateSlug(businessName: string): string {
  return businessName.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

export function generateId(businessName: string): string {
  const base = generateSlug(businessName);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export function ensureUniqueSlug(slug: string, exists: (slug: string, excludeId?: string) => boolean, excludeId?: string): string {
  if (!exists(slug, excludeId)) return slug;
  let i = 2;
  while (exists(`${slug}-${i}`, excludeId)) i++;
  return `${slug}-${i}`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace('#', '');
  const normalized = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return [parseInt(normalized.slice(0, 2), 16), parseInt(normalized.slice(2, 4), 16), parseInt(normalized.slice(4, 6), 16)];
}

function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;
  const channels = rgb.map((value) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function safeHex(value: string, fallback: string): string {
  return hexToRgb(value) ? (value.startsWith('#') ? value : `#${value}`) : fallback;
}

function readableAgainst(background: string, light: string, dark: string): string {
  return contrastRatio(light, background) >= contrastRatio(dark, background) ? light : dark;
}

function mix(a: string, b: string, amount: number): string {
  const first = hexToRgb(a)!;
  const second = hexToRgb(b)!;
  const t = Math.max(0, Math.min(1, amount));
  const channel = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${channel(first[0], second[0])}${channel(first[1], second[1])}${channel(first[2], second[2])}`;
}

function deriveBrandColors(partial: { primary: string; secondary: string; accent: string }): BrandColors {
  const primary = safeHex(partial.primary, '#111827');
  const secondary = safeHex(partial.secondary, '#f3f4f6');
  const accent = safeHex(partial.accent, '#b0893d');
  const pLum = relativeLuminance(primary);
  const sLum = relativeLuminance(secondary);

  let background: string;
  let surface: string;
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

  const text = readableAgainst(background, '#f8fafc', '#111827');
  const muted = readableAgainst(background, '#cbd5e1', '#64748b');
  return {
    primary,
    secondary,
    accent,
    background,
    surface,
    text,
    muted,
  };
}

interface FormToClientInput {
  id?: string;
  slug?: string;
  businessName: string;
  industry: string;
  location: string;
  description: string;
  services: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  website: string;
  tagline: string;
  headline: string;
  about: string;
  contactName: string;
  heroImage: string;
  galleryImages: string;
  template: TemplateId;
  fontStyle: FontStyle;
  brandColors: { primary: string; secondary: string; accent: string };
  ctaText: string;
}

function parseServices(text: string): ClientConfig['services'] {
  const names = text.split('\n').map((s) => s.trim()).filter(Boolean);
  return names.length ? names.map((name) => ({ name, description: '' })) : undefined;
}

function parseGalleryImages(text: string): ClientConfig['galleryImages'] {
  const urls = text.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  return urls.length ? urls.map((url) => ({ url, alt: 'Gallery image' })) : undefined;
}

export function formToClientConfig(form: FormToClientInput, slugChecker: (slug: string, excludeId?: string) => boolean, excludeId?: string): ClientConfig {
  const id = form.id || generateId(form.businessName);
  const baseSlug = form.slug || generateSlug(form.businessName) || id;
  const slug = ensureUniqueSlug(baseSlug, slugChecker, excludeId ?? form.id);
  const locationParts = form.location.split(',').map((s) => s.trim()).filter(Boolean);
  const description = form.description.trim();
  const about = form.about.trim() || description;

  return {
    id,
    slug,
    businessName: form.businessName.trim(),
    industry: form.industry.trim() || 'General',
    tagline: form.tagline.trim() || undefined,
    headline: form.headline.trim() || form.businessName.trim(),
    description: description || undefined,
    location: locationParts.length ? { city: locationParts[0], region: locationParts[1], country: locationParts[2], address: form.location || undefined } : undefined,
    about: about ? { heading: `About ${form.businessName.trim()}`, body: [about] } : undefined,
    services: parseServices(form.services),
    galleryImages: parseGalleryImages(form.galleryImages),
    heroImage: form.heroImage.trim() || undefined,
    features: undefined,
    contact: {
      contactName: form.contactName.trim() || undefined,
      phone: form.phone.trim() || undefined,
      email: form.email.trim() || undefined,
      whatsapp: form.whatsapp.trim() || undefined,
      instagram: form.instagram.trim() || undefined,
      website: form.website.trim() || undefined,
    },
    template: form.template,
    brandColors: deriveBrandColors(form.brandColors),
    fontStyle: form.fontStyle,
    ctaText: form.ctaText.trim() || 'Get in Touch',
    secondaryCtaText: 'View Services',
  };
}
