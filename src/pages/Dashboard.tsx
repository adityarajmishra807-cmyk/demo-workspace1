import { useEffect, useState } from 'react';
import { getClientSummaries, getClientById, deleteClient, isProtectedClient, syncRemoteClients } from '@/data/clientRegistry';
import { buildShareUrl } from '@/utils/demoUrl';
import type { ClientConfig, TemplateId } from '@/types/client';
import { LayoutDashboard, Plus, ExternalLink, ArrowLeft, Pencil, Trash2, X, Copy, Check, RefreshCw, Eye, Clock3 } from 'lucide-react';

const templateLabels: Record<TemplateId, string> = {
  luxury: 'Luxury', photography: 'Photography', 'local-service': 'Local Service', restaurant: 'Restaurant / Hospitality', professional: 'Professional Business',
};

type DemoWithTrial = ClientConfig & { expiresAt?: string };
type Countdown = { label: string; expired: boolean };

function getCountdown(client?: ClientConfig): Countdown {
  const expiresAt = (client as DemoWithTrial | undefined)?.expiresAt;
  if (!expiresAt) return { label: '7-day trial', expired: false };
  const remaining = Date.parse(expiresAt) - Date.now();
  if (!Number.isFinite(remaining) || remaining <= 0) return { label: 'Expired', expired: true };

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const label = days > 0
    ? `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
    : `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  return { label, expired: false };
}

