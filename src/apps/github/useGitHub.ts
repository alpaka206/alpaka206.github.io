import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/lib/storage';
import { CACHE_KEY, fetchSnapshot, readCache, type Snapshot } from './api';

/** Nothing comes back where the browser blocks site data: then every visit asks GitHub. */
const cached = () => readCache(readStorage('sessionStorage', CACHE_KEY), Date.now());

type GitHubState = { status: 'loading' } | { status: 'ready'; snapshot: Snapshot } | { status: 'error'; error: unknown };

/**
 * The fresh cached snapshot if there is one, otherwise a request that is
 * aborted if the window closes first. `reload` always asks GitHub again.
 */
export function useGitHub() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<GitHubState>(() => {
    const snapshot = cached();
    return snapshot ? { status: 'ready', snapshot } : { status: 'loading' };
  });

  useEffect(() => {
    if (attempt === 0 && cached()) return;
    const controller = new AbortController();
    fetchSnapshot(controller.signal).then(
      (snapshot) => {
        writeStorage('sessionStorage', CACHE_KEY, JSON.stringify(snapshot));
        setState({ status: 'ready', snapshot });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setState({ status: 'error', error });
      },
    );
    return () => controller.abort();
  }, [attempt]);

  const reload = () => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  };

  return [state, reload] as const;
}
