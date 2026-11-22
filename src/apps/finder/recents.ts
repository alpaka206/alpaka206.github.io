import { create } from 'zustand';
import type { AppProps } from '@/os/apps';
import { useWindows, type WindowModel } from '@/os/windows';
import type { RecentRef } from './items';

/**
 * Finder's 최근 항목 for this session: documents opened from anywhere (Finder,
 * the Dock, Spotlight, a deep link) are noticed as their windows appear.
 * Quick Look does not count, just as on a Mac.
 */
const LIMIT = 20;

export const useRecents = create<{ refs: RecentRef[] }>(() => ({ refs: [] }));

const same = (a: RecentRef, b: RecentRef) => JSON.stringify(a) === JSON.stringify(b);

export function recordOpen(ref: RecentRef) {
  useRecents.setState((s) => ({ refs: [ref, ...s.refs.filter((r) => !same(r, ref))].slice(0, LIMIT) }));
}

function refOf(window: WindowModel): RecentRef | null {
  switch (window.app) {
    case 'portfolio': {
      const { slug } = window.props as Partial<AppProps['portfolio']>;
      return slug ? { type: 'project', slug } : null;
    }
    case 'preview':
      return { type: 'pdf' };
    case 'notes': {
      const { note } = window.props as Partial<AppProps['notes']>;
      return note ? { type: 'note', note } : null;
    }
    default:
      return null;
  }
}

/**
 * Window id → what it showed last time we looked, so focusing a window is not
 * "opening" it again. A closed window is forgotten: opening it again counts.
 */
const seen = new Map<string, string>();

function observe(windows: readonly WindowModel[]) {
  for (const id of seen.keys()) if (!windows.some((w) => w.id === id)) seen.delete(id);
  for (const window of windows) {
    const ref = refOf(window);
    const key = ref && JSON.stringify(ref);
    if (!ref || !key || seen.get(window.id) === key) continue;
    seen.set(window.id, key);
    recordOpen(ref);
  }
}

observe(useWindows.getState().windows);
useWindows.subscribe((state, previous) => {
  if (state.windows !== previous.windows) observe(state.windows);
});
