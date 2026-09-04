import { useState } from 'react';
import { ArrowLeft, Check, Copy, ExternalLink, Info } from 'lucide-react';
import ClientForm, { emptyFormData, type ClientFormData } from '@/components/ClientForm';
import { formToClientConfig } from '@/utils/clientBuilder';
import { addClient, slugExists } from '@/data/clientRegistry';
import { buildShareUrl } from '@/utils/demoUrl';

type View = 'form' | 'success';

export default function CreateDemo({ navigate }: { navigate: (to: string) => void }) {
  const [view, setView] = useState<View>('form');
  const [demoUrl, setDemoUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handleSubmit = async (data: ClientFormData) => {
    setError('');
    setPublishing(true);
    try {
      const config = formToClientConfig(data, slugExists);
      const response = await fetch('/api/demo-store?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: config, mode: 'create' }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Could not publish the demo.');

      addClient(config);
      const url = buildShareUrl(config);
      setDemoUrl(url);
      setView('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the demo. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(demoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy the demo URL. Please copy it manually.');
    }
  };

  const handleOpenDemo = () => {
    if (demoUrl) window.open(demoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {view === 'form' && (
          <>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Create New Demo</h2>
            <p className="text-white/50 text-sm mb-8 max-w-2xl">
              Fill in the business information below. The finished demo is published to your client subdomain and no longer depends on browser storage or a giant configuration URL.
            </p>

            <div className="mb-8 rounded-xl border border-sky-400/20 bg-sky-500/5 p-4 flex items-start gap-3">
              <Info size={18} className="text-sky-400 shrink-0 mt-0.5" />
              <p className="text-sm text-sky-200/70">
                A clean subdomain is generated from the business name, such as <span className="text-sky-300">client-name.demo.horizonworks.co.in</span>. The website configuration is stored server-side so the same link works on any device.
              </p>
            </div>

            {error && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>}

            <ClientForm
              initialData={emptyFormData}
              submitLabel={publishing ? 'Publishing Demo…' : 'Create Demo'}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/dashboard')}
            />
          </>
        )}

        {view === 'success' && (
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 mb-6"><Check size={32} className="text-emerald-400" /></div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Demo published successfully</h2>
            <p className="text-white/50 text-sm mb-8">This is the clean client URL you can send to the prospect.</p>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8">
              <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Client Demo URL</p>
              <div className="flex items-center gap-3">
                <code className="flex-1 text-sm text-sky-400 text-left break-all">{demoUrl}</code>
                <button onClick={handleCopy} className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors">
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {error && <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/5 p-4 text-sm text-red-300">{error}</div>}

            <div className="flex items-center justify-center gap-4">
              <button onClick={handleOpenDemo} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-lg shadow-sky-500/20"><ExternalLink size={18} /> Open Demo</button>
              <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 hover:bg-white/5 text-white font-semibold text-sm transition-all duration-300">Back to Dashboard</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
