import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';

const SESSION_COOKIE = 'hw_session';
const MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash-lite'] as const;
const patchSchema = {
  type: 'OBJECT',
  properties: {
    businessName: { type: 'STRING' }, industry: { type: 'STRING' }, tagline: { type: 'STRING' },
    headline: { type: 'STRING' }, description: { type: 'STRING' }, heroImage: { type: 'STRING' },
    template: { type: 'STRING', enum: ['luxury', 'photography', 'local-service', 'restaurant', 'professional'] },
    fontStyle: { type: 'STRING', enum: ['serif', 'sans', 'modern', 'editorial'] },
    ctaText: { type: 'STRING' }, secondaryCtaText: { type: 'STRING' },
    location: { type: 'OBJECT', properties: { city: { type: 'STRING' }, region: { type: 'STRING' }, country: { type: 'STRING' }, address: { type: 'STRING' } } },
    about: { type: 'OBJECT', properties: { heading: { type: 'STRING' }, body: { type: 'ARRAY', items: { type: 'STRING' } }, image: { type: 'STRING' } } },
    services: { type: 'ARRAY', items: { type: 'OBJECT', properties: { name: { type: 'STRING' }, description: { type: 'STRING' }, image: { type: 'STRING' } } } },
    features: { type: 'ARRAY', items: { type: 'OBJECT', properties: { title: { type: 'STRING' }, description: { type: 'STRING' }, icon: { type: 'STRING' } } } },
    galleryImages: { type: 'ARRAY', items: { type: 'OBJECT', properties: { url: { type: 'STRING' }, alt: { type: 'STRING' }, caption: { type: 'STRING' } } } },
    contact: { type: 'OBJECT', properties: { contactName: { type: 'STRING' }, phone: { type: 'STRING' }, email: { type: 'STRING' }, whatsapp: { type: 'STRING' }, instagram: { type: 'STRING' }, website: { type: 'STRING' } } },
    brandColors: { type: 'OBJECT', properties: { primary: { type: 'STRING' }, secondary: { type: 'STRING' }, accent: { type: 'STRING' }, background: { type: 'STRING' }, surface: { type: 'STRING' }, text: { type: 'STRING' }, muted: { type: 'STRING' } } },
  },
};

function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL || process.env.STORAGE_URL || '';
}
function cookie(req: VercelRequest, name: string) {
  const raw = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}
async function authenticated(req: VercelRequest) {
  const db = connectionString();
  const token = cookie(req, SESSION_COOKIE);
  if (!db || !token) return false;
  const sql = neon(db);
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const rows = await sql`SELECT token_hash FROM horizon_sessions WHERE token_hash = ${tokenHash} AND expires_at > NOW() LIMIT 1`;
  return rows.length > 0;
}
function mergePatch(current: Record<string, any>, patch: Record<string, any>) {
  const result: Record<string, any> = { ...current };
  const allowed = ['businessName', 'industry', 'tagline', 'headline', 'description', 'heroImage', 'template', 'fontStyle', 'ctaText', 'secondaryCtaText', 'location', 'about', 'services', 'features', 'galleryImages', 'contact', 'brandColors'];
  for (const key of allowed) {
    if (!(key in patch) || patch[key] === undefined || patch[key] === null) continue;
    if (typeof patch[key] === 'string' && !patch[key].trim()) continue;
    if (['location', 'about', 'contact', 'brandColors'].includes(key) && typeof patch[key] === 'object' && !Array.isArray(patch[key])) {
      result[key] = { ...(current[key] || {}), ...patch[key] };
    } else {
      result[key] = patch[key];
    }
  }
  // Keep immutable identity, slug, and expiry exactly as stored in the current config.
  result.id = current.id;
  result.slug = current.slug;
  if (current.expiresAt) result.expiresAt = current.expiresAt;
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });

  try {
    if (!(await authenticated(req))) return res.status(401).json({ error: 'Sign in to modify a demo.' });
    let body: any = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body.' }); } }
    const current = body?.client;
    const instructions = typeof body?.instructions === 'string' ? body.instructions.trim() : '';
    if (!current || typeof current !== 'object' || typeof current.id !== 'string' || typeof current.slug !== 'string' || typeof current.businessName !== 'string') {
      return res.status(400).json({ error: 'A valid generated website is required.' });
    }
    if (!instructions) return res.status(400).json({ error: 'Describe what you want to change.' });
    if (instructions.length > 2000) return res.status(400).json({ error: 'Keep your modification prompt under 2,000 characters.' });

    const prompt = `You are the website design and content editor for Horizon Works. Modify an existing website configuration based on the user's instructions.

RULES:
- Return only a JSON object containing the fields that need to change. Omit every unchanged field.
- Preserve business facts, contact information, URLs, and identity unless the user explicitly asks to change them. Never invent factual claims, testimonials, ratings, awards, pricing, addresses, or contact details.
- For a visual redesign request, update relevant fields such as template, brandColors, fontStyle, headline, tagline, CTA, services/features copy, and about content as needed.
- Keep the existing site's business purpose and conversion goal. Make only changes that support the user's request.
- Keep template limited to luxury, photography, local-service, restaurant, professional. Keep fontStyle limited to serif, sans, modern, editorial.
- For brandColors, use valid CSS hex colors. If the user asks only for copy changes, do not alter design settings.
- If asked to add a section, represent its content in the closest supported fields (services, features, about). Do not create unsupported fields.
- Do not change id, slug, or expiresAt.

CURRENT WEBSITE CONFIG:
${JSON.stringify(current)}

USER'S MODIFICATION REQUEST:
${instructions}`;

    const failures: string[] = [];
    let patch: Record<string, any> | undefined;
    for (const model of MODELS) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', responseSchema: patchSchema },
          }),
        });
        const raw = await response.text();
        let payload: any;
        try { payload = JSON.parse(raw); } catch { payload = null; }
        if (!response.ok) {
          failures.push(`${model} (${response.status}): ${payload?.error?.message || raw || response.statusText}`);
          if ([400, 401, 403].includes(response.status)) break;
          continue;
        }
        const output = payload?.candidates?.[0]?.content?.parts?.find((part: any) => typeof part?.text === 'string')?.text;
        if (!output) { failures.push(`${model}: empty response`); continue; }
        patch = JSON.parse(output);
        break;
      } catch (error) {
        failures.push(`${model}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    if (!patch) return res.status(502).json({ error: `Could not modify the website. ${failures.join(' | ')}` });
    return res.status(200).json({ data: mergePatch(current, patch) });
  } catch (error) {
    console.error('Website modification error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Website modification failed.' });
  }
}
