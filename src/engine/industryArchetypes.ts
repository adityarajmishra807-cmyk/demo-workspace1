import type { BusinessGoal, BusinessProfile } from './businessIntelligence';

export type IndustryArchetypeId =
  | 'restaurant-cafe'
  | 'hotel-hospitality'
  | 'photography'
  | 'media-creator'
  | 'salon-beauty'
  | 'gym-fitness'
  | 'real-estate'
  | 'clinic-healthcare'
  | 'professional-service'
  | 'local-service'
  | 'creative-agency'
  | 'retail'
  | 'education'
  | 'general';

export type SectionFamily =
  | 'hero'
  | 'about'
  | 'offerings'
  | 'visual'
  | 'trust'
  | 'conversion'
  | 'location'
  | 'faq'
  | 'contact'
  | 'footer';

export type DesignDirection = {
  visualLanguage: string[];
  layoutPrinciples: string[];
  contentDensity: 'light' | 'medium' | 'rich';
  imagePriority: 'low' | 'medium' | 'high';
};

export interface IndustryArchetype {
  id: IndustryArchetypeId;
  name: string;
  aliases: string[];
  sectionPriority: SectionFamily[];
  design: DesignDirection;
  imageNeeds: string[];
  primaryGoal: BusinessGoal;
  ctaStrategy: string[];
}

