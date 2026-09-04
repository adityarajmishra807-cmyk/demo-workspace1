import { useEffect, useState } from 'react';
import { useRouter } from '@/utils/router';
import { getClientBySlug } from '@/data/clientRegistry';
import { decodeClientConfig, getLegacyConfigFromSearch } from '@/utils/demoUrl';
import type { ClientConfig } from '@/types/client';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import CreateDemo from '@/pages/CreateDemo';
import EditDemo from '@/pages/EditDemo';
import ClientSite from '@/pages/ClientSite';

const DEMO_DOMAIN_SUFFIX = '.demo.horizonworks.co.in';

function getDemoSubdomainSlug(): string | undefined {
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(DEMO_DOMAIN_SUFFIX)) return undefined;
  const slug = hostname.slice(0, -DEMO_DOMAIN_SUFFIX.length);
  return slug && !slug.includes('.') ? slug : undefined;
}

function DemoSubdomainSite({ slug }: { slug: string }) {
  const [client, setClient] = useState<ClientConfig | undefined>(() => getLegacyConfigFromSearch(window.location.search));
  const [loading, setLoading] = useState(!client);
  const [error, setError] = useState('');

  useEffect(() => {
    const legacy = getLegacyConfigFromSearch(window.location.search);
    if (legacy?.slug === slug) {
      setClient(legacy);
      setLoading(false);
      const cleanUrl = `${window.location.origin}/`;
      window.history.replaceState({}, document.title, cleanUrl);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/demo-store?action=get&slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'Demo could not be loaded.');
        return payload;
      })
      .then((payload) => {
        if (cancelled) return;
        const remote = payload?.data as ClientConfig | undefined;
        if (!remote || remote.slug !== slug) throw new Error('Stored demo data is invalid.');
        setClient(remote);
        setError('');
      })
      .catch((err) => {
        if (cancelled) return;
        setClient(undefined);
        setError(err instanceof Error ? err.message : 'Demo could not be loaded.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60 text-sm">Loading demo…</div>;
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Demo not found</h1>
          <p className="text-white/50 text-sm">{error || 'This demo link is invalid or has expired.'}</p>
        </div>
      </div>
    );
  }

  return <ClientSite client={client} />;
}

function App() {
  const { segments, query, navigate } = useRouter();
  const demoSubdomainSlug = getDemoSubdomainSlug();

  // Public demo subdomains are a client-only surface. They never render dashboard routes.
  if (demoSubdomainSlug) {
    return <DemoSubdomainSite slug={demoSubdomainSlug} />;
  }

  if (segments.length === 0) {
    return <Landing navigate={navigate} />;
  }

  if (segments[0] === 'dashboard') {
    if (segments[1] === 'create') return <CreateDemo navigate={navigate} />;
    if (segments[1] === 'edit' && segments[2]) return <EditDemo slug={segments[2]} navigate={navigate} />;
    return <Dashboard navigate={navigate} />;
  }

  const slug = segments[0];
  const sharedConfig = query.get('config');
  const client = sharedConfig ? decodeClientConfig(sharedConfig) : getClientBySlug(slug);
  const validSharedClient = client && client.slug === slug ? client : undefined;

  if (!validSharedClient) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Demo not found</h1>
          <p className="text-white/50 text-sm mb-6">
            No client configuration exists for <code className="text-sky-400">/{slug}</code>
          </p>
          <button onClick={() => navigate('/dashboard')} className="text-sky-400 hover:text-sky-300 text-sm font-medium">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return <ClientSite client={validSharedClient} />;
}

export default App;
