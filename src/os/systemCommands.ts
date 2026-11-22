import type { NoteId } from '@/content/conversation';
import { copyEmail, openTextVersion, toggleDarkMode } from './actions';
import { registerCommands } from './commands';
import { useSession } from './session';
import { useSettings } from './settings';
import { lockSystemKeys } from './keyboard';
import { focusedWindowId, useWindows, type WindowModel } from './windows';
import type { FinderLocation } from './apps';

const REPO = 'https://github.com/alpaka206/alpaka206.github.io';

/**
 * Full screen, then keyboard lock (Chromium), which hands ⌘W, ⌘N, ⌘Q and ⌘⇥
 * to the page. Must run inside a user gesture; elsewhere both simply fail.
 */
export async function enterFullScreen() {
  if (!document.fullscreenEnabled) return;
  try {
    await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
    await lockSystemKeys();
  } catch {
    // Refused (no gesture, iframe, setting): the page keeps working in the window.
  }
}

async function toggleFullScreen() {
  if (document.fullscreenElement) await document.exitFullscreen();
  else await enterFullScreen();
}

/** Commands every shell understands. Returns a disposer for the effect that registers them. */
export function registerSystemCommands() {
  const windows = useWindows.getState;
  const go = useSession.getState().go;
  /** Runs `act` on the key window; none while the desktop is active, so ⌘W never closes a window behind it. */
  const onKeyWindow = (act: (window: WindowModel) => void) => () => {
    const id = focusedWindowId();
    const key = id ? windows().windows.find((w) => w.id === id) : undefined;
    if (key) act(key);
  };
  const quitKeyApp = onKeyWindow((w) => {
    if (w.app !== 'finder') windows().quit(w.app);
  });
  const openNote = (note: NoteId) => windows().open('notes', { note });
  const openFinder = (location: FinderLocation) => windows().open('finder', { location });
  const closeAll = () => windows().windows.forEach((w) => windows().close(w.id));

  const commands: Record<string, () => void> = {
    'system.settings': () => windows().open('settings'),
    'app.settings': () => windows().open('settings'),
    'system.sleep': () => go('sleep'),
    'system.restart': () => {
      closeAll();
      go('boot');
    },
    'system.shutdown': () => {
      closeAll();
      go('off');
    },
    'system.lock': () => go('locked'),
    'system.logout': () => {
      closeAll();
      go('login');
    },
    'system.forceQuit': quitKeyApp,
    'system.readerMode': openTextVersion,
    'system.copyEmail': () => void copyEmail('Finder'),
    'system.toggleDarkMode': toggleDarkMode,
    'dock.toggleAutohide': () => {
      const { dockAutohide, set } = useSettings.getState();
      set('dockAutohide', !dockAutohide);
    },

    'window.close': onKeyWindow((w) => windows().close(w.id)),
    'window.minimize': onKeyWindow((w) => windows().minimize(w.id)),
    'window.zoom': onKeyWindow((w) => windows().toggleZoom(w.id)),
    'window.fill': onKeyWindow((w) => windows().place(w.id, 'zoomed')),
    'window.tileLeft': onKeyWindow((w) => windows().place(w.id, 'left')),
    'window.tileRight': onKeyWindow((w) => windows().place(w.id, 'right')),
    'window.center': onKeyWindow((w) => {
      const { area } = windows();
      windows().setRect(w.id, { ...w.rect, x: Math.round(area.x + (area.w - w.rect.w) / 2), y: Math.round(area.y + (area.h - w.rect.h) / 3) });
    }),
    'window.cycle': onKeyWindow((key) => {
      const same = windows().windows.filter((w) => w.app === key.app && !w.minimized && !w.hidden);
      if (same.length > 1) windows().focus(same[0]!.id);
    }),
    'window.bringAll': () => windows().raiseApp(windows().focusedApp()),

    'app.quit': quitKeyApp,
    'app.hide': () => {
      const app = windows().focusedApp();
      windows().hideApp(app);
    },
    'app.hideOthers': () => windows().hideApp(windows().focusedApp(), true),
    'app.showAll': () => windows().showAll(),

    'view.fullScreen': () => void toggleFullScreen(),

    'edit.undo': () => document.execCommand('undo'),
    'edit.redo': () => document.execCommand('redo'),
    'edit.cut': () => document.execCommand('cut'),
    'edit.copy': () => document.execCommand('copy'),
    'edit.selectAll': () => document.execCommand('selectAll'),

    'help.shortcuts': () => openNote('shortcuts'),
    'help.source': () => window.open(REPO, '_blank', 'noopener'),
    'open.portfolioPdf': () => windows().open('preview'),
    'open.noteHowBuilt': () => openNote('how-built'),

    'go.recents': () => openFinder('recents'),
    'go.documents': () => openFinder('documents'),
    'go.desktop': () => openFinder('desktop'),
    'go.applications': () => openFinder('applications'),
    'go.projects': () => openFinder('projects'),
    'go.awards': () => openFinder('awards'),
    'finder.newWindow': () => openFinder('projects'),
  };

  return registerCommands(commands);
}
