import type { ClientConfig, ClientSummary } from '@/types/client';
import { demoBusiness } from './demoBusiness';

const STORAGE_KEY = 'horizon-works-clients';
const PROTECTED_IDS = ['demo-business'];

function loadFromStorage(): ClientConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ClientConfig[];
  } catch {
    return [];
  }
}

function saveToStorage(clients: ClientConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  } catch {
    // storage might be full or unavailable — fail silently
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
  stored.push(client);
  saveToStorage(stored);
}

export function updateClient(client: ClientConfig): void {
  const stored = loadFromStorage();
  const idx = stored.findIndex((c) => c.id === client.id);
  if (idx !== -1) {
    stored[idx] = client;
    saveToStorage(stored);
  }
}

export function deleteClient(id: string): void {
  if (isProtectedClient(id)) return;
  const stored = loadFromStorage().filter((c) => c.id !== id);
  saveToStorage(stored);
}
