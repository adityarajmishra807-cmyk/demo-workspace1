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

function deriveBrandColors(partial: { primary: string; secondary: string; accent: string }): BrandColors {
  return {
    primary: partial.primary,
    secondary: partial.secondary,
    accent: partial.accent,
    background: partial.primary,
    surface: partial.secondary,
    text: '#f5f5f5',
    muted: '#a0a0b0',
  };
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
