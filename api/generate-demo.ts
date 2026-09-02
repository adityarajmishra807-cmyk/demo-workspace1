type RequestBody = { brief?: string };

const allowedTemplates = ['luxury', 'photography', 'local-service', 'restaurant', 'professional'] as const;
const allowedFonts = ['serif', 'sans', 'modern', 'editorial'] as const;

const responseSchema = {
  type: 'object',
  properties: {
    businessName: { type: 'string' }, industry: { type: 'string' }, location: { type: 'string' },
    description: { type: 'string' }, services: { type: 'string' }, phone: { type: 'string' },
    email: { type: 'string' }, whatsapp: { type: 'string' }, instagram: { type: 'string' }, website: { type: 'string' },
    tagline: { type: 'string' }, headline: { type: 'string' }, about: { type: 'string' }, contactName: { type: 'string' },
    heroImage: { type: 'string' }, galleryImages: { type: 'string' },
    template: { type: 'string', enum: [...allowedTemplates] }, fontStyle: { type: 'string', enum: [...allowedFonts] },
    brandColors: {
      type: 'object',
      properties: { primary: { type: 'string' }, secondary: { type: 'string' }, accent: { type: 'string' } },
      required: ['primary', 'secondary', 'accent'],
    },
    ctaText: { type: 'string' }, visualSearchQuery: { type: 'string' }, features: { type: 'string' },
  },
  required: [
    'businessName','industry','location','description','services','phone','email','whatsapp','instagram','website',
    'tagline','headline','about','contactName','heroImage','galleryImages','template','fontStyle','brandColors','ctaText','visualSearchQuery','features'
  ],
};

const UI_UX_PRO_MAX_SYSTEM = `
You are Horizon Works' senior product designer, UX strategist, creative director, and conversion specialist.
For EVERY generation, apply the principles of the open-source UI UX Pro Max design-intelligence approach. Treat design as a reasoning problem, not a decoration problem.

YOUR REQUIRED DESIGN WORKFLOW
1. Classify the business/product into the closest industry/category.
2. Decide the user's primary goal and the site's primary conversion action.
3. Select a landing-page pattern that fits the business: hero-centric, conversion-optimized, feature-rich, minimal/direct, social-proof-focused, interactive/demo, trust/authority, or storytelling-driven.
4. Select a visual style appropriate to the category. Do NOT default to the same luxury dark template. Choose from concepts such as Minimal/Swiss, Soft UI, Glassmorphism, Motion-Driven, Editorial/Magazine, Liquid Glass, Organic/Biophilic, Bento, 3D/Hyperreal, Kinetic Typography, Parallax Storytelling, Exaggerated Minimalism, Vintage Analog, etc. Use style only when it supports the business and audience.
5. Select a restrained industry-appropriate color mood and a coherent typography mood. Prioritize hierarchy, legibility, contrast, and brand fit over novelty.
6. Plan information architecture before writing copy. Each section must have a job: orient, build desire, explain value, establish trust, show proof, reduce friction, or convert.
7. Create visual hierarchy and depth through composition, spacing, layering, image cropping, borders, shadows, scale, and motion. Avoid making every section look like identical cards.
8. Use motion intentionally. Prefer smooth 150-300ms micro-interactions and, where appropriate, slower 400-600ms premium reveals/parallax. Never let animation obscure content or hurt performance.
9. Use responsive behavior as part of the design, not as an afterthought. Think about 375px, 768px, 1024px, and 1440px layouts.
10. Accessibility is mandatory: readable contrast, clear focus states, keyboard-friendly interactions, appropriate touch targets, semantic structure, and respect prefers-reduced-motion.
11. Use real imagery when available. The visualSearchQuery should be specific enough to find relevant stock imagery, considering subject, environment, audience, location when useful, and aesthetic direction.
12. Before returning output, mentally run a pre-delivery audit: no generic filler, no invented facts, no broken hierarchy, no excessive effects, no irrelevant sections, no tiny text, no confusing CTAs, no repeated visual patterns.

QUALITY RULES
- Never use AI-purple/pink gradients as a default visual identity.
- Never force dark mode. Use dark mode only when it clearly fits the category/brand.
- Do not use emojis as icons. Use Lucide-style SVG icons through the application.
- Do not overuse rounded cards, pills, glass panels, gradients, shadows, or floating blobs.
- Avoid excessive centered layouts. Use asymmetric/editorial composition when it better serves the brand.
- Avoid giant text that crowds the viewport or removes useful context.
- Avoid long text walls. Break copy into scannable, meaningful units.
- Avoid generic headings such as 'Welcome to Our Website', 'Our Services', 'Why Choose Us' when a stronger business-specific phrase is possible.
- Every visual decision should have a reason tied to the business, audience, conversion goal, or brand positioning.
- Never fabricate testimonials, ratings, years of experience, awards, clients, prices, addresses, credentials, statistics, or contact details.

INDUSTRY REASONING EXAMPLES
- SaaS/tech: clear hierarchy, product value, feature proof, conversion, restrained motion.
- B2B/consulting/legal/finance: trust and authority, strong typography, high contrast, proof/case-study logic, minimal decorative effects.
- Healthcare: accessibility, calm palette, large readable type, clear booking/contact flow, minimal motion.
- Restaurant/cafe/hospitality: high-quality food/interior imagery, menu/experience emphasis, warm visual language, conversion to booking/order.
- Beauty/wellness: calming premium visual system, soft depth, elegant type, booking flow, tasteful transitions.
- Luxury/premium: high-quality imagery, refined typography, restrained palette, storytelling, slow premium motion.
- Real estate: property-led visual hierarchy, strong imagery, location/context, trust, enquiry flow.
- Creative/photography/agency: storytelling, distinctive composition, portfolio-first presentation, expressive typography, controlled motion.
- Local services: clarity, trust, prominent contact/emergency/booking action, practical information first.
- Travel/tourism: destination storytelling, immersive imagery, itinerary/experience hierarchy, mobile-first conversion.
When a category is not covered, infer the closest design logic instead of defaulting to a generic template.

OUTPUT PRINCIPLE
Generate copy and design choices as if the finished website will be reviewed by an experienced design director. Favor specificity, hierarchy, restraint, coherence, and conversion over generic visual spectacle.
`;

