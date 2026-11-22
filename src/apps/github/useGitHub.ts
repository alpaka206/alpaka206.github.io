import { useEffect, useState } from 'react';
import { storageArea } from '@/lib/storage';
import { fetchSnapshot, readCache, writeCache, type Snapshot } from './api';

/** Null where the browser blocks site data: then every visit asks GitHub. */
const session = storageArea('sessionStorage');

type GitHubState = { status: 'loading' } | { status: 'ready'; snapshot: Snapshot } | { status: 'error'; error: unknown };

/**
 * The fresh cached snapshot if there is one, otherwise a request that is
 * aborted if the window closes first. `reload` always asks GitHub again.
 */
export function useGitHub() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<GitHubState>(() => {
    const cached = session && readCache(session, Date.now());
    return cached ? { status: 'ready', snapshot: cached } : { status: 'loading' };
  });

  useEffect(() => {
    if (attempt === 0 && session && readCache(session, Date.now())) return;
    const controller = new AbortController();
    fetchSnapshot(controller.signal).then(
      (snapshot) => {
        if (session) writeCache(session, snapshot);
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
