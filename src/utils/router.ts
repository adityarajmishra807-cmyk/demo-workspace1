import { useState, useEffect } from 'react';

export interface RouteState {
  path: string;
  segments: string[];
}

function parsePath(): RouteState {
  const hash = window.location.hash.replace(/^#/, '');
  const path = hash || '/';
  const segments = path.split('/').filter(Boolean);
  return { path, segments };
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
