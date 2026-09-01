import { useState } from 'react';
import { getClientSummaries, getClientById, deleteClient, isProtectedClient } from '@/data/clientRegistry';
import { buildShareUrl } from '@/utils/demoUrl';
import type { TemplateId } from '@/types/client';
import { LayoutDashboard, Plus, ExternalLink, ArrowLeft, Pencil, Trash2, X, Copy, Check } from 'lucide-react';

const templateLabels: Record<TemplateId, string> = {
  luxury: 'Luxury',
  photography: 'Photography',
  'local-service': 'Local Service',
  restaurant: 'Restaurant / Hospitality',
  professional: 'Professional Business',
};

export default function Dashboard({ navigate }: { navigate: (to: string) => void }) {
  const [summaries, setSummaries] = useState(getClientSummaries());
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [copiedId, setCopiedId] = useState('');

  const refresh = () => setSummaries(getClientSummaries());

  const handleShare = async (id: string) => {
    const client = getClientById(id);
    if (!client) return;

    try {
      await navigator.clipboard.writeText(buildShareUrl(client));
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch {
      setCopiedId('');
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    try {
      deleteClient(deleteTarget.id);
      setDeleteTarget(null);
      refresh();
    } catch {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <LayoutDashboard size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Horizon Works</h1>
              <p className="text-xs text-white/50">Demo Dashboard</p>
            </div>
          </div>
          <a href="#/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Client Demos</h2>
          <p className="text-white/50 text-sm max-w-2xl">
            This is the internal dashboard for managing client website demos. Each demo is generated from a configuration file, not a separate codebase.
          </p>
        </div>

        <div className="mb-8">
          <button onClick={() => navigate('/dashboard/create')} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20">
            <Plus size={18} /> Create New Demo
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 text-xs uppercase tracking-wider text-white/40 font-semibold">
            <div className="col-span-3">Business Name</div>
            <div className="col-span-2 hidden md:block">Industry</div>
            <div className="col-span-2 hidden md:block">Template</div>
            <div className="col-span-2 hidden md:block">Slug</div>
            <div className="col-span-2 hidden md:block">Status</div>
            <div className="col-span-9 md:col-span-1 text-right">Actions</div>
          </div>

          {summaries.length === 0 ? (
            <div className="px-6 py-12 text-center text-white/40 text-sm">No demos configured yet.</div>
          ) : (
            summaries.map((s) => {
              const protectedClient = isProtectedClient(s.id);
              return (
                <div key={s.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-t border-white/5 items-center hover:bg-white/[0.03] transition-colors">
                  <div className="col-span-3 font-medium text-sm">
                    {s.businessName}
                    {protectedClient && <span className="ml-2 text-[10px] uppercase tracking-wider text-white/30 bg-white/5 px-1.5 py-0.5 rounded">test</span>}
                  </div>
                  <div className="col-span-2 hidden md:block text-sm text-white/60">{s.industry}</div>
                  <div className="col-span-2 hidden md:block text-sm text-white/60">{templateLabels[s.template]}</div>
                  <div className="col-span-2 hidden md:block text-sm text-white/40 font-mono">/{s.slug}</div>
                  <div className="col-span-2 hidden md:block">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {s.status}
                    </span>
                  </div>
                  <div className="col-span-9 md:col-span-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleShare(s.id)} title="Copy share link" className="p-2 rounded-lg hover:bg-white/10 text-emerald-400 transition-colors">
                        {copiedId === s.id ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                      <button onClick={() => navigate(`/${s.slug}`)} title="Open Demo" className="p-2 rounded-lg hover:bg-white/10 text-sky-400 transition-colors">
                        <ExternalLink size={16} />
                      </button>
                      {!protectedClient && (
                        <button onClick={() => navigate(`/dashboard/edit/${s.slug}`)} title="Edit" className="p-2 rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                          <Pencil size={16} />
                        </button>
                      )}
                      {!protectedClient && (
                        <button onClick={() => setDeleteTarget({ id: s.id, name: s.businessName, slug: s.slug })} title="Delete" className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
          <h3 className="text-sm font-semibold mb-3 text-white/80">How the engine works</h3>
          <ul className="space-y-2 text-sm text-white/50">
            <li>• Each client demo is defined by a configuration object, not separate code.</li>
            <li>• The <span className="text-sky-400">template</span> field selects which visual layout renders.</li>
            <li>• Brand colors, fonts, and all content come from the configuration.</li>
            <li>• Created demos are saved locally for dashboard management.</li>
            <li>• Share links contain the current configuration and work on other devices.</li>
          </ul>
        </div>
      </main>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
          <div className="max-w-sm w-full mx-6 rounded-2xl border border-white/10 bg-[#12121a] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Delete Demo</h3>
              <button onClick={() => setDeleteTarget(null)} className="p-1 rounded-lg hover:bg-white/10 text-white/60 transition-colors"><X size={20} /></button>
            </div>
            <p className="text-sm text-white/50 mb-6">Are you sure you want to delete <span className="text-white/80 font-medium">{deleteTarget.name}</span>? This cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors">Cancel</button>
              <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-colors"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