export default function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const [summaries, setSummaries] = useState(getClientSummaries());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [copiedId, setCopiedId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [, setNow] = useState(Date.now());

  const refresh = () => setSummaries(getClientSummaries());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const sync = async () => {
    setSyncing(true); setSyncError('');
    try { await syncRemoteClients(); refresh(); } catch (err) { setSyncError(err instanceof Error ? err.message : 'Remote sync unavailable.'); }
    finally { setSyncing(false); }
  };

  useEffect(() => { void sync(); }, []);

  const handleShare = async (id: string) => {
    const client = getClientById(id); if (!client) return;
    try {
      await navigator.clipboard.writeText(buildShareUrl(client));
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch {
      setSyncError('Could not copy the demo link. Your browser may block clipboard access.');
    }
  };

  const handlePreview = (id: string) => {
    const client = getClientById(id); if (!client) return;
    navigate(`/dashboard/preview/${client.slug}`);
  };

  const handleEdit = (slug: string) => navigate(`/dashboard/edit/${encodeURIComponent(slug)}`);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      const response = await fetch(`/api/demo-store?action=delete&slug=${encodeURIComponent(target.slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: target.slug }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok && response.status !== 404) throw new Error(payload?.error || 'Could not delete the published demo.');
      deleteClient(target.id);
      setDeleteTarget(null);
      refresh();
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : 'Could not delete the demo.');
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center"><LayoutDashboard size={22} className="text-white" /></div>
            <div><h1 className="text-lg font-bold tracking-tight">Horizon Works</h1><p className="text-xs text-white/50">Demo Dashboard</p></div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => void sync()} disabled={syncing} title="Sync demos" className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors disabled:opacity-40" aria-label="Sync demos">{syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}</button>
            <a href="#/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><ArrowLeft size={16} /> <span className="hidden sm:inline">Home</span></a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8 sm:mb-10"><h2 className="text-2xl md:text-3xl font-bold mb-2">Client Demos</h2><p className="text-white/50 text-sm max-w-2xl">Create and share client websites from one dashboard. Every new demo receives a 7-day trial and publishes to an isolated subdomain.</p></div>
        {syncError && <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-200">{syncError}</div>}
        <div className="mb-8"><button onClick={() => navigate('/dashboard/create')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-sky-500/20"><Plus size={18} /> Create New Demo</button></div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-xs uppercase tracking-wider text-white/40 font-semibold">
            <div className="col-span-3">Business Name</div><div className="col-span-2">Industry</div><div className="col-span-2">Template</div><div className="col-span-2">Slug</div><div className="col-span-2">Trial</div><div className="col-span-1 text-right">Actions</div>
          </div>

          {summaries.length === 0 ? <div className="px-6 py-12 text-center text-white/40 text-sm">No demos configured yet.</div> : summaries.map((s) => {
            const client = getClientById(s.id);
            const protectedClient = isProtectedClient(s.id);
            const countdown = getCountdown(client);
            const publicUrl = client ? buildShareUrl(client) : '#';

            return (
              <div key={s.id} className="border-t border-white/5">
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition-colors">
                  <div className="col-span-3 min-w-0 font-medium text-sm truncate">{s.businessName}{protectedClient && <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-1.5 py-0.5 rounded">test</span>}</div>
                  <div className="col-span-2 text-sm text-white/60 truncate">{s.industry}</div>
                  <div className="col-span-2 text-sm text-white/60 truncate">{templateLabels[s.template]}</div>
                  <div className="col-span-2 text-sm text-white/40 font-mono truncate">/{s.slug}</div>
                  <div className="col-span-2 min-w-0"><span className={`inline-flex max-w-full items-center gap-1.5 px-2.5 py-1.5 rounded-full font-mono tabular-nums text-[11px] font-semibold whitespace-nowrap overflow-hidden ${countdown.expired ? 'bg-red-500/15 text-red-400' : countdown.label.startsWith('0h') ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'}`}><Clock3 size={12} className="shrink-0" /> <span className="truncate">{countdown.label}</span></span></div>
                  <div className="col-span-1 min-w-0"><ActionButtons client={client} protectedClient={protectedClient} publicUrl={publicUrl} copied={copiedId === s.id} onPreview={() => handlePreview(s.id)} onShare={() => void handleShare(s.id)} onEdit={() => handleEdit(s.slug)} onDelete={() => setDeleteTarget({ id: s.id, name: s.businessName, slug: s.slug })} /></div>
                </div>

                <div className="lg:hidden p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0"><div className="font-semibold text-sm sm:text-base break-words">{s.businessName}{protectedClient && <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-1.5 py-0.5 rounded">test</span>}</div><div className="text-xs text-white/40 font-mono mt-1 break-all">/{s.slug}</div></div>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-mono tabular-nums text-[11px] font-semibold whitespace-nowrap ${countdown.expired ? 'bg-red-500/15 text-red-400' : countdown.label.startsWith('0h') ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-400'}`}><Clock3 size={12} /> {countdown.label}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/45 sm:grid-cols-3"><div><span className="block text-[10px] uppercase tracking-wider text-white/25 mb-1">Industry</span>{s.industry}</div><div><span className="block text-[10px] uppercase tracking-wider text-white/25 mb-1">Template</span>{templateLabels[s.template]}</div><div className="col-span-2 sm:col-span-1"><span className="block text-[10px] uppercase tracking-wider text-white/25 mb-1">Status</span>{countdown.expired ? 'Expired' : 'Active'}</div></div>
                  <div className="mt-4 pt-4 border-t border-white/5"><ActionButtons client={client} protectedClient={protectedClient} publicUrl={publicUrl} copied={copiedId === s.id} onPreview={() => handlePreview(s.id)} onShare={() => void handleShare(s.id)} onEdit={() => handleEdit(s.slug)} onDelete={() => setDeleteTarget({ id: s.id, name: s.businessName, slug: s.slug })} mobile /></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 rounded-2xl border border-white/10 p-5 sm:p-6 bg-white/[0.02]"><h3 className="text-sm font-semibold mb-3 text-white/80">Publishing</h3><p className="text-sm text-white/50 leading-6">Every demo gets a 7-day server-enforced trial. The public URL is <span className="text-sky-400 break-all">&lt;slug&gt;.demo.horizonworks.co.in</span>. The Trial counter shows the exact remaining time.</p></div>
      </main>

      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setDeleteTarget(null)}><div className="max-w-sm w-full rounded-2xl border border-white/10 bg-[#12121a] p-6" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Delete Demo</h3><button onClick={() => setDeleteTarget(null)} className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors" aria-label="Close delete dialog"><X size={20} /></button></div><p className="text-sm text-white/50 mb-6">Delete <span className="text-white/80 font-medium">{deleteTarget.name}</span>? This removes the published demo and its local copy.</p><div className="flex items-center justify-end gap-3"><button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button><button onClick={() => void handleDelete()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-colors"><Trash2 size={16} /> Delete</button></div></div></div>}
    </div>
  );
}

function ActionButtons({
  client,
  protectedClient,
  publicUrl,
  copied,
  onPreview,
  onShare,
  onEdit,
  onDelete,
  mobile = false,
}: {
  client?: ClientConfig;
  protectedClient: boolean;
  publicUrl: string;
  copied: boolean;
  onPreview: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  mobile?: boolean;
}) {
  const buttonClass = 'inline-flex items-center justify-center rounded-lg transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30';
  if (mobile) {
    return <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      <button onClick={onPreview} title="Preview inside Demo Engine" className={`${buttonClass} gap-2 px-3 py-2.5 bg-white/5 text-violet-400 text-xs font-medium`}><Eye size={16} /> Preview</button>
      <button onClick={onShare} title="Copy share link" className={`${buttonClass} gap-2 px-3 py-2.5 bg-white/5 text-emerald-400 text-xs font-medium`}>{copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy Link'}</button>
      {client && <a href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open public demo" aria-label="Open public demo" className={`${buttonClass} gap-2 px-3 py-2.5 bg-white/5 text-sky-400 text-xs font-medium`}><ExternalLink size={16} /> Open</a>}
      {!protectedClient && <button onClick={onEdit} title="Edit demo" className={`${buttonClass} gap-2 px-3 py-2.5 bg-white/5 text-white/70 text-xs font-medium`}><Pencil size={16} /> Edit</button>}
      {!protectedClient && <button onClick={onDelete} title="Delete demo" className={`${buttonClass} gap-2 px-3 py-2.5 bg-white/5 text-red-400 text-xs font-medium`}><Trash2 size={16} /> Delete</button>}
    </div>;
  }

  return <div className="flex items-center justify-end gap-0.5 whitespace-nowrap">
    <button onClick={onPreview} title="Preview inside Demo Engine" aria-label="Preview" className={`${buttonClass} h-9 w-9 text-violet-400`}><Eye size={16} /></button>
    <button onClick={onShare} title="Copy share link" aria-label="Copy share link" className={`${buttonClass} h-9 w-9 text-emerald-400`}>{copied ? <Check size={16} /> : <Copy size={16} />}</button>
    {client && <a href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open public demo" aria-label="Open public demo" className={`${buttonClass} h-9 w-9 text-sky-400`}><ExternalLink size={16} /></a>}
    {!protectedClient && <button onClick={onEdit} title="Edit demo" aria-label="Edit demo" className={`${buttonClass} h-9 w-9 text-white/70`}><Pencil size={16} /></button>}
    {!protectedClient && <button onClick={onDelete} title="Delete demo" aria-label="Delete demo" className={`${buttonClass} h-9 w-9 text-red-400`}><Trash2 size={16} /></button>}
  </div>;
}
