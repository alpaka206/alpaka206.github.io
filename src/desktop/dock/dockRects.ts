import { create } from 'zustand';
import type { AppId } from '@/os/apps';
import { useSettings } from '@/os/settings';
import { dockMetrics } from './geometry';

/**
 * The Dock's public surface for the rest of the desktop: where each icon is
 * on screen (windows grow out of their app's icon and minimise back into it)
 * and how much of the screen's bottom edge the Dock keeps for itself.
 */
type DockTarget = AppId | 'trash';

const targets = new Map<DockTarget, HTMLElement>();

/** Each tile registers the element that draws its visible icon. Returns the unregister function. */
export function registerDockTarget(key: DockTarget, element: HTMLElement) {
  targets.set(key, element);
  return () => {
    if (targets.get(key) === element) targets.delete(key);
  };
}

/** Screen rect of the visible icon (magnified or not), or null when the Dock has no tile for it. */
export function dockRect(key: DockTarget): DOMRect | null {
  return targets.get(key)?.getBoundingClientRect() ?? null;
}

/**
 * Height kept clear at the bottom of the screen: the shelf and its gap, or 0
 * while the Dock hides itself. It starts from the saved settings, so windows
 * opened before the Dock first renders already leave room for it.
 */
export const useDockReserve = create<{ height: number }>(() => {
  const { dockSize, dockAutohide } = useSettings.getState();
  const m = dockMetrics(dockSize);
  return { height: dockAutohide ? 0 : m.height + m.bottom };
});
