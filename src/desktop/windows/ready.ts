import type { AppId } from '@/os/apps';
import { useWindows } from '@/os/windows';

/**
 * Windows whose app code has loaded and rendered. The Dock keeps bouncing a
 * launching app's icon until one of its windows is ready, like macOS does
 * while an app starts up.
 */
const ready = new Set<string>();

export function markReady(windowId: string) {
  ready.add(windowId);
  return () => {
    ready.delete(windowId);
  };
}

export const isAppReady = (app: AppId) => useWindows.getState().windows.some((w) => w.app === app && ready.has(w.id));
