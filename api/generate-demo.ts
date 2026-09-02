type RequestBody = {
  brief?: string;
};

const allowedTemplates = ['luxury', 'photography', 'local-service', 'restaurant', 'professional'] as const;
const allowedFonts = ['serif', 'sans', 'modern', 'editorial'] as const;
const allowedIcons = ['sparkles', 'award', 'shield', 'clock', 'heart', 'star'] as const;

const responseSchema = {
  type: 'object',
  properties: {
    businessName: { type: 'string' }, industry: { type: 'string' }, location: { type: 'string' },
    description: { type: 'string' }, services: { type: 'string' }, phone: { type: 'string' },
    email: { type: 'string' }, whatsapp: { type: 'string' }, instagram: { type: 'string' }, website: { type: 'string' },
    tagline: { type: 'string' }, headline: { type: 'string' }, about: { type: 'string' }, contactName: { type: 'string' },
    heroImage: { type: 'string' }, galleryImages: { type: 'string' },
    template: { type: 'string', enum: [...allowedTemplates] }, fontStyle: { type: 'string', enum: [...allowedFonts] },
    brandColors: { type: 'object', properties: { primary: { type: 'string' }, secondary: { type: 'string' }, accent: { type: 'string' } }, required: ['primary', 'secondary', 'accent'] },
    ctaText: { type: 'string' },
    visualSearchQuery: { type: 'string' },
    features: { type: 'string' },
  },
  required: ['businessName','industry','location','description','services','phone','email','whatsapp','instagram','website','tagline','headline','about','contactName','heroImage','galleryImages','template','fontStyle','brandColors','ctaText','visualSearchQuery','features'],
};

function cleanString(value: unknown): string { return typeof value === 'string' ? value.trim() : ''; }

function normalizeResult(value: unknown) {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>;
  const colors = (raw.brandColors && typeof raw.brandColors === 'object' ? raw.brandColors : {}) as Record<string, unknown>;
  const template = allowedTemplates.includes(raw.template as any) ? raw.template as typeof allowedTemplates[number] : 'professional';
  const fontStyle = allowedFonts.includes(raw.fontStyle as any) ? raw.fontStyle as typeof allowedFonts[number] : 'sans';
  return {
    businessName: cleanString(raw.businessName), industry: cleanString(raw.industry), location: cleanString(raw.location),
    description: cleanString(raw.description), services: cleanString(raw.services), phone: cleanString(raw.phone),
    email: cleanString(raw.email), whatsapp: cleanString(raw.whatsapp), instagram: cleanString(raw.instagram), website: cleanString(raw.website),
    tagline: cleanString(raw.tagline), headline: cleanString(raw.headline), about: cleanString(raw.about), contactName: cleanString(raw.contactName),
    heroImage: '', galleryImages: '', template, fontStyle,
    brandColors: { primary: cleanString(colors.primary) || '#1a1a2e', secondary: cleanString(colors.secondary) || '#16213e', accent: cleanString(colors.accent) || '#c9a227' },
    ctaText: cleanString(raw.ctaText) || 'Get in Touch',
    visualSearchQuery: cleanString(raw.visualSearchQuery),
    features: cleanString(raw.features),
  };
}

async function fetchPexelsImages(query: string) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey || !query) return { heroImage: '', galleryImages: '', used: false };

  try {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.set('query', query);
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('per_page', '6');
    const response = await fetch(url.toString(), { headers: { Authorization: apiKey } });
    if (!response.ok) {
      console.error('Pexels API error:', await response.text());
      return { heroImage: '', galleryImages: '', used: false };
    }

    const data = await response.json();
    const photos = Array.isArray(data?.photos) ? data.photos : [];
    const urls = photos
      .map((photo: any) => photo?.src?.landscape || photo?.src?.large2x || photo?.src?.large)
      .filter((url: unknown): url is string => typeof url === 'string' && url.startsWith('https://images.pexels.com/'));

    return { heroImage: urls[0] || '', galleryImages: urls.slice(1, 6).join('\n'), used: urls.length > 0 };
  } catch (error) {
    console.error('Pexels image search failed:', error);
    return { heroImage: '', galleryImages: '', used: false };
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  const body = (req.body || {}) as RequestBody;
  const brief = cleanString(body.brief);
  if (!brief) return res.status(400).json({ error: 'Enter the business information first.' });

  const prompt = `You are the content strategist for Horizon Works, a web design agency. Turn the following raw business information into a polished website-ready profile. The information may be messy notes. Extract supported facts and improve wording without inventing facts.\n\nRAW BUSINESS INFORMATION:\n${brief}\n\nRules: Use only facts supported by the input. Never invent phone numbers, emails, WhatsApp numbers, addresses, contact names, image URLs, awards, clients, statistics, reviews, prices, certifications, or other factual claims. Return empty strings for missing facts. Do not browse or claim to have visited any URL. Do not generate image URLs. Write concise premium website copy. Services must be one per line in this exact format: Service name :: one-sentence description grounded in the input. If the input does not support a description, leave the description empty after the ::. Choose the best template from luxury, photography, local-service, restaurant, professional and the best font from serif, sans, modern, editorial. Brand colors may be design choices. Also create a short visualSearchQuery containing the business type, visual subject, location if useful, and aesthetic direction. Return a short features string with 3 to 4 lines in this exact format: Feature title :: one-sentence description grounded in the input :: icon. Use icons only from sparkles, award, shield, clock, heart, star. Do not make unsupported claims; feature descriptions can describe the experience/style without asserting certifications or guarantees. Return only structured data.`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', responseSchema },
      }),
    });
    const responseText = await response.text();
    if (!response.ok) {
      console.error('Gemini API error:', responseText);
      let detail = '';
      try { detail = JSON.parse(responseText)?.error?.message || ''; } catch { detail = responseText; }
      return res.status(502).json({ error: `Gemini API error: ${detail || 'The request failed.'}` });
    }
    const data = JSON.parse(responseText);
    const text = data?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === 'string')?.text;
    if (!text) return res.status(502).json({ error: 'Gemini returned an empty response. Please try again.' });

    const generated = normalizeResult(JSON.parse(text));
    const images = await fetchPexelsImages(generated.visualSearchQuery || `${generated.industry} ${generated.location}`);

    return res.status(200).json({
      data: { ...generated, heroImage: images.heroImage, galleryImages: images.galleryImages },
      media: { source: images.used ? 'pexels' : undefined },
    });
  } catch (error) {
    console.error('Demo generation error:', error);
    return res.status(500).json({ error: 'Could not generate demo content right now.' });
  }
}
