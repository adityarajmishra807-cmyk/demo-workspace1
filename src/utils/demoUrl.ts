import type { ClientConfig } from '@/types/client';

const DEMO_DOMAIN = 'demo.horizonworks.co.in';

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

export function encodeClientConfig(client: ClientConfig): string {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(client)));
}

export function decodeClientConfig(value: string): ClientConfig | undefined {
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(value));
    const parsed: unknown = JSON.parse(json);

    if (!parsed || typeof parsed !== 'object') return undefined;
    const client = parsed as Partial<ClientConfig>;
    if (typeof client.id !== 'string' || typeof client.slug !== 'string') return undefined;
    if (typeof client.businessName !== 'string' || typeof client.industry !== 'string') return undefined;

    return parsed as ClientConfig;
  } catch {
    return undefined;
  }
}

export function buildShareUrl(client: ClientConfig): string {
  const encoded = encodeClientConfig(client);
  return `https://${client.slug}.${DEMO_DOMAIN}/?config=${encodeURIComponent(encoded)}`;
}