function cleanString(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }

function normalizeResult(value: unknown) {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const colors = (raw.brandColors && typeof raw.brandColors === 'object' ? raw.brandColors : {}) as Record<string, unknown>;
  return {
    businessName: cleanString(raw.businessName), industry: cleanString(raw.industry), location: cleanString(raw.location),
    description: cleanString(raw.description), services: cleanString(raw.services), phone: cleanString(raw.phone),
    email: cleanString(raw.email), whatsapp: cleanString(raw.whatsapp), instagram: cleanString(raw.instagram), website: cleanString(raw.website),
    tagline: cleanString(raw.tagline), headline: cleanString(raw.headline), about: cleanString(raw.about), contactName: cleanString(raw.contactName), heroImage: '', galleryImages: '',
    template: allowedTemplates.includes(raw.template as any) ? raw.template as typeof allowedTemplates[number] : 'professional',
    fontStyle: allowedFonts.includes(raw.fontStyle as any) ? raw.fontStyle as typeof allowedFonts[number] : 'sans',
    brandColors: { primary: cleanString(colors.primary) || '#1a1a2e', secondary: cleanString(colors.secondary) || '#16213e', accent: cleanString(colors.accent) || '#c9a227' },
    ctaText: cleanString(raw.ctaText) || 'Get in Touch', visualSearchQuery: cleanString(raw.visualSearchQuery), features: cleanString(raw.features),
  };
}

async function fetchPexelsImages(query: string) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || !query) return { heroImage: '', galleryImages: '', used: false };
  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', query); url.searchParams.set('orientation', 'landscape'); url.searchParams.set('per_page', '6');
    const response = await fetch(url.toString(), { headers: { Authorization: apiKey } });
    if (!response.ok) {
      console.error('Pexels API error:', await response.text());
      return { heroImage: '', galleryImages: '', used: false };
    }
    const data = await response.json();
    const urls = (Array.isArray(data?.photos) ? data.photos : [])
      .map((photo: any) => photo?.src?.landscape || photo?.src?.large2x || photo?.src?.large)
      .filter((url: unknown): url is string => typeof url === 'string' && url.startsWith('https://images.pexels.com/'));
    return { heroImage: urls[0] || '', galleryImages: urls.slice(1, 6).join('\n'), used: urls.length > 0 };
  } catch (error) {
    console.error('Pexels image search failed:', error);
    return { heroImage: '', galleryImages: '', used: false };
  }
}

async function callGemini(apiKey: string, prompt: string) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: UI_UX_PRO_MAX_SYSTEM }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema },
    }),
  });
  const responseText = await response.text();
  let payload: any = null;
  try { payload = JSON.parse(responseText); } catch { /* preserve raw text */ }
  if (!response.ok) {
    const detail = payload?.error?.message || responseText || 'The Gemini request failed.';
    const code = payload?.error?.status || response.statusText;
    throw new Error(`Gemini ${code}: ${detail}`);
  }
  const text = payload?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === 'string')?.text;
  if (!text) throw new Error('Gemini returned no generated content.');
  return JSON.parse(text);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });

  const brief = cleanString((req.body || {}).brief);
  if (!brief) return res.status(400).json({ error: 'Enter the business information first.' });

  const prompt = `Create the content and design direction for the following business. Follow your design-intelligence system first, then produce the structured website fields. The visual system should be distinctive to this business and must not automatically reuse the same dark/luxury treatment used for other clients. Make the information architecture feel intentional and premium.\n\nRAW BUSINESS INFORMATION:\n${brief}`;

  try {
    const generated = normalizeResult(await callGemini(apiKey, prompt));
    const images = await fetchPexelsImages(generated.visualSearchQuery || `${generated.industry} ${generated.location}`);
    return res.status(200).json({
      data: { ...generated, heroImage: images.heroImage, galleryImages: images.galleryImages },
      media: { source: images.used ? 'pexels' : undefined },
    });
  } catch (error) {
    console.error('Demo generation error:', error);
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Could not generate demo content right now.' });
  }
}
