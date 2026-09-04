export type AuthUser = { id: string; name: string; email: string };

async function request(action: string, init?: RequestInit) {
  const response = await fetch(`/api/auth?action=${encodeURIComponent(action)}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || 'Authentication request failed.');
  return payload;
}

export async function getSession(): Promise<AuthUser | null> {
  const payload = await request('session');
  return payload?.user || null;
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const payload = await request('login', { method: 'POST', body: JSON.stringify({ email, password }) });
  return payload.user as AuthUser;
}

export async function signup(name: string, email: string, password: string): Promise<AuthUser> {
  const payload = await request('signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  return payload.user as AuthUser;
}

export async function logout(): Promise<void> { await request('logout'); }
