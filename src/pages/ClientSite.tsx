import { useEffect, useState } from 'react';
import type { ClientConfig } from '@/types/client';
import { applyClientTheme, resetTheme } from '@/utils/theme';
import { renderTemplate } from '@/templates';

function isExpired(client: ClientConfig): boolean {
  return Boolean(client.expiresAt && Date.parse(client.expiresAt) <= Date.now());
}

function ExpiredDemo() {
  return (
    <div className="min-h-[100svh] bg-[#0a0a0f] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md text-center rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 shadow-2xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xl">!</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Demo expired</h1>
        <p className="text-sm leading-6 text-white/55">This demo link was available for 7 days and is no longer active.</p>
      </div>
    </div>
  );
}

export default function ClientSite({ client }: { client: ClientConfig }) {
  const [expired, setExpired] = useState(() => isExpired(client));

  useEffect(() => {
    applyClientTheme(client);
    document.title = `${client.businessName} — ${client.industry}`;

    const expiresAt = client.expiresAt ? Date.parse(client.expiresAt) : NaN;
    let timer: number | undefined;
    if (Number.isFinite(expiresAt)) {
      const check = () => {
        const nowExpired = expiresAt <= Date.now();
        setExpired(nowExpired);
        if (!nowExpired) timer = window.setTimeout(check, Math.min(expiresAt - Date.now(), 60000));
      };
      check();
    }

    return () => {
      if (timer) window.clearTimeout(timer);
      resetTheme();
      document.title = 'Horizon Works Demo Engine';
    };
  }, [client]);

  if (expired) return <ExpiredDemo />;
  return <div className="client-site">{renderTemplate(client)}</div>;
}
