import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  segments: string[];
  query: URLSearchParams;
}

function parsePath(): RouteState {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = hash.split('?');
  const path = pathPart || '/';
  const segments = path.split('/').filter(Boolean);
  return { path, segments, query: new URLSearchParams(queryPart) };
}

export function useRouter(): RouteState & { navigate: (to: string) => void } {
  const [state, setState] = useState<RouteState>(parsePath);

  useEffect(() => {
    const onHashChange = () => {
      setState(parsePath());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    window.location.hash = to;
  };

  return { ...state, navigate };
}