const ARCHETYPES: IndustryArchetype[] = [
  {
    id: 'restaurant-cafe', name: 'Restaurant / Cafe', aliases: ['restaurant', 'cafe', 'food'],
    sectionPriority: ['hero', 'offerings', 'visual', 'about', 'location', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['food-first', 'warm', 'editorial'], layoutPrinciples: ['large food photography', 'menu-led hierarchy', 'short scannable copy'], contentDensity: 'medium', imagePriority: 'high' },
    imageNeeds: ['hero food/interior', 'signature dishes', 'menu or offering imagery', 'atmosphere/gallery', 'location context'], primaryGoal: 'visit_or_order',
    ctaStrategy: ['View Menu', 'Order Now', 'Reserve a Table', 'Get Directions'],
  },
  {
    id: 'hotel-hospitality', name: 'Hotel / Hospitality', aliases: ['hotel', 'hospitality', 'resort', 'stay'],
    sectionPriority: ['hero', 'visual', 'about', 'offerings', 'location', 'trust', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['immersive', 'refined', 'destination-led'], layoutPrinciples: ['cinematic imagery', 'experience storytelling', 'clear booking path'], contentDensity: 'rich', imagePriority: 'high' },
    imageNeeds: ['property hero', 'rooms', 'amenities', 'experiences', 'destination/location'], primaryGoal: 'booking',
    ctaStrategy: ['Book Your Stay', 'Check Availability', 'Explore Rooms', 'Contact Us'],
  },
  {
    id: 'photography', name: 'Photography', aliases: ['photographer', 'photography', 'photo studio'],
    sectionPriority: ['hero', 'visual', 'about', 'offerings', 'trust', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['portfolio-first', 'editorial', 'expressive'], layoutPrinciples: ['image-led rhythm', 'minimal chrome', 'strong cropping'], contentDensity: 'light', imagePriority: 'high' },
    imageNeeds: ['signature work', 'portfolio gallery', 'featured project', 'portrait/team image'], primaryGoal: 'enquiry',
    ctaStrategy: ['View Portfolio', 'Enquire About a Shoot', 'Start a Project'],
  },
  {
    id: 'media-creator', name: 'Media / Creator', aliases: ['media', 'creator', 'podcast', 'publication'],
    sectionPriority: ['hero', 'visual', 'offerings', 'about', 'trust', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['editorial', 'dynamic', 'content-led'], layoutPrinciples: ['featured story hierarchy', 'content discovery', 'social-first actions'], contentDensity: 'rich', imagePriority: 'high' },
    imageNeeds: ['featured work', 'content thumbnails', 'creator portrait', 'brand/social imagery'], primaryGoal: 'discover',
    ctaStrategy: ['Explore Work', 'Watch / Listen', 'Follow', 'Collaborate'],
  },
  {
    id: 'salon-beauty', name: 'Salon / Beauty', aliases: ['salon', 'beauty', 'spa', 'barber'],
    sectionPriority: ['hero', 'offerings', 'visual', 'about', 'trust', 'location', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['calm', 'premium', 'sensory'], layoutPrinciples: ['service clarity', 'before/after or work imagery when supplied', 'frictionless booking'], contentDensity: 'medium', imagePriority: 'high' },
    imageNeeds: ['hero space/work', 'service imagery', 'results/work gallery', 'interior'], primaryGoal: 'booking',
    ctaStrategy: ['Book Appointment', 'View Services', 'Call Now', 'Get Directions'],
  },
  {
    id: 'gym-fitness', name: 'Gym / Fitness', aliases: ['gym', 'fitness', 'yoga', 'pilates', 'wellness'],
    sectionPriority: ['hero', 'offerings', 'visual', 'about', 'trust', 'conversion', 'location', 'contact', 'footer'],
    design: { visualLanguage: ['energetic', 'confident', 'functional'], layoutPrinciples: ['action-oriented hierarchy', 'clear programs', 'strong imagery without clutter'], contentDensity: 'medium', imagePriority: 'high' },
    imageNeeds: ['training hero', 'program imagery', 'facility', 'coach/team'], primaryGoal: 'enquiry',
    ctaStrategy: ['Join / Enquire', 'View Programs', 'Book a Session', 'Visit Us'],
  },
  {
    id: 'real-estate', name: 'Real Estate', aliases: ['real estate', 'realtor', 'property'],
    sectionPriority: ['hero', 'visual', 'offerings', 'location', 'trust', 'about', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['property-led', 'confident', 'clean'], layoutPrinciples: ['large property imagery', 'location context', 'fast enquiry path'], contentDensity: 'rich', imagePriority: 'high' },
    imageNeeds: ['featured property', 'property gallery', 'neighborhood/location', 'agent/team'], primaryGoal: 'enquiry',
    ctaStrategy: ['Enquire About Property', 'View Properties', 'Schedule a Viewing', 'Contact Agent'],
  },
  {
    id: 'clinic-healthcare', name: 'Clinic / Healthcare', aliases: ['clinic', 'healthcare', 'medical', 'doctor', 'dental'],
    sectionPriority: ['hero', 'offerings', 'about', 'trust', 'location', 'faq', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['calm', 'accessible', 'trust-led'], layoutPrinciples: ['readability first', 'clear service navigation', 'prominent practical actions'], contentDensity: 'medium', imagePriority: 'medium' },
    imageNeeds: ['clinic exterior/interior', 'care environment', 'team when supplied'], primaryGoal: 'booking',
    ctaStrategy: ['Book Appointment', 'Call Clinic', 'Find Location', 'Contact Us'],
  },
  {
    id: 'professional-service', name: 'Professional Service', aliases: ['professional', 'legal', 'consulting', 'finance', 'accounting'],
    sectionPriority: ['hero', 'about', 'offerings', 'trust', 'faq', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['authoritative', 'editorial', 'restrained'], layoutPrinciples: ['typographic hierarchy', 'proof before decoration', 'clear expertise-to-consultation flow'], contentDensity: 'rich', imagePriority: 'low' },
    imageNeeds: ['office', 'team/founder', 'relevant contextual imagery'], primaryGoal: 'consultation',
    ctaStrategy: ['Book Consultation', 'Discuss Your Needs', 'Request an Enquiry', 'Contact Us'],
  },
  {
    id: 'local-service', name: 'Local Service', aliases: ['local service', 'plumber', 'electrician', 'repair', 'contractor'],
    sectionPriority: ['hero', 'offerings', 'trust', 'location', 'about', 'faq', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['practical', 'trustworthy', 'direct'], layoutPrinciples: ['contact-first hierarchy', 'service clarity', 'local context'], contentDensity: 'medium', imagePriority: 'medium' },
    imageNeeds: ['service work', 'team/vehicle when supplied', 'local/service context'], primaryGoal: 'enquiry',
    ctaStrategy: ['Call Now', 'Request a Quote', 'Book Service', 'Get Directions'],
  },
  {
    id: 'creative-agency', name: 'Creative Agency', aliases: ['creative agency', 'agency', 'design studio', 'marketing agency'],
    sectionPriority: ['hero', 'visual', 'offerings', 'about', 'trust', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['distinctive', 'portfolio-led', 'editorial'], layoutPrinciples: ['case-study storytelling', 'asymmetry', 'expressive typography with restraint'], contentDensity: 'rich', imagePriority: 'high' },
    imageNeeds: ['featured work', 'case studies', 'brand/project imagery', 'team'], primaryGoal: 'enquiry',
    ctaStrategy: ['View Work', 'Start a Project', 'Discuss a Brief', 'Contact Studio'],
  },
  {
    id: 'retail', name: 'Retail', aliases: ['retail', 'store', 'shop', 'boutique', 'fashion'],
    sectionPriority: ['hero', 'offerings', 'visual', 'about', 'location', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['product-led', 'branded', 'editorial'], layoutPrinciples: ['featured product hierarchy', 'clear browsing', 'strong product imagery'], contentDensity: 'medium', imagePriority: 'high' },
    imageNeeds: ['featured products', 'collection imagery', 'store/interior', 'brand details'], primaryGoal: 'visit_or_order',
    ctaStrategy: ['Shop Collection', 'Explore Products', 'Visit Store', 'Order Now'],
  },
  {
    id: 'education', name: 'Education', aliases: ['education', 'school', 'academy', 'institute', 'coaching'],
    sectionPriority: ['hero', 'offerings', 'about', 'trust', 'faq', 'location', 'conversion', 'contact', 'footer'],
    design: { visualLanguage: ['clear', 'welcoming', 'structured'], layoutPrinciples: ['program clarity', 'outcome-oriented information', 'easy enquiry flow'], contentDensity: 'rich', imagePriority: 'medium' },
    imageNeeds: ['learning environment', 'program/class imagery', 'faculty/team'], primaryGoal: 'enquiry',
    ctaStrategy: ['Enquire Now', 'Explore Programs', 'Book a Visit', 'Contact Admissions'],
  },
];

