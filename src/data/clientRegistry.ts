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
    if (saved !== serialized) {
      throw new Error('Browser storage did not persist the client data.');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Browser storage is unavailable.';
    throw new Error(`Could not save client data. ${message}`);
  }
}

export function getAllClients(): ClientConfig[] {
  const stored = loadFromStorage();
  return [demoBusiness, ...stored];
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
  if (stored.some((c) => c.id === client.id)) {
    throw new Error('A client with this ID already exists.');
  }

  const next = [...stored, client];
  saveToStorage(next);

  if (!getClientById(client.id)) {
    throw new Error('Client was not found after saving.');
  }
}

export function updateClient(client: ClientConfig): void {
  const stored = loadFromStorage();
  const idx = stored.findIndex((c) => c.id === client.id);
  if (idx === -1) {
    throw new Error('Client could not be found for update.');
  }

  const next = [...stored];
  next[idx] = client;
  saveToStorage(next);

  const saved = getClientById(client.id);
  if (!saved || saved.slug !== client.slug) {
    throw new Error('Client changes were not persisted correctly.');
  }
}

export function deleteClient(id: string): void {
  if (isProtectedClient(id)) return;
  const stored = loadFromStorage();
  const next = stored.filter((c) => c.id !== id);
  saveToStorage(next);

  if (getClientById(id)) {
    throw new Error('Client could not be deleted.');
  }
}
