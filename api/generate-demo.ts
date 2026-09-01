type RequestBody = {
  brief?: string;
};

const allowedTemplates = ['luxury', 'photography', 'local-service', 'restaurant', 'professional'] as const;
const allowedFonts = ['serif', 'sans', 'modern', 'editorial'] as const;

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
    website: { type: 'string' },
    tagline: { type: 'string' },
    headline: { type: 'string' },
    about: { type: 'string' },
    contactName: { type: 'string' },
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
    'businessName', 'industry', 'location', 'description', 'services',
    'phone', 'email', 'whatsapp', 'instagram', 'website', 'tagline',
    'headline', 'about', 'contactName', 'template', 'fontStyle',
    'brandColors', 'ctaText',
  ],
};

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizeResult(value: unknown) {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const colors = (raw.brandColors && typeof raw.brandColors === 'object' ? raw.brandColors : {}) as Record<string, unknown>;
  const template = allowedTemplates.includes(raw.template as any) ? raw.template as typeof allowedTemplates[number] : 'professional';
  const fontStyle = allowedFonts.includes(raw.fontStyle as any) ? raw.fontStyle as typeof allowedFonts[number] : 'sans';

  return {
    businessName: cleanString(raw.businessName),
    industry: cleanString(raw.industry),
    location: cleanString(raw.location),
    description: cleanString(raw.description),
    services: cleanString(raw.services),
    phone: cleanString(raw.phone),
    email: cleanString(raw.email),
    whatsapp: cleanString(raw.whatsapp),
    instagram: cleanString(raw.instagram),
    website: cleanString(raw.website),
    tagline: cleanString(raw.tagline),
    headline: cleanString(raw.headline),
    about: cleanString(raw.about),
    contactName: cleanString(raw.contactName),
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

function extractText(data: any): string {
  return data?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === 'string')?.text || '';
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });

  const body = (req.body || {}) as RequestBody;
  const brief = cleanString(body.brief);
  if (!brief) return res.status(400).json({ error: 'Enter the business information first.' });

  const prompt = `You are the content strategist for Horizon Works, a web design agency. Turn the following raw business information into a polished website-ready profile. The information may be messy notes. Extract supported facts and improve wording without inventing facts.

RAW BUSINESS INFORMATION:
${brief}

Rules:
Use only facts supported by the input.
Never invent phone numbers, emails, WhatsApp numbers, addresses, contact names, image URLs, awards, clients, statistics, reviews, prices, certifications, or other factual claims.
Return empty strings for missing facts.
Do not browse or claim to have visited any URL.
Do not generate image URLs.
Write concise premium website copy.
Services must be one per line and supported by the input.
Choose the best template from luxury, photography, local-service, restaurant, professional.
Choose the best font from serif, sans, modern, editorial.
Brand colors may be design choices.
Return only JSON.`;

  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

  try {
    // First try Gemini's structured JSON output.
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.7,
        },
      }),
    });

    let data = await response.json();

    // If the API rejects the structured schema, retry with plain JSON output.
    if (!response.ok) {
      console.error('Gemini structured output error:', JSON.stringify(data));
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${prompt}\nReturn a single valid JSON object with these keys: businessName, industry, location, description, services, phone, email, whatsapp, instagram, website, tagline, headline, about, contactName, template, fontStyle, brandColors, ctaText.` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
        }),
      });
      data = await response.json();
    }

    if (!response.ok) {
      console.error('Gemini API error:', JSON.stringify(data));
      const apiMessage = cleanString(data?.error?.message);
      return res.status(502).json({
        error: apiMessage ? `Gemini API error: ${apiMessage}` : 'Gemini could not generate the demo content. Please try again.',
      });
    }

    const text = extractText(data);
    if (!text) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'Gemini returned invalid JSON. Please try again.' });
    }

    return res.status(200).json({ data: normalizeResult(parsed) });
  } catch (error) {
    console.error('Demo generation error:', error);
    return res.status(500).json({ error: 'Could not connect to Gemini right now.' });
  }
}
