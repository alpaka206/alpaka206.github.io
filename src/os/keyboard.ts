import { useEffect } from 'react';
import { create } from 'zustand';
import { runCommand } from './commands';
import { keyEquivalents, menusFor, SYSTEM_MENU } from './menus';
import { matches } from './shortcuts';
import { focusedWindowId, useWindows } from './windows';

/** The menu title that flashes when its key equivalent fires, as on macOS. */
export const useMenuFlash = create<{ title: string | null }>(() => ({ title: null }));

const EDIT = new Set(['edit.undo', 'edit.redo', 'edit.cut', 'edit.copy', 'edit.paste', 'edit.selectAll']);

/** Shortcuts that live outside the menus. */
const EXTRAS: { shortcut: string; command: string }[] = [
  { shortcut: '⌘K', command: 'spotlight.toggle' },
  { shortcut: '⌥⌘D', command: 'dock.toggleAutohide' },
  // Reaches the page only in full screen with keyboard lock (Chromium). ⌥⇥ stays free:
  // Safari uses it to move focus between links and buttons.
  { shortcut: '⌘⇥', command: 'switcher.next' },
  { shortcut: '⌃↑', command: 'missionControl.toggle' },
];

/**
 * One capture-phase listener for the whole desktop. A key runs the command of
 * the focused app's menu item that owns it. Text fields keep their own editing
 * keys (copy, paste, undo, select all); everything else still works while typing.
 * Some keys never reach a page in a normal browser window (⌘W, ⌘Q, ⌘N, ⌘Tab):
 * the browser or macOS takes them first. In full screen, keyboard lock hands
 * most of them over (Chromium), and they behave like a real Mac.
 */
export function useGlobalShortcuts(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    /** A handled shortcut ends here: it must not also type into, or tab out of, the focused control. */
    const consume = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.isComposing || event.repeat) return;
      const target = event.target instanceof Element ? event.target : null;
      const focused = focusedWindowId();
      // A focused panel (Spotlight, an About window) owns its keys: ⌘W must not close the window behind it.
      if (!target?.closest('[data-owns-keys]')) {
        const typing = target?.closest('input, textarea, [contenteditable="true"]');
        const menus = [{ title: 'system', items: SYSTEM_MENU }, ...menusFor(useWindows.getState().focusedApp())];
        for (const { shortcut, command, menuTitle } of keyEquivalents(menus)) {
          if (!matches(event, shortcut)) continue;
          if (typing && EDIT.has(command)) return;
          if (runCommand(command, focused)) {
            consume(event);
            if (menuTitle !== 'system') {
              useMenuFlash.setState({ title: menuTitle });
              window.setTimeout(() => useMenuFlash.setState({ title: null }), 160);
            }
          }
          return;
        }
      }
      for (const { shortcut, command } of EXTRAS) {
        if (matches(event, shortcut) && runCommand(command, focused)) return consume(event);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [enabled]);
}

/** Chromium only: while in full screen, let ⌘W / ⌘N / ⌘Tab and friends reach the page. */
export async function lockSystemKeys() {
  const keyboard = (navigator as Navigator & { keyboard?: { lock?: (codes?: string[]) => Promise<void> } }).keyboard;
  await keyboard?.lock?.().catch(() => undefined);
}
