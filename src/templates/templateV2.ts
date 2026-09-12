import type { ClientConfig, TemplateId } from '@/types/client';
import { analyzeBusiness } from '@/engine/businessIntelligence';
import { resolveIndustryArchetype, type IndustryArchetypeId, type SectionFamily } from '@/engine/industryArchetypes';

export type TemplateV2Mode = 'portfolio' | 'editorial' | 'conversion' | 'hospitality' | 'product' | 'service';

export interface TemplateV2Blueprint {
  id: string;
  archetype: IndustryArchetypeId;
  template: TemplateId;
  mode: TemplateV2Mode;
  sectionOrder: SectionFamily[];
  visualPriority: 'image-led' | 'content-led' | 'conversion-led';
  preserveLegacyTemplate: boolean;
}

const BLUEPRINTS: Record<IndustryArchetypeId, Omit<TemplateV2Blueprint, 'archetype'>> = {
  'restaurant-cafe': { id: 'restaurant-v2', template: 'restaurant', mode: 'conversion', sectionOrder: ['hero', 'offerings', 'visual', 'about', 'location', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  'hotel-hospitality': { id: 'hospitality-v2', template: 'luxury', mode: 'hospitality', sectionOrder: ['hero', 'visual', 'about', 'offerings', 'location', 'trust', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  photography: { id: 'photography-v2', template: 'photography', mode: 'portfolio', sectionOrder: ['hero', 'visual', 'about', 'offerings', 'trust', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  'media-creator': { id: 'media-v2', template: 'photography', mode: 'editorial', sectionOrder: ['hero', 'visual', 'offerings', 'about', 'trust', 'conversion', 'contact', 'footer'], visualPriority: 'content-led', preserveLegacyTemplate: true },
  'salon-beauty': { id: 'beauty-v2', template: 'luxury', mode: 'conversion', sectionOrder: ['hero', 'offerings', 'visual', 'about', 'trust', 'location', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  'gym-fitness': { id: 'fitness-v2', template: 'local-service', mode: 'conversion', sectionOrder: ['hero', 'offerings', 'visual', 'about', 'trust', 'conversion', 'location', 'contact', 'footer'], visualPriority: 'conversion-led', preserveLegacyTemplate: true },
  'real-estate': { id: 'real-estate-v2', template: 'luxury', mode: 'product', sectionOrder: ['hero', 'visual', 'offerings', 'location', 'trust', 'about', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  'clinic-healthcare': { id: 'healthcare-v2', template: 'professional', mode: 'service', sectionOrder: ['hero', 'offerings', 'about', 'trust', 'location', 'faq', 'conversion', 'contact', 'footer'], visualPriority: 'content-led', preserveLegacyTemplate: true },
  'professional-service': { id: 'professional-v2', template: 'professional', mode: 'service', sectionOrder: ['hero', 'about', 'offerings', 'trust', 'faq', 'conversion', 'contact', 'footer'], visualPriority: 'content-led', preserveLegacyTemplate: true },
  'local-service': { id: 'local-service-v2', template: 'local-service', mode: 'conversion', sectionOrder: ['hero', 'offerings', 'trust', 'location', 'about', 'faq', 'conversion', 'contact', 'footer'], visualPriority: 'conversion-led', preserveLegacyTemplate: true },
  'creative-agency': { id: 'creative-v2', template: 'photography', mode: 'portfolio', sectionOrder: ['hero', 'visual', 'offerings', 'about', 'trust', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  retail: { id: 'retail-v2', template: 'luxury', mode: 'product', sectionOrder: ['hero', 'offerings', 'visual', 'about', 'location', 'conversion', 'contact', 'footer'], visualPriority: 'image-led', preserveLegacyTemplate: true },
  education: { id: 'education-v2', template: 'professional', mode: 'service', sectionOrder: ['hero', 'offerings', 'about', 'trust', 'faq', 'location', 'conversion', 'contact', 'footer'], visualPriority: 'content-led', preserveLegacyTemplate: true },
  general: { id: 'general-v2', template: 'luxury', mode: 'service', sectionOrder: ['hero', 'about', 'offerings', 'visual', 'trust', 'conversion', 'contact', 'footer'], visualPriority: 'content-led', preserveLegacyTemplate: true },
};

export function getTemplateV2Blueprint(client: ClientConfig): TemplateV2Blueprint {
  const profile = analyzeBusiness(client);
  const archetype = resolveIndustryArchetype(profile);
  return { archetype: archetype.id, ...BLUEPRINTS[archetype.id] };
}

export function resolveTemplateV2(client: ClientConfig): TemplateId {
  return getTemplateV2Blueprint(client).template;
}

export function getTemplateV2SectionOrder(client: ClientConfig): SectionFamily[] {
  return [...getTemplateV2Blueprint(client).sectionOrder];
}
