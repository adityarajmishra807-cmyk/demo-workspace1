import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw } from 'lucide-react';
import { fetchRemoteClient, getClientBySlug } from '@/data/clientRegistry';
import type { ClientConfig } from '@/types/client';
import ClientSite from './ClientSite';

export default function PreviewDemo({ slug, navigate }: { slug: string; navigate: (to: string) => void }) {
  const [client, setClient] = useState<ClientConfig | undefined>(() => getClientBySlug(slug));
  const [loading, setLoading] = useState(!client);
  const [error, setError] = useState('');
  const publicUrl = `https://${slug}.demo.horizonworks.co.in/`;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const remote = await fetchRemoteClient(slug);
      if (!remote || remote.slug !== slug) throw new Error('Demo not found.');
      setClient(remote);
    } catch (err) {
      setClient(undefined);
      setError(err instanceof Error ? err.message : 'Demo could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [slug]);

  return (
    <div className="min-h-screen bg-[#08090d] text-white flex flex-col">
      <div className="sticky top-0 z-[100] h-14 shrink-0 border-b border-white/10 bg-[#0c0d12]/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-white/30 font-mono">{slug}.demo.horizonworks.co.in</span>
          <button onClick={() => void load()} disabled={loading} title="Refresh preview" className="p-2 rounded-lg hover:bg-white/10 text-white/60 disabled:opacity-40 transition-colors">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <a href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open public demo" aria-label={`Open public demo for ${slug}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors">
            <ExternalLink size={15} />
            <span className="hidden sm:inline">Open Public</span>
          </a>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {loading && !client ? (
          <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center text-white/50 text-sm">Loading demo…</div>
        ) : client ? (
          <ClientSite client={client} />
        ) : (
          <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
              <h1 className="text-2xl font-bold mb-3">Unable to load preview</h1>
              <p className="text-white/50 text-sm mb-6">{error || 'This demo could not be found.'}</p>
              <button onClick={() => void load()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-sm font-semibold transition-colors">
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
