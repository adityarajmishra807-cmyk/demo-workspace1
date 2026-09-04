import type { ClientConfig, ClientSummary } from '@/types/client';
import { demoBusiness } from './demoBusiness';

const STORAGE_KEY = 'horizon-works-clients';
const PROTECTED_IDS = ['demo-business'];

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
  const serialized = JSON.stringify(clients);
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== serialized) throw new Error('Browser storage did not persist the client data.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Browser storage is unavailable.';
    throw new Error(`Could not save client data. ${message}`);
  }
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

export function mergeRemoteClients(clients: ClientConfig[]): void {
  if (!Array.isArray(clients) || clients.length === 0) return;
  const stored = loadFromStorage();
  const remoteById = new Map(clients.map((client) => [client.id, client]));
  const remoteBySlug = new Map(clients.map((client) => [client.slug, client]));
  const merged: ClientConfig[] = [];
  const seenRemoteIds = new Set<string>();

  for (const local of stored) {
    const remote = remoteById.get(local.id) || remoteBySlug.get(local.slug);
    if (remote) {
      merged.push(remote);
      seenRemoteIds.add(remote.id);
    } else {
      merged.push(local);
    }
  }

  for (const remote of clients) {
    if (!seenRemoteIds.has(remote.id) && !merged.some((item) => item.slug === remote.slug)) merged.push(remote);
  }

  saveToStorage(merged);
}

export async function syncRemoteClients(): Promise<ClientConfig[]> {
  const response = await fetch('/api/demo-store?action=list', { cache: 'no-store' });
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'Could not sync demos.');
  const payload = await response.json();
  const clients = Array.isArray(payload?.data) ? payload.data as ClientConfig[] : [];
  mergeRemoteClients(clients);
  return clients;
}
