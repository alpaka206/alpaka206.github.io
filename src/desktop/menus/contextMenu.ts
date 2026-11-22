import { create } from 'zustand';
import type { MenuEntry } from '@/os/menus';

/**
 * Right-click menus anywhere on the desktop (icons, Dock, Finder items).
 * Callers describe the entries; the shell renders one menu at a time with the
 * same component as the menu bar. A chosen item calls `onCommand` when given,
 * otherwise runs the item's command through os/commands for the focused window.
 */
export interface ContextMenuRequest {
  x: number;
  y: number;
  entries: MenuEntry[];
  onCommand?: (command: string) => void;
}

export const useContextMenu = create<{ request: ContextMenuRequest | null }>(() => ({ request: null }));

/** `event` is the contextmenu event (its default menu is cancelled), or just the point a menu drops from. */
export function openContextMenu(
  event: Pick<MouseEvent, 'clientX' | 'clientY'> & { preventDefault?: () => void },
  entries: MenuEntry[],
  onCommand?: (command: string) => void,
) {
  event.preventDefault?.();
  useContextMenu.setState({ request: { x: event.clientX, y: event.clientY, entries, onCommand } });
}

export const closeContextMenu = () => useContextMenu.setState({ request: null });
