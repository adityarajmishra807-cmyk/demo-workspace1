import type { BusinessProfile, ClientConfig } from '@/types/client';

const normalize = (value: string | undefined): string => (value || '').trim().toLowerCase();
const words = (value: string): string[] => normalize(value).split(/[^a-z0-9]+/).filter(Boolean);

const containsAny = (source: string, terms: string[]): boolean => terms.some((term) => source.includes(term));

const INDUSTRY_RULES: Array<{ name: string; terms: string[] }> = [
  { name: 'Restaurant / Cafe', terms: ['restaurant', 'cafe', 'café', 'bakery', 'bistro', 'diner', 'bar', 'coffee', 'food', 'kitchen'] },
  { name: 'Hotel / Hospitality', terms: ['hotel', 'resort', 'hostel', 'homestay', 'hospitality', 'villa', 'stay', 'lodging'] },
  { name: 'Photography', terms: ['photographer', 'photography', 'photo studio', 'wedding photography'] },
  { name: 'Media / Creator', terms: ['creator', 'podcast', 'media', 'publication', 'youtube', 'content studio', 'journalist'] },
  { name: 'Salon / Beauty', terms: ['salon', 'beauty', 'spa', 'barber', 'hair', 'makeup', 'nail'] },
  { name: 'Gym / Fitness', terms: ['gym', 'fitness', 'yoga', 'pilates', 'crossfit', 'trainer', 'wellness'] },
  { name: 'Real Estate', terms: ['real estate', 'realtor', 'property', 'properties', 'broker', 'estate agent'] },
  { name: 'Clinic / Healthcare', terms: ['clinic', 'doctor', 'dental', 'dentist', 'healthcare', 'medical', 'physio', 'therapy'] },
  { name: 'Professional Service', terms: ['law', 'lawyer', 'legal', 'accounting', 'accountant', 'consulting', 'consultant', 'finance', 'architect'] },
  { name: 'Creative Agency', terms: ['agency', 'branding', 'design studio', 'creative studio', 'marketing agency'] },
  { name: 'Retail', terms: ['retail', 'store', 'shop', 'boutique', 'jewelry', 'jewellery', 'fashion'] },
  { name: 'Education', terms: ['school', 'college', 'academy', 'education', 'institute', 'tutor', 'coaching'] },
  { name: 'Local Service', terms: ['plumber', 'electrician', 'cleaning', 'repair', 'contractor', 'carpenter', 'service'] },
];

const DEFAULT_GOALS: Record<string, BusinessProfile['primaryGoal']> = {
  'Restaurant / Cafe': 'visit_or_order',
  'Hotel / Hospitality': 'booking',
  Photography: 'enquiry',
  'Media / Creator': 'discover',
  'Salon / Beauty': 'booking',
  'Gym / Fitness': 'enquiry',
  'Real Estate': 'enquiry',
  'Clinic / Healthcare': 'booking',
  'Professional Service': 'consultation',
  'Creative Agency': 'enquiry',
  Retail: 'visit_or_order',
  Education: 'enquiry',
  'Local Service': 'enquiry',
  General: 'contact',
};

function inferIndustry(client: ClientConfig): { label: string; confidence: BusinessProfile['confidence'] } {
  const source = `${client.industry} ${client.businessName} ${client.description || ''} ${(client.services || []).map((service) => `${service.name} ${service.description}`).join(' ')}`.toLowerCase();
  const explicit = normalize(client.industry);
  const rule = INDUSTRY_RULES.find(({ terms }) => containsAny(source, terms));
  if (explicit && explicit !== 'general') return { label: client.industry.trim(), confidence: 'high' };
  if (rule) return { label: rule.name, confidence: 'medium' };
  return { label: 'General', confidence: 'low' };
}

