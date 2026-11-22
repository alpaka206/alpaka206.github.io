import { createContext, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { create } from 'zustand';
import { registerWindowCommand } from '@/os/commands';
import type { AppId } from '@/os/apps';

/** What an app view knows about the window it is rendered in. */
export interface WindowFrame {
  id: string;
  app: AppId;
  /** Key window: coloured traffic lights, active title, accent selections. */
  active: boolean;
}

export const WindowContext = createContext<WindowFrame | null>(null);

export function useWindowFrame(): WindowFrame {
  const frame = useContext(WindowContext);
  if (!frame) throw new Error('useWindowFrame must be used inside a desktop window');
  return frame;
}

/** Titles shown in the Window menu, the Dock's window list and Mission Control. */
export const useWindowTitles = create<Record<string, string>>(() => ({}));

export function useWindowTitle(title: string) {
  const { id } = useWindowFrame();
  useEffect(() => {
    useWindowTitles.setState({ [id]: title });
    return () => useWindowTitles.setState((titles) => {
      const next = { ...titles };
      delete next[id];
      return next;
    }, true);
  }, [id, title]);
}

/**
 * Handles menu commands (and therefore their shortcuts) while this window is
 * focused, e.g. { 'finder.view.list': () => setView('list') }. Handlers may be
 * new functions every render; only the set of command ids re-registers.
 */
export function useWindowCommands(handlers: Record<string, () => void>) {
  const { id } = useWindowFrame();
  const latest = useRef(handlers);
  useLayoutEffect(() => {
    latest.current = handlers;
  });
  const keys = Object.keys(handlers).sort().join('|');
  useEffect(() => {
    const disposers = keys
      .split('|')
      .filter(Boolean)
      .map((command) => registerWindowCommand(id, command, () => latest.current[command]?.()));
    return () => disposers.forEach((dispose) => dispose());
  }, [id, keys]);
}
