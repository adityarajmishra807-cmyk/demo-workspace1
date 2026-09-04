import { useEffect, useState } from 'react';
import { useRouter } from '@/utils/router';
import { fetchRemoteClient, getClientBySlug } from '@/data/clientRegistry';
import type { ClientConfig } from '@/types/client';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import CreateDemo from '@/pages/CreateDemo';
import EditDemo from '@/pages/EditDemo';
import PreviewDemo from '@/pages/PreviewDemo';
import ClientSite from '@/pages/ClientSite';

const DEMO_DOMAIN_SUFFIX = '.demo.horizonworks.co.in';

function getDemoSubdomainSlug(): string | undefined {
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(DEMO_DOMAIN_SUFFIX)) return undefined;
  const slug = hostname.slice(0, -DEMO_DOMAIN_SUFFIX.length);
  return slug && !slug.includes('.') ? slug : undefined;
}

function DemoSubdomainSite({ slug }: { slug: string }) {
  const [client, setClient] = useState<ClientConfig | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchRemoteClient(slug)
      .then((remote) => {
        if (cancelled) return;
        if (!remote || remote.slug !== slug) throw new Error('Demo not found.');
        setClient(remote);
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

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-white/60 text-sm">Loading demo…</div>;
  if (!client) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6"><div className="text-center max-w-md"><h1 className="text-2xl font-bold mb-3">Demo not found</h1><p className="text-white/50 text-sm">{error || 'This demo link is invalid or has expired.'}</p></div></div>;
  return <ClientSite client={client} />;
}

function App() {
  const { segments, navigate } = useRouter();
  const demoSubdomainSlug = getDemoSubdomainSlug();

  if (demoSubdomainSlug) return <DemoSubdomainSite slug={demoSubdomainSlug} />;
  if (segments.length === 0) return <Landing navigate={navigate} />;

  if (segments[0] === 'dashboard') {
    if (segments[1] === 'create') return <CreateDemo navigate={navigate} />;
    if (segments[1] === 'edit' && segments[2]) return <EditDemo slug={segments[2]} navigate={navigate} />;
    if (segments[1] === 'preview' && segments[2]) return <PreviewDemo slug={segments[2]} navigate={navigate} />;
    return <Dashboard navigate={navigate} />;
  }

  const slug = segments[0];
  const client = getClientBySlug(slug);

  if (!client) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-3">Demo not found</h1><p className="text-white/50 text-sm mb-6">No client configuration exists for <code className="text-sky-400">/{slug}</code></p><button onClick={() => navigate('/dashboard')} className="text-sky-400 hover:text-sky-300 text-sm font-medium">Back to Dashboard</button></div></div>;

  return <ClientSite client={client} />;
}

export default App;
