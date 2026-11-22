import { useLayoutEffect, type RefObject } from 'react';
import { create } from 'zustand';
import type { AppId, AppProps } from '@/os/apps';
import { pathFor, type Route } from '@/os/routes';
import type { Rect } from './geometry';

/**
 * Phone navigation. Every step (open an app, push a screen inside it, go
 * home) is a browser history entry, so the browser's own back gesture, the
 * Android back button and the in-app back buttons all go through one path:
 * popstate. Home is a step forward, not a jump back by some count of entries:
 * a site in a frame (Blog, Safari) adds entries of its own.
 */
export interface PhoneEntry {
  app: AppId;
  props: Partial<AppProps[AppId]>;
  /** Screens pushed inside the app (Finder → a project). Plain data, so history can restore them. */
  screens: unknown[];
}

/** Where an app was launched from: the rect it zooms out of and the tile it returns to. */
export interface LaunchOrigin {
  rect: Rect;
  /** data-launch id of the tile (Home Screen icon, Dock, folder, widget). */
  key: string;
}

/** What a history entry remembers: the app open in it, null on the Home Screen. */
interface Saved {
  entry: PhoneEntry | null;
}

const KEY = 'phone';
const saved = (state: unknown) => (state as { [KEY]?: Saved } | null)?.[KEY];
const push = (entry: PhoneEntry | null, path: string) => history.pushState({ [KEY]: { entry } }, '', path);
const replace = (entry: PhoneEntry | null, path?: string) => history.replaceState({ [KEY]: { entry } }, '', path);

/** What had focus as each in-app screen was pushed, by stack height: popping the screen puts it back. */
const openers: (Element | null)[] = [];
/** Where focus goes once the stack change has rendered (useStackFocus): a new screen's title, or an opener. */
let pendingFocus: 'title' | Element | null = null;

const sameApp = (a: PhoneEntry, b: PhoneEntry) => a.app === b.app && JSON.stringify(a.props) === JSON.stringify(b.props);

interface PhoneNav {
  /** The app that is open, as history sees it. */
  entry: PhoneEntry | null;
  /** The app on screen: stays set while a closed app zooms back into its icon. */
  shown: PhoneEntry | null;
  /** Null opens the app in place (deep links, history, app switches). */
  origin: LaunchOrigin | null;
  open: <A extends AppId>(app: A, props?: Partial<AppProps[A]>, origin?: LaunchOrigin | null) => void;
  /** To the Home Screen from anywhere in an app. */
  close: () => void;
  push: (screen: unknown, path: string) => void;
  back: () => void;
}

export const usePhoneNav = create<PhoneNav>((set, get) => ({
  entry: null,
  shown: null,
  origin: null,
  open: (app, props = {}, origin = null) => {
    const entry: PhoneEntry = { app, props, screens: [] };
    openers.length = 0;
    push(entry, pathFor(app, props));
    set({ entry, shown: entry, origin });
  },
  close: () => {
    if (!get().entry) return;
    push(null, '/');
    set({ entry: null });
  },
  push: (screen, path) => {
    const current = get().entry;
    if (!current) return;
    const entry = { ...current, screens: [...current.screens, screen] };
    openers[current.screens.length] = document.activeElement;
    pendingFocus = 'title';
    push(entry, path);
    set({ entry, shown: entry });
  },
  back: () => history.back(),
}));

/**
 * Called once on mount. The landing entry becomes the Home Screen and a deep
 * link is pushed on top of it, so "back" from /projects/mearri lands on Home
 * instead of leaving the site. A reload restores whatever was open.
 */
export function startHistory(route: Route | null) {
  const restored = saved(history.state);
  if (restored) {
    usePhoneNav.setState({ entry: restored.entry, shown: restored.entry, origin: null });
    return;
  }
  if (route?.kind !== 'app') {
    replace(null);
    return;
  }
  const entry: PhoneEntry = { app: route.app, props: route.props, screens: [] };
  replace(null, '/');
  push(entry, pathFor(route.app, route.props));
  usePhoneNav.setState({ entry, shown: entry, origin: null });
}

export function listenToHistory() {
  const onPop = (event: PopStateEvent) => {
    const entry = saved(event.state)?.entry ?? null;
    const before = usePhoneNav.getState().entry;
    if (entry && before && sameApp(entry, before) && entry.screens.length !== before.screens.length) {
      const popped = entry.screens.length < before.screens.length;
      pendingFocus = (popped && openers[entry.screens.length]) || 'title';
      openers.length = Math.min(openers.length, entry.screens.length);
    }
    // Going home keeps `shown` until the app has zoomed back into its icon.
    usePhoneNav.setState((s) => (entry ? { entry, shown: entry, origin: entry.app === s.shown?.app ? s.origin : null } : { entry }));
  };
  window.addEventListener('popstate', onPop);
  return () => window.removeEventListener('popstate', onPop);
}

/**
 * The phone around an app view: `close()` goes home, `push()` adds an in-app
 * screen (its data comes back in `screens`), `back()` pops one. While a closed
 * app zooms back into its icon it keeps the screens it had.
 */
export function usePhoneApp<Screen = never>() {
  const screens = usePhoneNav((s) => (s.entry ?? s.shown)?.screens) as Screen[] | undefined;
  const { open, close, push: pushScreen, back } = usePhoneNav.getState();
  return { screens: screens ?? [], open, close, push: pushScreen as (screen: Screen, path: string) => void, back };
}

/**
 * Moves focus with the in-app stack once it has rendered: a pushed screen
 * takes it on its title (the row that opened it has just gone inert), and
 * popping puts it back on that row, or on the title underneath when the row
 * is gone. A screen without a title (a photo viewer) gets its first button.
 */
export function useStackFocus(frame: RefObject<HTMLElement | null>) {
  const shown = usePhoneNav((s) => s.shown);
  useLayoutEffect(() => {
    const target = pendingFocus;
    pendingFocus = null;
    const root = frame.current;
    if (!target || !root) return;
    const candidates: Element[] = [...root.querySelectorAll('[data-screen-title]'), ...root.querySelectorAll('button:enabled, a[href]')];
    if (target !== 'title') candidates.unshift(target);
    // Inside this app and not under a pushed screen; a tap that focused nothing leaves <body> as the opener.
    const next = candidates.find((element): element is HTMLElement => element instanceof HTMLElement && root.contains(element) && !element.closest('[inert]'));
    next?.focus({ preventScroll: true });
  }, [shown, frame]);
}
