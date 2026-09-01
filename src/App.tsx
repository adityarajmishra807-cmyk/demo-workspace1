import { useRouter } from '@/utils/router';
import { getClientBySlug } from '@/data/clientRegistry';
import { decodeClientConfig } from '@/utils/demoUrl';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import CreateDemo from '@/pages/CreateDemo';
import EditDemo from '@/pages/EditDemo';
import ClientSite from '@/pages/ClientSite';

function App() {
  const { segments, query, navigate } = useRouter();

  if (segments.length === 0) {
    return <Landing navigate={navigate} />;
  }

  if (segments[0] === 'dashboard') {
    if (segments[1] === 'create') {
      return <CreateDemo navigate={navigate} />;
    }
    if (segments[1] === 'edit' && segments[2]) {
      return <EditDemo slug={segments[2]} navigate={navigate} />;
    }
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

  return <ClientSite client={validSharedClient} />;
}

export default App;
