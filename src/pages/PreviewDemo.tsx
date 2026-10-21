import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, Sparkles, WandSparkles } from 'lucide-react';
import { fetchRemoteClient, getClientBySlug } from '@/data/clientRegistry';
import type { ClientConfig } from '@/types/client';
import ClientSite from './ClientSite';

export default function PreviewDemo({ slug, navigate }: { slug: string; navigate: (to: string) => void }) {
  const [client, setClient] = useState<ClientConfig | undefined>(() => getClientBySlug(slug));
  const [loading, setLoading] = useState(!client);
  const [error, setError] = useState('');
  const [instructions, setInstructions] = useState('');
  const [modifying, setModifying] = useState(false);
  const [modifyError, setModifyError] = useState('');
  const [modifySuccess, setModifySuccess] = useState('');
  const publicUrl = `https://${slug}.demo.horizonworks.co.in/`;

  const handleModify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!client || !instructions.trim() || modifying) return;
    setModifying(true);
    setModifyError('');
    setModifySuccess('');
    try {
      const response = await fetch('/api/modify-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ client, instructions: instructions.trim() }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data) throw new Error(payload?.error || 'Could not modify this website.');

      const updatedClient = payload.data as ClientConfig;
      const saveResponse = await fetch('/api/demo-store?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ client: updatedClient, mode: 'update' }),
      });
      const savedPayload = await saveResponse.json().catch(() => ({}));
      if (!saveResponse.ok) throw new Error(savedPayload?.error || 'The changes were generated but could not be published.');
      setClient(updatedClient);
      setInstructions('');
      setModifySuccess('Changes applied and published. The preview below is updated.');
    } catch (err) {
      setModifyError(err instanceof Error ? err.message : 'Could not modify this website. Please try again.');
    } finally {
      setModifying(false);
    }
  };

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

      {client && (
        <section className="shrink-0 border-b border-white/10 bg-[#0c0d12] px-4 py-4 md:px-6">
          <form onSubmit={handleModify} className="mx-auto max-w-5xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><WandSparkles size={17} /></div>
              <div>
                <h2 className="text-sm font-semibold text-white">Modify website with AI</h2>
                <p className="text-xs text-white/40">Describe a change in plain English. Your existing demo link stays the same.</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <textarea
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
                maxLength={2000}
                rows={2}
                placeholder="e.g. Make the design brighter and more minimal, change the hero headline, and add a booking CTA…"
                className="min-h-[76px] flex-1 resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-400/10"
                aria-label="Describe website modifications"
                disabled={modifying}
              />
              <button
                type="submit"
                disabled={modifying || !instructions.trim()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {modifying ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {modifying ? 'Applying changes…' : 'Apply changes'}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-[11px] text-white/30">Changes are saved to the published demo after generation.</p>
              <span className="shrink-0 text-[11px] tabular-nums text-white/25">{instructions.length}/2000</span>
            </div>
            {modifyError && <p role="alert" className="mt-3 rounded-lg border border-red-400/20 bg-red-500/5 px-3 py-2 text-xs text-red-300">{modifyError}</p>}
            {modifySuccess && <p role="status" className="mt-3 rounded-lg border border-emerald-400/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-300">{modifySuccess}</p>}
          </form>
        </section>
      )}

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
