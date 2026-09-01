import { useEffect } from 'react';
import type { ClientConfig } from '@/types/client';
import { applyClientTheme, resetTheme } from '@/utils/theme';
import { renderTemplate } from '@/templates';

export default function ClientSite({ client }: { client: ClientConfig }) {
  useEffect(() => {
    applyClientTheme(client);
    document.title = `${client.businessName} — ${client.industry}`;
    return () => {
      resetTheme();
      document.title = 'Horizon Works Demo Engine';
    };
  }, [client]);

  return <div className="client-site">{renderTemplate(client)}</div>;
}
