const DEMO_DOMAIN = 'demo.horizonworks.co.in';

export function buildDemoUrl(slug: string): string {
  return `https://${slug}.${DEMO_DOMAIN}/`;
}

export function buildShareUrl(client: { slug: string }): string {
  return buildDemoUrl(client.slug);
}
