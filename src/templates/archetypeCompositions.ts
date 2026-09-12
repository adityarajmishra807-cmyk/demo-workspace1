import type { IndustryArchetype } from '@/engine/industryArchetypes';
import type { SectionVariant } from './sectionLibrary';

export interface ArchetypeComposition { id: string; variants: SectionVariant[]; principles: string[]; }

const compositions: Record<string, ArchetypeComposition> = {
  restaurant: { id: 'restaurant', variants: ['hero-editorial','offerings-featured','visual-mosaic','about-story','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['food-first imagery','fast reservation or order path','menu before generic company copy'] },
  hotel: { id: 'hotel', variants: ['hero-editorial','about-split','offerings-featured','visual-mosaic','proof-grid','location-panel','faq-stack','conversion-banner','contact-panel'], principles: ['immersive photography','experience-led storytelling','location and booking visibility'] },
  photography: { id: 'photography', variants: ['hero-minimal','visual-mosaic','about-split','offerings-list','visual-marquee','proof-grid','conversion-banner','contact-panel'], principles: ['portfolio-first','large imagery','minimal interruption around work'] },
  media: { id: 'media', variants: ['hero-editorial','visual-marquee','offerings-list','about-story','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['editorial hierarchy','content discovery','clear audience value'] },
  salon: { id: 'salon', variants: ['hero-split','offerings-grid','visual-mosaic','about-story','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['service discovery','visual atmosphere','appointment-first conversion'] },
  gym: { id: 'gym', variants: ['hero-split','offerings-grid','about-story','proof-stats','visual-mosaic','faq-stack','conversion-banner','contact-panel'], principles: ['action-oriented hierarchy','program clarity','low-friction enquiry'] },
  real_estate: { id: 'real-estate', variants: ['hero-editorial','visual-mosaic','offerings-featured','offerings-list','location-panel','proof-grid','conversion-banner','contact-panel'], principles: ['property imagery','listing discovery','location and enquiry prominence'] },
  clinic: { id: 'clinic', variants: ['hero-split','about-story','offerings-grid','proof-grid','faq-stack','location-panel','conversion-banner','contact-panel'], principles: ['clarity and trust','service discoverability','accessible contact path'] },
  professional_service: { id: 'professional-service', variants: ['hero-minimal','about-story','offerings-list','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['authority without hype','scannable expertise','consultation-first conversion'] },
  local_service: { id: 'local-service', variants: ['hero-split','offerings-grid','proof-grid','location-panel','faq-stack','conversion-banner','contact-panel'], principles: ['local intent','service clarity','contact-first conversion'] },
  creative_agency: { id: 'creative-agency', variants: ['hero-editorial','visual-mosaic','about-split','offerings-featured','visual-marquee','proof-grid','conversion-banner','contact-panel'], principles: ['work-led storytelling','strong visual rhythm','case-study hierarchy'] },
  retail: { id: 'retail', variants: ['hero-editorial','offerings-featured','visual-mosaic','offerings-grid','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['product discovery','visual merchandising','purchase or enquiry path'] },
  education: { id: 'education', variants: ['hero-split','about-story','offerings-grid','proof-grid','faq-stack','location-panel','conversion-banner','contact-panel'], principles: ['program clarity','trust only when supplied','enquiry-first conversion'] },
  general: { id: 'general', variants: ['hero-split','about-story','offerings-grid','proof-grid','faq-stack','conversion-banner','contact-panel'], principles: ['clarity','balanced hierarchy','simple conversion path'] },
};

export function compositionFor(archetype: IndustryArchetype): ArchetypeComposition { return compositions[archetype.id] || compositions.general; }
