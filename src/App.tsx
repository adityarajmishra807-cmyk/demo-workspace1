import { useEffect, useState } from 'react';
import { useRouter } from '@/utils/router';
import { fetchRemoteClient, getClientBySlug, setActiveUser } from '@/data/clientRegistry';
import { getSession, type AuthUser } from '@/data/auth';
import type { ClientConfig } from '@/types/client';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import CreateDemo from '@/pages/CreateDemo';
import EditDemo from '@/pages/EditDemo';
import PreviewDemo from '@/pages/PreviewDemo';
import ClientSite from '@/pages/ClientSite';
import Login from '@/pages/Login';

const DEMO_DOMAIN_SUFFIX = '.demo.horizonworks.co.in';

function getDemoSubdomainSlug(): string | undefined {
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(DEMO_DOMAIN_SUFFIX)) return undefined;
  const slug = hostname.slice(0, -DEMO_DOMAIN_SUFFIX.length);
  return slug && !slug.includes('.') ? slug : undefined;
}
function DemoUnavailable({ error }: { error?: string }) {
  const expired = error?.toLowerCase().includes('expired');
  return <div className="min-h-[100svh] bg-[#0a0a0f] text-white flex items-center justify-center px-5"><div className="w-full max-w-md text-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 shadow-2xl"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xl">{expired ? '!' : '×'}</div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">{expired ? 'Demo expired' : 'Demo unavailable'}</h1><p className="text-sm leading-6 text-white/55">{error || 'This demo link is invalid or could not be loaded.'}</p></div></div>;
}
function RemoteDemo({ slug }: { slug: string }) {
  const [client, setClient] = useState<ClientConfig | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError('');
    fetchRemoteClient(slug).then((remote) => { if (cancelled) return; if (!remote || remote.slug !== slug) throw new Error('Demo not found.'); setClient(remote); }).catch((err) => { if (cancelled) return; setClient(undefined); setError(err instanceof Error ? err.message : 'Demo could not be loaded.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);
  if (loading) return <div className="min-h-[100svh] bg-[#0a0a0f] flex items-center justify-center text-white/60 text-sm">Loading demo…</div>;
  if (!client) return <DemoUnavailable error={error} />;
  return <ClientSite client={client} />;
}

function ProtectedDashboard({ segments, navigate }: { segments: string[]; navigate: (to: string) => void }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => { getSession().then((current) => { setUser(current); setActiveUser(current?.id || null); }).catch(() => { setUser(null); setActiveUser(null); }).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center text-sm text-white/50">Checking session…</div>;
  if (!user) return <Login onAuthenticated={(authenticated) => { setActiveUser(authenticated.id); setUser(authenticated); }} />;
  if (segments[1] === 'create') return <CreateDemo navigate={navigate} />;
  if (segments[1] === 'edit' && segments[2]) return <EditDemo slug={segments[2]} navigate={navigate} />;
  if (segments[1] === 'preview' && segments[2]) return <PreviewDemo slug={segments[2]} navigate={navigate} />;
  return <Dashboard navigate={navigate} />;
}

function App() {
  const { segments, navigate } = useRouter();
  const demoSubdomainSlug = getDemoSubdomainSlug();
  if (demoSubdomainSlug) return <RemoteDemo slug={demoSubdomainSlug} />;
  if (segments.length === 0) return <Landing navigate={navigate} />;
  if (segments[0] === 'demo' && segments[1]) return <RemoteDemo slug={segments[1]} />;
  if (segments[0] === 'login') return <Login onAuthenticated={(user) => { setActiveUser(user.id); navigate('/dashboard'); }} />;
  if (segments[0] === 'dashboard') return <ProtectedDashboard segments={segments} navigate={navigate} />;

  const slug = segments[0];
  const client = getClientBySlug(slug);
  if (!client) return <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-3">Demo not found</h1><p className="text-white/50 text-sm mb-6">No client configuration exists for <code className="text-sky-400">/{slug}</code></p><button onClick={() => navigate('/')} className="text-sky-400 hover:text-sky-300 text-sm font-medium">Back Home</button></div></div>;
  return <ClientSite client={client} />;
}
export default App;
