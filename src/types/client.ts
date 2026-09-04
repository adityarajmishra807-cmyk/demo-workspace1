export type TemplateId =
  | 'luxury'
  | 'photography'
  | 'local-service'
  | 'restaurant'
  | 'professional';

export type FontStyle =
  | 'serif'
  | 'sans'
  | 'modern'
  | 'editorial';

export interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export interface GalleryImage {
  url?: string;
  alt: string;
  caption?: string;
}

export interface ServiceItem {
  name: string;
  description: string;
  image?: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface AboutContent {
  heading?: string;
  body: string[];
  image?: string;
}

export interface ContactInfo {
  contactName?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
}

export interface LocationInfo {
  city?: string;
  region?: string;
  country?: string;
  address?: string;
}

export interface ClientConfig {
  id: string;
  slug: string;
  businessName: string;
  logo?: string;
  industry: string;
  tagline?: string;
  headline?: string;
  description?: string;
  location?: LocationInfo;
  about?: AboutContent;
  services?: ServiceItem[];
  galleryImages?: GalleryImage[];
  heroImage?: string;
  features?: FeatureItem[];
  contact?: ContactInfo;
  template: TemplateId;
  brandColors: BrandColors;
  fontStyle: FontStyle;
  ctaText?: string;
  secondaryCtaText?: string;
  expiresAt?: string;
}

export interface ClientSummary {
  id: string;
  slug: string;
  businessName: string;
  industry: string;
  template: TemplateId;
  status: 'active' | 'draft';
}
