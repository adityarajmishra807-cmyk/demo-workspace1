const DEMO_PREFIX = 'demos/';
const BLOB_API = 'https://vercel.com/api/blob';

type DemoRecord = Record<string, any>;

function cleanSlug(value: unknown): string { return typeof value === 'string' ? value.trim().toLowerCase() : ''; }
function isValidSlug(slug: string): boolean { return /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(slug); }
function getToken(): string { return process.env.BLOB_READ_WRITE_TOKEN || ''; }

function requireToken(res: any): string | null {
  const token = getToken();
  if (!token) {
    res.status(500).json({ error: 'Vercel Blob is not configured. Add BLOB_READ_WRITE_TOKEN to the Production environment and redeploy.' });
    return null;
  }
  return token;
}

async function blobList(token: string, prefix: string) {
  const url = new URL(BLOB_API);
  url.searchParams.set('prefix', prefix);
  url.searchParams.set('limit', '1000');
  const response = await fetch(url.toString(), { headers: { Authorization: `Bearer ${token}` } });
  const text = await response.text();
  let payload: any = null;
  try { payload = JSON.parse(text); } catch { /* ignore */ }
  if (!response.ok) throw new Error(payload?.error?.message || text || `Blob list failed (${response.status}).`);
  return payload as { blobs?: Array<{ url: string; pathname: string }> };
}

async function blobPut(token: string, pathname: string, body: string) {
  const url = new URL(BLOB_API);
  url.searchParams.set('pathname', pathname);
  const response = await fetch(url.toString(), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-api-version': '11',
      'x-vercel-blob-access': 'public',
      'x-content-type': 'application/json',
      'x-add-random-suffix': '0',
      'x-allow-overwrite': '1',
      'x-cache-control-max-age': '30',
    },
    body,
  });
  const text = await response.text();
  let payload: any = null;
  try { payload = JSON.parse(text); } catch { /* ignore */ }
  if (!response.ok) throw new Error(payload?.error?.message || text || `Blob write failed (${response.status}).`);
  return payload as { url?: string; pathname?: string };
}

async function blobDelete(token: string, urls: string[]) {
  const response = await fetch(`${BLOB_API}/delete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
  });
  const text = await response.text();
  let payload: any = null;
  try { payload = JSON.parse(text); } catch { /* ignore */ }
  if (!response.ok) throw new Error(payload?.error?.message || text || `Blob delete failed (${response.status}).`);
}

async function fetchJson(url: string) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Stored demo could not be read (${response.status}).`);
  return response.json();
}

function validateClient(value: unknown): value is DemoRecord {
  if (!value || typeof value !== 'object') return false;
  const client = value as DemoRecord;
  return typeof client.id === 'string' && typeof client.slug === 'string' && typeof client.businessName === 'string' && typeof client.industry === 'string' && typeof client.template === 'string' && !!client.brandColors && typeof client.brandColors === 'object';
}

async function findDemo(token: string, slug: string) {
  const listed = await blobList(token, `${DEMO_PREFIX}${slug}.json`);
  const blob = listed.blobs?.find((item) => item.pathname === `${DEMO_PREFIX}${slug}.json`) || listed.blobs?.[0];
  if (!blob?.url) return null;
  const value = await fetchJson(blob.url);
  if (!validateClient(value) || value.slug !== slug) return null;
  return { client: value, blobUrl: blob.url };
}

function noStore(res: any) { res.setHeader('Cache-Control', 'private, no-store, max-age=0'); }

export default async function handler(req: any, res: any) {
  noStore(res);
  const action = typeof req.query?.action === 'string' ? req.query.action : 'get';

  try {
    if (action === 'get') {
      const slug = cleanSlug(req.query?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      const token = requireToken(res); if (!token) return;
      const found = await findDemo(token, slug);
      if (!found) return res.status(404).json({ error: 'Demo not found.' });
      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
      return res.status(200).json({ data: found.client });
    }

    const token = requireToken(res); if (!token) return;

    if (action === 'list') {
      const listed = await blobList(token, DEMO_PREFIX);
      const records = await Promise.all((listed.blobs || []).filter((item) => item.pathname.endsWith('.json')).map(async (blob) => {
        try { const value = await fetchJson(blob.url); return validateClient(value) ? value : null; } catch { return null; }
      }));
      return res.status(200).json({ data: records.filter(Boolean) });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    let body: any = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body.' }); }
    }

    if (action === 'save') {
      const client = body?.client;
      const mode = body?.mode === 'update' ? 'update' : 'create';
      if (!validateClient(client)) return res.status(400).json({ error: 'Invalid demo payload.' });
      const slug = cleanSlug(client.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      if (slug !== client.slug) return res.status(400).json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens.' });
      const existing = await findDemo(token, slug);
      if (existing && mode === 'create' && existing.client.id !== client.id) return res.status(409).json({ error: 'That demo slug already exists. Choose a different business name/slug.' });
      await blobPut(token, `${DEMO_PREFIX}${slug}.json`, JSON.stringify(client));
      return res.status(200).json({ ok: true, slug, url: `https://${slug}.demo.horizonworks.co.in/` });
    }

    if (action === 'delete') {
      const slug = cleanSlug(body?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      const existing = await findDemo(token, slug);
      if (!existing) return res.status(404).json({ error: 'Demo not found.' });
      await blobDelete(token, [existing.blobUrl]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (error) {
    console.error('Demo store error:', error);
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Demo storage request failed.' });
  }
}
