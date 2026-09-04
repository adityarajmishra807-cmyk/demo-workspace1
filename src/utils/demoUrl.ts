const DEMO_DOMAIN = 'demo.horizonworks.co.in';
const DEMO_ENGINE_ORIGIN = 'https://demo-workspace1.vercel.app';

export function buildDemoUrl(slug: string): string {
  return `https://${slug}.${DEMO_DOMAIN}/`;
}

export function buildEngineDemoUrl(slug: string): string {
  return `${DEMO_ENGINE_ORIGIN}/#/demo/${encodeURIComponent(slug)}`;
}

export function buildShareUrl(client: { slug: string }): string {
  return buildDemoUrl(client.slug);
}
