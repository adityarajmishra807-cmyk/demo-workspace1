import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ClientForm, { clientConfigToFormData, type ClientFormData } from '@/components/ClientForm';
import { formToClientConfig } from '@/utils/clientBuilder';
import { getClientBySlug, updateClient, slugExists, isProtectedClient } from '@/data/clientRegistry';

export default function EditDemo({
  slug,
  navigate,
}: {
  slug: string;
  navigate: (to: string) => void;
}) {
  const client = getClientBySlug(slug);
  const [saved, setSaved] = useState(false);

  if (!client) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3">Client not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sky-400 hover:text-sky-300 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isProtected = isProtectedClient(client.id);

  const handleSubmit = (data: ClientFormData) => {
    const config = formToClientConfig(data, slugExists, client.id);
    // Preserve the original id and slug for protected clients
    if (isProtected) {
      config.id = client.id;
      config.slug = client.slug;
    }
    updateClient(config);
    setSaved(true);
    setTimeout(() => navigate(`/${config.slug}`), 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Edit Demo {isProtected && <span className="text-white/40 text-base font-normal">(Demo Business)</span>}
        </h2>
        <p className="text-white/50 text-sm mb-8 max-w-2xl">
          Update the configuration for <span className="text-white/80">{client.businessName}</span>. Changes are saved locally.
        </p>

        {saved && (
          <div className="mb-6 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-sm text-emerald-300">
            Changes saved. Redirecting to demo...
          </div>
        )}

        <ClientForm
          initialData={clientConfigToFormData(client)}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard')}
          isEdit
          existingId={client.id}
        />
      </main>
    </div>
  );
}
