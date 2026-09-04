import { useEffect, useState } from 'react';
import { getClientSummaries, getClientById, deleteClient, isProtectedClient, syncRemoteClients } from '@/data/clientRegistry';
import { buildShareUrl } from '@/utils/demoUrl';
import type { TemplateId } from '@/types/client';
import { LayoutDashboard, Plus, ExternalLink, ArrowLeft, Pencil, Trash2, X, Copy, Check, RefreshCw } from 'lucide-react';

const templateLabels: Record<TemplateId, string> = {
  luxury: 'Luxury', photography: 'Photography', 'local-service': 'Local Service', restaurant: 'Restaurant / Hospitality', professional: 'Professional Business',
};

export default function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const [summaries, setSummaries] = useState(getClientSummaries());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [copiedId, setCopiedId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');

  const refresh = () => setSummaries(getClientSummaries());

  const sync = async () => {
    setSyncing(true); setSyncError('');
    try { await syncRemoteClients(); refresh(); } catch (err) { setSyncError(err instanceof Error ? err.message : 'Remote sync unavailable.'); }
    finally { setSyncing(false); }
  };

  useEffect(() => { void sync(); }, []);

  const handleShare = async (id: string) => {
    const client = getClientById(id); if (!client) return;
    try { await navigator.clipboard.writeText(buildShareUrl(client)); setCopiedId(id); setTimeout(() => setCopiedId(''), 2000); } catch { setCopiedId(''); }
  };

  const handleOpenDemo = (id: string) => {
    const client = getClientById(id); if (!client) return;
    window.open(buildShareUrl(client), '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    try {
      const response = await fetch('/api/demo-store?action=delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: target.slug }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok && response.status !== 404) throw new Error(payload?.error || 'Could not delete the published demo.');
      deleteClient(target.id); setDeleteTarget(null); refresh();
    } catch (err) { setSyncError(err instanceof Error ? err.message : 'Could not delete the demo.'); setDeleteTarget(null); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10"><div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center"><LayoutDashboard size={22} className="text-white" /></div><div><h1 className="text-lg font-bold tracking-tight">Horizon Works</h1><p className="text-xs text-white/50">Demo Dashboard</p></div></div><div className="flex items-center gap-2"><button onClick={() => void sync()} disabled={syncing} title="Sync demos" className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors disabled:opacity-40">{syncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}</button><a href="#/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"><ArrowLeft size={16} /> Home</a></div></div></header>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10"><h2 className="text-2xl md:text-3xl font-bold mb-2">Client Demos</h2><p className="text-white/50 text-sm max-w-2xl">Create and share client websites from one dashboard. Published demos live on isolated subdomains and work across devices.</p></div>
        {syncError && <div className="mb-6 rounded-xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-200">{syncError}</div>}
        <div className="mb-8"><button onClick={() => navigate('/dashboard/create')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20"><Plus size={18} /> Create New Demo</button></div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-xs uppercase tracking-wider text-white/40 font-semibold"><div className="col-span-3">Business Name</div><div className="col-span-2 hidden md:block">Industry</div><div className="col-span-2 hidden md:block">Template</div><div className="col-span-2 hidden md:block">Slug</div><div className="col-span-2 hidden md:block">Status</div><div className="col-span-9 md:col-span-1 text-right">Actions</div></div>
          {summaries.length === 0 ? <div className="px-6 py-12 text-center text-white/40 text-sm">No demos configured yet.</div> : summaries.map((s) => {
            const protectedClient = isProtectedClient(s.id);
            return <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-white/5 items-center hover:bg-white/[0.03] transition-colors"><div className="col-span-3 font-medium text-sm">{s.businessName}{protectedClient && <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-1.5 py-0.5 rounded">test</span>}</div><div className="col-span-2 hidden md:block text-sm text-white/60">{s.industry}</div><div className="col-span-2 hidden md:block text-sm text-white/60">{templateLabels[s.template]}</div><div className="col-span-2 hidden md:block text-sm text-white/40 font-mono">/{s.slug}</div><div className="col-span-2 hidden md:block"><span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s.status}</span></div><div className="col-span-9 md:col-span-1 text-right"><div className="flex items-center justify-end gap-1"><button onClick={() => handleShare(s.id)} title="Copy share link" className="p-2 rounded-lg hover:bg-white/10 text-emerald-400 transition-colors">{copiedId === s.id ? <Check size={16} /> : <Copy size={16} />}</button><button onClick={() => handleOpenDemo(s.id)} title="Open client demo" className="p-2 rounded-lg hover:bg-white/10 text-sky-400 transition-colors"><ExternalLink size={16} /></button>{!protectedClient && <button onClick={() => navigate(`/dashboard/edit/${s.slug}`)} title="Edit" className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors"><Pencil size={16} /></button>}{!protectedClient && <button onClick={() => setDeleteTarget({ id: s.id, name: s.businessName, slug: s.slug })} title="Delete" className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"><Trash2 size={16} /></button>}</div></div></div>;
          })}
        </div>
        <div className="mt-10 rounded-2xl border border-white/10 p-6 bg-white/[0.02]"><h3 className="text-sm font-semibold mb-3 text-white/80">Publishing</h3><p className="text-sm text-white/50 leading-6">Each published demo is stored server-side and served from <span className="text-sky-400">&lt;slug&gt;.demo.horizonworks.co.in</span>. The client URL contains no website configuration payload and the public demo surface cannot render the internal dashboard.</p></div>
      </main>
      {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}><div className="max-w-sm w-full mx-6 rounded-2xl border border-white/10 bg-[#12121a] p-6" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold">Delete Demo</h3><button onClick={() => setDeleteTarget(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/60 transition-colors"><X size={20} /></button></div><p className="text-sm text-white/50 mb-6">Delete <span className="text-white/80 font-medium">{deleteTarget.name}</span>? This removes the published demo and its local copy.</p><div className="flex items-center justify-end gap-3"><button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button><button onClick={() => void handleDelete()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-colors"><Trash2 size={16} /> Delete</button></div></div></div>}
    </div>
  );
}
