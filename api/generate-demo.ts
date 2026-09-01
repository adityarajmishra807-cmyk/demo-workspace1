type RequestBody = {
  businessName?: string;
  industry?: string;
  location?: string;
  websiteOrInstagram?: string;
  notes?: string;
};

const allowedTemplates = ['luxury', 'photography', 'local-service', 'restaurant', 'professional'] as const;
const allowedFonts = ['serif', 'sans', 'modern', 'editorial'] as const;

type GeneratedFormData = {
  businessName: string;
  industry: string;
  location: string;
  description: string;
  services: string;
  phone: string;
  email: string;
  whatsapp: string;
  instagram: string;
  heroImage: string;
  galleryImages: string;
  template: (typeof allowedTemplates)[number];
  fontStyle: (typeof allowedFonts)[number];
  brandColors: { primary: string; secondary: string; accent: string };
  ctaText: string;
};

const responseSchema = {
  type: 'object',
  properties: {
    businessName: { type: 'string' },
    industry: { type: 'string' },
    location: { type: 'string' },
    description: { type: 'string' },
    services: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string' },
    whatsapp: { type: 'string' },
    instagram: { type: 'string' },
    heroImage: { type: 'string' },
    galleryImages: { type: 'string' },
    template: { type: 'string', enum: [...allowedTemplates] },
    fontStyle: { type: 'string', enum: [...allowedFonts] },
    brandColors: {
      type: 'object',
      properties: {
        primary: { type: 'string' },
        secondary: { type: 'string' },
        accent: { type: 'string' },
      },
      required: ['primary', 'secondary', 'accent'],
    },
    ctaText: { type: 'string' },
  },
  required: [
    'businessName',
    'industry',
    'location',
    'description',
    'services',
    'phone',
    'email',
    'whatsapp',
    'instagram',
    'heroImage',
    'galleryImages',
    'template',
    'fontStyle',
    'brandColors',
    'ctaText',
  ],
  additionalProperties: false,
};

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeResult(value: unknown, input: RequestBody): GeneratedFormData {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const colors = (raw.brandColors && typeof raw.brandColors === 'object' ? raw.brandColors : {}) as Record<string, unknown>;

  const template = allowedTemplates.includes(raw.template as GeneratedFormData['template'])
    ? (raw.template as GeneratedFormData['template'])
    : 'professional';
  const fontStyle = allowedFonts.includes(raw.fontStyle as GeneratedFormData['fontStyle'])
    ? (raw.fontStyle as GeneratedFormData['fontStyle'])
    : 'sans';

  return {
    businessName: cleanString(raw.businessName) || cleanString(input.businessName),
    industry: cleanString(raw.industry) || cleanString(input.industry),
    location: cleanString(raw.location) || cleanString(input.location),
    description: cleanString(raw.description),
    services: cleanString(raw.services),
    phone: cleanString(raw.phone),
    email: cleanString(raw.email),
    whatsapp: cleanString(raw.whatsapp),
    instagram: cleanString(raw.instagram) || cleanString(input.websiteOrInstagram),
    heroImage: '',
    galleryImages: '',
    template,
    fontStyle,
    brandColors: {
      primary: cleanString(colors.primary) || '#1a1a2e',
      secondary: cleanString(colors.secondary) || '#16213e',
      accent: cleanString(colors.accent) || '#c9a227',
    },
    ctaText: cleanString(raw.ctaText) || 'Get in Touch',
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    return;
  }

  const body = (req.body || {}) as RequestBody;
  const businessName = cleanString(body.businessName);
  const industry = cleanString(body.industry);

  if (!businessName || !industry) {
    res.status(400).json({ error: 'Business name and industry are required.' });
    return;
  }

  const prompt = `
You are the content strategist for Horizon Works, a web design agency.
Generate a website-ready business profile for the business below.

Business name: ${businessName}
Industry: ${industry}
Location: ${cleanString(body.location) || 'Not provided'}
Website or Instagram reference: ${cleanString(body.websiteOrInstagram) || 'Not provided'}
Additional notes: ${cleanString(body.notes) || 'Not provided'}

Rules:
1. Use only information provided in the input. Never invent a phone number, email address, WhatsApp number, image URL, address, awards, clients, statistics, reviews, prices, or claims.
2. Leave contact fields empty when they were not explicitly provided.
3. Do not generate heroImage or galleryImages. Those must be empty strings until real images are supplied.
4. Write polished, concise website copy suitable for a premium modern business website.
5. Services must be plain text with one service per line. Only include services that are reasonably supported by the supplied business information; do not fabricate specific offerings.
6. Choose the best template from: luxury, photography, local-service, restaurant, professional.
7. Choose the best font style from: serif, sans, modern, editorial.
8. Choose tasteful brand colors as hex values based on the business positioning. Do not copy colors from a brand unless they were explicitly supplied.
9. Return only the requested structured data.
`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            temperature: 0.7,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      res.status(502).json({ error: 'Gemini could not generate the demo content. Please try again.' });
      return;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === 'string')?.text;

    if (!text) {
      res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });
      return;
    }

    const parsed = JSON.parse(text);
    res.status(200).json({ data: normalizeResult(parsed, body) });
  } catch (error) {
    console.error('Demo generation error:', error);
    res.status(500).json({ error: 'Could not generate demo content right now.' });
  }
}