function inferAudience(client: ClientConfig, industry: string): string[] {
  const source = `${client.description || ''} ${(client.services || []).map((service) => `${service.name} ${service.description}`).join(' ')}`.toLowerCase();
  const audiences: string[] = [];
  if (containsAny(source, ['wedding', 'bridal', 'couple'])) audiences.push('Couples / wedding clients');
  if (containsAny(source, ['corporate', 'business', 'b2b', 'company'])) audiences.push('Businesses / organizations');
  if (containsAny(source, ['family', 'children', 'kids'])) audiences.push('Families');
  if (containsAny(source, ['student', 'students', 'learner'])) audiences.push('Students / learners');
  if (containsAny(source, ['luxury', 'premium', 'high-end'])) audiences.push('Premium customers');
  if (!audiences.length) {
    const defaults: Record<string, string> = {
      'Restaurant / Cafe': 'Local diners and visitors',
      'Hotel / Hospitality': 'Guests and travelers',
      Photography: 'People and organizations seeking photography',
      'Media / Creator': 'Viewers, readers, and followers',
      'Salon / Beauty': 'Clients seeking beauty and grooming services',
      'Gym / Fitness': 'People seeking fitness and wellness services',
      'Real Estate': 'Property buyers, sellers, or renters',
      'Clinic / Healthcare': 'Patients and caregivers',
      'Professional Service': 'Clients seeking specialist expertise',
      'Creative Agency': 'Brands and organizations seeking creative services',
      Retail: 'Local and online shoppers',
      Education: 'Students and learners',
      'Local Service': 'Local customers needing practical services',
    };
    audiences.push(defaults[industry] || 'Prospective customers');
  }
  return audiences;
}

function inferConversionGoal(client: ClientConfig, industry: string): BusinessProfile['primaryGoal'] {
  const source = `${client.ctaText || ''} ${client.secondaryCtaText || ''} ${client.description || ''}`.toLowerCase();
  if (containsAny(source, ['book', 'booking', 'appointment', 'reserve'])) return 'booking';
  if (containsAny(source, ['order', 'shop', 'buy'])) return 'visit_or_order';
  if (containsAny(source, ['consult', 'consultation'])) return 'consultation';
  if (containsAny(source, ['enquir', 'quote', 'request'])) return 'enquiry';
  return DEFAULT_GOALS[industry] || 'contact';
}

function assetAvailability(client: ClientConfig): BusinessProfile['assets'] {
  const galleryCount = (client.galleryImages || []).filter((image) => Boolean(image.url)).length;
  return {
    heroImage: Boolean(client.heroImage),
    galleryImages: galleryCount > 0,
    galleryCount,
    logo: Boolean(client.logo),
    serviceImages: (client.services || []).filter((service) => Boolean(service.image)).length,
    contactChannels: [client.contact?.phone, client.contact?.email, client.contact?.whatsapp, client.contact?.instagram, client.contact?.website].filter(Boolean).length,
  };
}

function extractLocation(client: ClientConfig): BusinessProfile['location'] {
  const location = client.location;
  return {
    city: location?.city,
    region: location?.region,
    country: location?.country,
    address: location?.address,
    hasLocation: Boolean(location?.city || location?.region || location?.country || location?.address),
  };
}

export function analyzeBusiness(client: ClientConfig): BusinessProfile {
  const industry = inferIndustry(client);
  const audience = inferAudience(client, industry.label);
  const primaryGoal = inferConversionGoal(client, industry.label);
  const services = (client.services || []).map((service) => service.name.trim()).filter(Boolean);
  const sourceText = [client.businessName, client.industry, client.description, client.about?.body.join(' '), services.join(' ')].filter(Boolean).join(' ');

  return {
    industry: industry.label,
    confidence: industry.confidence,
    audience,
    offerings: services,
    primaryGoal,
    brandCharacter: [client.fontStyle, client.template].filter(Boolean),
    assets: assetAvailability(client),
    location: extractLocation(client),
    signals: {
      hasDescription: Boolean(client.description?.trim()),
      hasAbout: Boolean(client.about?.body?.some((paragraph) => paragraph.trim())),
      hasServices: services.length > 0,
      hasContact: Boolean(client.contact && Object.values(client.contact).some(Boolean)),
      hasSocialProof: false,
      sourceWordCount: words(sourceText).length,
    },
  };
}

export function withBusinessProfile(client: ClientConfig): ClientConfig {
  return { ...client, businessProfile: analyzeBusiness(client) };
}
