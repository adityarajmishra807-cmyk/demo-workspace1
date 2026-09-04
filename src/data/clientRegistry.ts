import type { ClientConfig, ClientSummary } from '@/types/client';
import { demoBusiness } from './demoBusiness';

const STORAGE_KEY = 'horizon-works-clients';
const PROTECTED_IDS = ['demo-business'];
const DEMO_DOMAIN_SUFFIX = '.demo.horizonworks.co.in';
const DEMO_ENGINE_ORIGIN = 'https://demo-workspace1.vercel.app';

function loadFromStorage(): ClientConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ClientConfig[];
  } catch {
    return [];
  }
}

function saveToStorage(clients: ClientConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function getAllClients(): ClientConfig[] {
  return [demoBusiness, ...loadFromStorage()];
}

export function getClientSummaries(): ClientSummary[] {
  return getAllClients().map((c) => ({
    id: c.id,
    slug: c.slug,
    businessName: c.businessName,
    industry: c.industry,
    template: c.template,
    status: 'active' as const,
  }));
}

export function getClientBySlug(slug: string): ClientConfig | undefined {
  return getAllClients().find((c) => c.slug === slug);
}

export function getClientById(id: string): ClientConfig | undefined {
  return getAllClients().find((c) => c.id === id);
}

export function isProtectedClient(id: string): boolean {
  return PROTECTED_IDS.includes(id);
}

export function slugExists(slug: string, excludeId?: string): boolean {
  return getAllClients().some((c) => c.slug === slug && c.id !== excludeId);
}

export function addClient(client: ClientConfig): void {
  const stored = loadFromStorage();
  if (stored.some((c) => c.id === client.id)) throw new Error('A client with this ID already exists.');
  saveToStorage([...stored, client]);
}

export function updateClient(client: ClientConfig): void {
  const stored = loadFromStorage();
  const idx = stored.findIndex((c) => c.id === client.id);
  if (idx === -1) throw new Error('Client could not be found for update.');
  const next = [...stored];
  next[idx] = client;
  saveToStorage(next);
}

export function deleteClient(id: string): void {
  if (isProtectedClient(id)) return;
  saveToStorage(loadFromStorage().filter((c) => c.id !== id));
}

async function requestJson(url: string, init?: RequestInit): Promise<any> {
  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Demo API request failed (${response.status}).`);
  return payload;
}

async function apiRequest(action: string, init?: RequestInit, params?: Record<string, string>): Promise<any> {
  const search = new URLSearchParams({ action, ...(params || {}) });
  const path = `/api/demo-store?${search.toString()}`;
  const hostname = window.location.hostname.toLowerCase();

  // A wildcard demo domain may be routed to the Vercel project for HTML while a
  // phone/browser can still fail to resolve a serverless API path on the custom host.
  // Public demo reads therefore use the canonical Demo Engine origin first, with a
  // same-origin fallback for local/preview environments.
  const publicDemo = hostname.endsWith(DEMO_DOMAIN_SUFFIX) && !hostname.includes('demo-workspace1.vercel.app');
  const urls = publicDemo && action === 'get' ? [`${DEMO_ENGINE_ORIGIN}${path}`, path] : [path];
  let lastError: unknown;

  for (const url of urls) {
    try {
      return await requestJson(url, init);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Demo API request failed.');
}

export async function saveRemoteClient(client: ClientConfig, mode: 'create' | 'update' = 'create'): Promise<void> {
  await apiRequest('save', {
    method: 'POST',
    body: JSON.stringify({ client, mode }),
  });
}

export async function deleteRemoteClient(slug: string): Promise<void> {
  await apiRequest('delete', {
    method: 'POST',
    body: JSON.stringify({ slug }),
  });
}

export async function syncRemoteClients(): Promise<ClientConfig[]> {
  const payload = await apiRequest('list');
  const clients = Array.isArray(payload?.data) ? payload.data as ClientConfig[] : [];
  if (clients.length) {
    const byId = new Map(clients.map((client) => [client.id, client]));
    const bySlug = new Map(clients.map((client) => [client.slug, client]));
    const local = loadFromStorage();
    const merged = local.map((item) => byId.get(item.id) || bySlug.get(item.slug) || item);
    for (const remote of clients) {
      if (!merged.some((item) => item.id === remote.id || item.slug === remote.slug)) merged.push(remote);
    }
    saveToStorage(merged);
  }
  return clients;
}

export async function fetchRemoteClient(slug: string): Promise<ClientConfig | undefined> {
  const payload = await apiRequest('get', undefined, { slug });
  return payload?.data as ClientConfig | undefined;
}
