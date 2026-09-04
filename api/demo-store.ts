import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';

type DemoRecord = Record<string, any>;
const TRIAL_DAYS = 7;
const SESSION_COOKIE = 'hw_session';

function getConnectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL || process.env.STORAGE_URL || '';
}
function sqlOrError(res: VercelResponse) {
  const connectionString = getConnectionString();
  if (!connectionString) { res.status(500).json({ error: 'Postgres is not configured. Connect a Neon Postgres database to this Vercel project and redeploy.' }); return null; }
  return neon(connectionString);
}
function cleanSlug(value: unknown): string { return typeof value === 'string' ? value.trim().toLowerCase() : ''; }
function isValidSlug(slug: string): boolean { return /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(slug); }
function validClient(value: unknown): value is DemoRecord {
  if (!value || typeof value !== 'object') return false;
  const client = value as DemoRecord;
  return typeof client.id === 'string' && typeof client.slug === 'string' && typeof client.businessName === 'string' && typeof client.industry === 'string' && typeof client.template === 'string' && client.brandColors && typeof client.brandColors === 'object';
}
function getCookie(req: VercelRequest, name: string) {
  const raw = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}
async function currentUser(sql: ReturnType<typeof neon>, req: VercelRequest) {
  const token = getCookie(req, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const rows = await sql`SELECT u.id, u.name, u.email FROM horizon_sessions s JOIN horizon_users u ON u.id = s.user_id WHERE s.token_hash = ${tokenHash} AND s.expires_at > NOW() LIMIT 1`;
  return rows[0] || null;
}
async function ensureSchema(sql: ReturnType<typeof neon>) {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`CREATE TABLE IF NOT EXISTS horizon_users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS horizon_sessions (token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES horizon_users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS horizon_demo_configs (slug TEXT PRIMARY KEY, client_id TEXT NOT NULL UNIQUE, config JSONB NOT NULL, expires_at TIMESTAMPTZ, owner_id UUID REFERENCES horizon_users(id) ON DELETE CASCADE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`ALTER TABLE horizon_demo_configs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE horizon_demo_configs ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES horizon_users(id) ON DELETE CASCADE`;
  await sql`UPDATE horizon_demo_configs SET expires_at = created_at + make_interval(days => ${TRIAL_DAYS}) WHERE expires_at IS NULL`;
}
function addTrialToConfig(config: DemoRecord, expiresAt: string | Date | null) { return { ...config, expiresAt: expiresAt instanceof Date ? expiresAt.toISOString() : expiresAt || undefined }; }

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const sql = sqlOrError(res); if (!sql) return;
  const action = typeof req.query?.action === 'string' ? req.query.action : 'get';
  try {
    await ensureSchema(sql);

    if (action === 'get') {
      const slug = cleanSlug(req.query?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      const rows = await sql`SELECT config, expires_at FROM horizon_demo_configs WHERE slug = ${slug} LIMIT 1`;
      if (!rows.length) return res.status(404).json({ error: 'Demo not found.' });
      const expiry = rows[0].expires_at ? new Date(rows[0].expires_at) : null;
      if (expiry && expiry.getTime() <= Date.now()) return res.status(410).json({ error: 'This 7-day demo trial has expired.' });
      const config = rows[0].config;
      if (!validClient(config) || config.slug !== slug) return res.status(500).json({ error: 'Stored demo configuration is invalid.' });
      return res.status(200).json({ data: addTrialToConfig(config, rows[0].expires_at) });
    }

    const user = await currentUser(sql, req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    if (action === 'list') {
      const rows = await sql`SELECT config, expires_at FROM horizon_demo_configs WHERE owner_id = ${user.id} ORDER BY updated_at DESC`;
      return res.status(200).json({ data: rows.map((row) => addTrialToConfig(row.config, row.expires_at)).filter(validClient) });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    let body: any = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body.' }); } }

    if (action === 'save') {
      const client = body?.client; const mode = body?.mode === 'update' ? 'update' : 'create';
      if (!validClient(client)) return res.status(400).json({ error: 'Invalid demo payload.' });
      const slug = cleanSlug(client.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      if (client.slug !== slug) return res.status(400).json({ error: 'Slug must be lowercase letters, numbers, and hyphens only.' });

      const existing = await sql`SELECT slug, client_id, expires_at, owner_id FROM horizon_demo_configs WHERE slug = ${slug} OR client_id = ${client.id} LIMIT 1`;
      if (existing.length) {
        const row = existing[0];
        if (mode === 'create' && row.client_id !== client.id) return res.status(409).json({ error: 'That demo slug already exists. Choose a different business name.' });
        if (mode === 'update' && row.slug !== slug) return res.status(409).json({ error: 'Changing the published slug is not supported.' });
        if (row.owner_id && String(row.owner_id) !== String(user.id)) return res.status(403).json({ error: 'You do not have access to this demo.' });
        if (mode === 'update' && row.expires_at && new Date(row.expires_at).getTime() <= Date.now()) return res.status(410).json({ error: 'This 7-day demo trial has expired and can no longer be edited.' });
      }

      const currentExpiry = existing[0]?.expires_at ? new Date(existing[0].expires_at).toISOString() : null;
      const expiresAt = currentExpiry || new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
      const storedConfig = addTrialToConfig(client, expiresAt);
      await sql`
        INSERT INTO horizon_demo_configs (slug, client_id, config, expires_at, owner_id, updated_at)
        VALUES (${slug}, ${client.id}, ${JSON.stringify(storedConfig)}::jsonb, ${expiresAt}::timestamptz, ${user.id}, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET client_id = EXCLUDED.client_id, config = EXCLUDED.config, expires_at = EXCLUDED.expires_at, owner_id = EXCLUDED.owner_id, updated_at = NOW()
      `;
      return res.status(200).json({ ok: true, slug, url: `https://${slug}.demo.horizonworks.co.in/`, expiresAt });
    }

    if (action === 'delete') {
      const slug = cleanSlug(body?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      const result = await sql`DELETE FROM horizon_demo_configs WHERE slug = ${slug} AND owner_id = ${user.id} RETURNING slug`;
      if (!result.length) return res.status(404).json({ error: 'Demo not found or you do not have access to it.' });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (error) {
    console.error('Demo store error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Demo storage request failed.' });
  }
}