const GENERAL: IndustryArchetype = {
  id: 'general', name: 'General Business', aliases: [],
  sectionPriority: ['hero', 'about', 'offerings', 'visual', 'trust', 'conversion', 'contact', 'footer'],
  design: { visualLanguage: ['clean', 'business-specific', 'restrained'], layoutPrinciples: ['clarity first', 'strong hierarchy', 'avoid unsupported content'], contentDensity: 'medium', imagePriority: 'medium' },
  imageNeeds: ['brand/hero image when supplied', 'relevant business imagery'], primaryGoal: 'contact',
  ctaStrategy: ['Get in Touch', 'Learn More', 'Contact Us'],
};

export function getIndustryArchetype(id: IndustryArchetypeId): IndustryArchetype {
  return id === 'general' ? GENERAL : ARCHETYPES.find((archetype) => archetype.id === id) || GENERAL;
}

export function resolveIndustryArchetype(profile: BusinessProfile): IndustryArchetype {
  const industry = profile.industry.trim().toLowerCase();
  const match = ARCHETYPES.find((archetype) => archetype.name.toLowerCase() === industry || archetype.aliases.some((alias) => industry.includes(alias)));
  return match || GENERAL;
}

export function getAllIndustryArchetypes(): IndustryArchetype[] {
  return [...ARCHETYPES, GENERAL];
}
