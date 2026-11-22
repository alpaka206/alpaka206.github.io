import { useEffect, useLayoutEffect, useRef } from 'react';
import { useGlobalShortcuts } from '@/os/keyboard';
import { pathFor, type Route } from '@/os/routes';
import { useSession } from '@/os/session';
import { useSettings } from '@/os/settings';
import { registerSystemCommands } from '@/os/systemCommands';
import { topWindow, useWindows, type WindowModel } from '@/os/windows';
import { AboutPanels } from './about/AboutPanels';
import { ControlCenter } from './controlcenter/ControlCenter';
import Dock from './dock/Dock';
import { useDockReserve } from './dock/dockRects';
import { MenuBar } from './menubar/MenuBar';
import { ContextMenuHost } from './menus/ContextMenuHost';
import { Banners } from './notifications/Banners';
import { NotificationCenter } from './notifications/NotificationCenter';
import QuickLookHost from './quicklook/QuickLookHost';
import { SessionLayer } from './session/SessionLayer';
import { Spotlight } from './spotlight/Spotlight';
import DesktopSurface from './surface/DesktopSurface';
import { AppSwitcher } from './switcher/AppSwitcher';
import WindowLayer from './windows/WindowLayer';
import styles from './DesktopShell.module.css';

/** Shared colour names take AppKit's values while the desktop shell is up (tokens.css). */
function useMacPlatform() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.platform = 'mac';
    return () => {
      delete root.dataset.platform;
    };
  }, []);
}

/** Windows zoom and tile within the screen below the menu bar and above what the Dock keeps clear. */
function useDesktopArea() {
  const dock = useDockReserve((s) => s.height);
  useLayoutEffect(() => {
    const update = () => {
      const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mac-menubar-height')) || 0;
      useWindows.getState().setArea({ x: 0, y: top, w: window.innerWidth, h: window.innerHeight - top - dock });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [dock]);
}

/** A shared link (/projects/mearri) opens its window once the desktop first shows. */
function useDeepLink(route: Route | null, desktop: boolean) {
  const opened = useRef(false);
  useEffect(() => {
    if (!desktop || opened.current || route?.kind !== 'app') return;
    opened.current = true;
    useWindows.getState().open(route.app, route.props);
  }, [desktop, route]);
}

/** Link to what the key window shows (its props included, e.g. a Finder window's folder); "/" while the desktop is active. */
function focusedPath({ windows, desktopFocused }: { windows: readonly WindowModel[]; desktopFocused: boolean }) {
  const focused = desktopFocused ? undefined : topWindow(windows);
  return focused ? pathFor(focused.app, focused.props) : '/';
}

/** The address bar follows the key window, so whatever is on screen can be shared. */
function useUrlSync(desktop: boolean) {
  useEffect(() => {
    if (!desktop) return;
    const sync = (state: ReturnType<typeof useWindows.getState>) => {
      const path = focusedPath(state);
      if (path !== window.location.pathname) window.history.replaceState(window.history.state, '', path);
    };
    sync(useWindows.getState());
    return useWindows.subscribe(sync);
  }, [desktop]);
}

/**
 * The Mac: desktop, windows, Dock and the system surfaces in their z-order,
 * a brightness veil, and the session screens (start-up, login, lock) on top.
 * Until someone signs in, the desktop underneath is inert.
 */
export default function DesktopShell({ route }: { route: Route | null }) {
  useMacPlatform();
  const phase = useSession((s) => s.phase);
  const desktop = phase === 'desktop';
  const brightness = useSettings((s) => s.brightness);

  useLayoutEffect(() => useSession.getState().start(route !== null), [route]);
  useEffect(() => registerSystemCommands(), []);
  useGlobalShortcuts(desktop);
  useDesktopArea();
  useDeepLink(route, desktop);
  useUrlSync(desktop);

  return (
    <>
      <div inert={!desktop}>
        <DesktopSurface />
        <WindowLayer />
        <Dock />
        <QuickLookHost />
        <MenuBar />
        <Spotlight />
        <ControlCenter />
        <NotificationCenter />
        <Banners />
        <ContextMenuHost />
        <AppSwitcher />
        <AboutPanels />
      </div>
      <div className={styles.brightness} style={{ opacity: 1 - brightness }} aria-hidden="true" />
      <SessionLayer />
    </>
  );
}
