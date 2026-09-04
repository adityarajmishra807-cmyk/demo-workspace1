import { useRouter } from '@/utils/router';
import { getClientBySlug } from '@/data/clientRegistry';
import { decodeClientConfig } from '@/utils/demoUrl';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import CreateDemo from '@/pages/CreateDemo';
import EditDemo from '@/pages/EditDemo';
import ClientSite from '@/pages/ClientSite';

const DEMO_DOMAIN_SUFFIX = '.demo.horizonworks.co.in';

function getDemoSubdomainSlug(): string | undefined {
  const hostname = window.location.hostname.toLowerCase();
  if (!hostname.endsWith(DEMO_DOMAIN_SUFFIX)) return undefined;

  const slug = hostname.slice(0, -DEMO_DOMAIN_SUFFIX.length);
  return slug && !slug.includes('.') ? slug : undefined;
}

function App() {
  const { segments, query, navigate } = useRouter();
  const demoSubdomainSlug = getDemoSubdomainSlug();

  // Demo subdomains are intentionally isolated from the management dashboard.
  // The configuration is carried by the shareable URL payload.
  if (demoSubdomainSlug) {
    const sharedConfig = new URLSearchParams(window.location.search).get('config');
    const client = sharedConfig
      ? decodeClientConfig(sharedConfig)
      : getClientBySlug(demoSubdomainSlug);
    const validClient = client && client.slug === demoSubdomainSlug ? client : undefined;

    if (!validClient) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-3">Demo not found</h1>
            <p className="text-white/50 text-sm">
              This demo link is invalid or has expired.
            </p>
          </div>
        </div>
      );
    }

    return <ClientSite client={validClient} />;
  }

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
