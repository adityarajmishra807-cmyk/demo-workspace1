import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';

type DemoRecord = Record<string, any>;
const TABLE = 'horizon_demo_configs';

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    // Neon integration with the custom STORAGE prefix used by this project.
    process.env.STORAGE_POSTGRES_URL_NON_POOLING ||
    process.env.STORAGE_POSTGRES_URL ||
    process.env.STORAGE_URL ||
    ''
  );
}

function cleanSlug(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/.test(slug);
}

function validClient(value: unknown): value is DemoRecord {
  if (!value || typeof value !== 'object') return false;
  const client = value as DemoRecord;
  return (
    typeof client.id === 'string' &&
    typeof client.slug === 'string' &&
    typeof client.businessName === 'string' &&
    typeof client.industry === 'string' &&
    typeof client.template === 'string' &&
    client.brandColors &&
    typeof client.brandColors === 'object'
  );
}

function sqlOrError(res: VercelResponse) {
  const connectionString = getConnectionString();
  if (!connectionString) {
    res.status(500).json({
      error: 'Postgres is not configured. Connect a Neon Postgres database to this Vercel project and redeploy.',
    });
    return null;
  }
  return neon(connectionString);
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await sql(`
    CREATE TABLE IF NOT EXISTS ${TABLE} (
      slug TEXT PRIMARY KEY,
      client_id TEXT NOT NULL UNIQUE,
      config JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  const sql = sqlOrError(res);
  if (!sql) return;

  const action = typeof req.query?.action === 'string' ? req.query.action : 'get';

  try {
    await ensureSchema(sql);

    if (action === 'get') {
      const slug = cleanSlug(req.query?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });

      const rows = await sql(`SELECT config FROM ${TABLE} WHERE slug = $1 LIMIT 1`, [slug]);
      if (!rows.length) return res.status(404).json({ error: 'Demo not found.' });

      const config = rows[0].config;
      if (!validClient(config) || config.slug !== slug) {
        return res.status(500).json({ error: 'Stored demo configuration is invalid.' });
      }

      res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=300');
      return res.status(200).json({ data: config });
    }

    if (action === 'list') {
      const rows = await sql(`SELECT config FROM ${TABLE} ORDER BY updated_at DESC`);
      return res.status(200).json({ data: rows.map((row) => row.config).filter(validClient) });
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

    let body: any = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body.' });
      }
    }

    if (action === 'save') {
      const client = body?.client;
      const mode = body?.mode === 'update' ? 'update' : 'create';
      if (!validClient(client)) return res.status(400).json({ error: 'Invalid demo payload.' });

      const slug = cleanSlug(client.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      if (client.slug !== slug) return res.status(400).json({ error: 'Slug must be lowercase letters, numbers, and hyphens only.' });

      const existing = await sql(`SELECT slug, client_id FROM ${TABLE} WHERE slug = $1 OR client_id = $2 LIMIT 1`, [slug, client.id]);
      if (existing.length) {
        const row = existing[0];
        if (mode === 'create' && row.client_id !== client.id) {
          return res.status(409).json({ error: 'That demo slug already exists. Choose a different business name.' });
        }
        if (mode === 'update' && row.slug !== slug) {
          return res.status(409).json({ error: 'Changing the published slug is not supported.' });
        }
      }

      await sql(`
        INSERT INTO ${TABLE} (slug, client_id, config, updated_at)
        VALUES ($1, $2, $3::jsonb, NOW())
        ON CONFLICT (slug) DO UPDATE
        SET client_id = EXCLUDED.client_id,
            config = EXCLUDED.config,
            updated_at = NOW()
      `, [slug, client.id, JSON.stringify(client)]);

      return res.status(200).json({ ok: true, slug, url: `https://${slug}.demo.horizonworks.co.in/` });
    }

    if (action === 'delete') {
      const slug = cleanSlug(body?.slug);
      if (!isValidSlug(slug)) return res.status(400).json({ error: 'Invalid demo slug.' });
      await sql(`DELETE FROM ${TABLE} WHERE slug = $1`, [slug]);
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Unknown action.' });
  } catch (error) {
    console.error('Demo store error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Demo storage request failed.' });
  }
}
