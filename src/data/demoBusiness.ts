import type { ClientConfig } from '@/types/client';

export const demoBusiness: ClientConfig = {
  id: 'demo-business',
  slug: 'demo-business',
  businessName: 'Demo Business',
  industry: 'General Commerce',
  tagline: 'A demonstration of the Horizon Works Demo Engine',
  headline: 'See how your website could look',
  description:
    'This is a demonstration client. Every piece of content on this page — the business name, services, images, colors, and layout — is driven by a single configuration file. Change the configuration and the entire site adapts.',
  location: {
    city: 'Demo City',
    region: 'Demo Province',
    country: 'Demo Country',
    address: '123 Demonstration Street, Demo City',
  },
  about: {
    heading: 'About Demo Business',
    body: [
      'This paragraph is not real business copy. It exists to show where your about text will appear once a real client configuration is loaded.',
      'When a real client is added, this section will be filled with their actual story — no fabricated history, awards, or credentials are generated.',
    ],
  },
  services: [
    {
      name: 'Demo Service One',
      description: 'A placeholder service showing how service cards render. Replace with the client\'s real offerings.',
    },
    {
      name: 'Demo Service Two',
      description: 'Another placeholder service. Each service can optionally include its own image.',
    },
    {
      name: 'Demo Service Three',
      description: 'A third placeholder. The number of services displayed depends entirely on the configuration.',
    },
  ],
  galleryImages: [
    { alt: 'Demo gallery image one', caption: 'Gallery images come from client configuration.' },
    { alt: 'Demo gallery image two', caption: 'Each image supports alt text and an optional caption.' },
    { alt: 'Demo gallery image three', caption: 'Images maintain their aspect ratio and never stretch.' },
    { alt: 'Demo gallery image four', caption: 'Real client photos will replace these placeholders.' },
  ],
  heroImage: '',
  features: [
    { title: 'Configuration-Driven', description: 'Every visible element is controlled by a single config object.' },
    { title: 'Template-Based', description: 'Switch the entire visual style by changing one field.' },
    { title: 'Responsive', description: 'Layouts adapt from mobile to desktop automatically.' },
  ],
  contact: {
    contactName: 'Demo Contact',
    phone: '',
    email: '',
    whatsapp: '',
    instagram: '',
    website: '',
  },
  template: 'luxury',
  brandColors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#c9a227',
    background: '#0f0f1a',
    surface: '#1a1a2e',
    text: '#f5f5f5',
    muted: '#a0a0b0',
  },
  fontStyle: 'serif',
  ctaText: 'Get in Touch',
  secondaryCtaText: 'View Services',
};
