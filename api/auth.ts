import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { createHash, randomBytes, scryptSync } from 'node:crypto';

const SESSION_DAYS = 30;
const COOKIE = 'hw_session';

type UserRow = { id: string; name: string; email: string; password_hash: string; created_at: string };

function connectionString() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL_NON_POOLING || process.env.STORAGE_POSTGRES_URL || '';
}
function sqlOrError(res: VercelResponse) {
  const cs = connectionString();
  if (!cs) { res.status(500).json({ error: 'Postgres is not configured.' }); return null; }
  return neon(cs);
}
function normalizeEmail(value: unknown) { return typeof value === 'string' ? value.trim().toLowerCase() : ''; }
function normalizeName(value: unknown) { return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, 80) : ''; }
function hashPassword(password: string, salt: string) { return scryptSync(password, salt, 64).toString('hex'); }
function makePassword(password: string) { const salt = randomBytes(16).toString('hex'); return `${salt}:${hashPassword(password, salt)}`; }
function verifyPassword(password: string, stored: string) { const [salt, hash] = stored.split(':'); return Boolean(salt && hash) && hashPassword(password, salt) === hash; }
function sessionToken() { return randomBytes(32).toString('hex'); }
function cookie(token: string, maxAge: number) { return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`; }
function getCookie(req: VercelRequest, name: string) {
  const raw = typeof req.headers.cookie === 'string' ? req.headers.cookie : '';
  const item = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : '';
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
  await sql`CREATE TABLE IF NOT EXISTS horizon_users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS horizon_sessions (token_hash TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES horizon_users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
  await sql`ALTER TABLE horizon_demo_configs ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES horizon_users(id) ON DELETE CASCADE`;
}

async function currentUser(sql: ReturnType<typeof neon>, req: VercelRequest) {
  const token = getCookie(req, COOKIE);
  if (!token) return null;
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const rows = await sql`SELECT u.id, u.name, u.email FROM horizon_sessions s JOIN horizon_users u ON u.id = s.user_id WHERE s.token_hash = ${tokenHash} AND s.expires_at > NOW() LIMIT 1`;
  return rows[0] || null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  const sql = sqlOrError(res); if (!sql) return;
  const action = typeof req.query?.action === 'string' ? req.query.action : 'session';
  try {
    await ensureSchema(sql);
    if (action === 'session') return res.status(200).json({ user: await currentUser(sql, req) });
    if (action === 'logout') {
      const token = getCookie(req, COOKIE);
      if (token) await sql`DELETE FROM horizon_sessions WHERE token_hash = ${createHash('sha256').update(token).digest('hex')}`;
      res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
      return res.status(200).json({ ok: true });
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
    let body: any = req.body; if (typeof body === 'string') body = JSON.parse(body);
    if (action === 'signup') {
      const name = normalizeName(body?.name); const email = normalizeEmail(body?.email); const password = typeof body?.password === 'string' ? body.password : '';
      if (name.length < 2) return res.status(400).json({ error: 'Enter your full name.' });
      if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
      if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
      const exists = await sql`SELECT id FROM horizon_users WHERE email = ${email} LIMIT 1`; if (exists.length) return res.status(409).json({ error: 'An account with that email already exists.' });
      const userRows = await sql`INSERT INTO horizon_users (name, email, password_hash) VALUES (${name}, ${email}, ${makePassword(password)}) RETURNING id, name, email`;
      const user = userRows[0];
      // Preserve existing demos for the first account created on this engine.
      const countRows = await sql`SELECT COUNT(*)::int AS count FROM horizon_users`;
      if (countRows[0]?.count === 1) await sql`UPDATE horizon_demo_configs SET owner_id = ${user.id} WHERE owner_id IS NULL`;
      const token = sessionToken(); const tokenHash = createHash('sha256').update(token).digest('hex');
      await sql`INSERT INTO horizon_sessions (token_hash, user_id, expires_at) VALUES (${tokenHash}, ${user.id}, NOW() + ${SESSION_DAYS} * INTERVAL '1 day')`;
      res.setHeader('Set-Cookie', cookie(token, SESSION_DAYS * 86400));
      return res.status(201).json({ user });
    }
    if (action === 'login') {
      const email = normalizeEmail(body?.email); const password = typeof body?.password === 'string' ? body.password : '';
      const rows = await sql`SELECT id, name, email, password_hash FROM horizon_users WHERE email = ${email} LIMIT 1`;
      if (!rows.length || !verifyPassword(password, rows[0].password_hash)) return res.status(401).json({ error: 'Invalid email or password.' });
      const user: UserRow = rows[0]; const token = sessionToken(); const tokenHash = createHash('sha256').update(token).digest('hex');
      await sql`INSERT INTO horizon_sessions (token_hash, user_id, expires_at) VALUES (${tokenHash}, ${user.id}, NOW() + ${SESSION_DAYS} * INTERVAL '1 day')`;
      res.setHeader('Set-Cookie', cookie(token, SESSION_DAYS * 86400));
      return res.status(200).json({ user: { id: user.id, name: user.name, email: user.email } });
    }
    return res.status(400).json({ error: 'Unknown auth action.' });
  } catch (error) {
    console.error('Auth error:', error); return res.status(500).json({ error: error instanceof Error ? error.message : 'Authentication request failed.' });
  }
}
