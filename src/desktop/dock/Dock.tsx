import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type RefObject } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { openContextMenu, useContextMenu } from '@/desktop/menus/contextMenu';
import { useRefraction } from '@/lib/liquidGlass';
import { springEasing, SPRINGS } from '@/lib/spring';
import type { AppId } from '@/os/apps';
import { useSettings } from '@/os/settings';
import { toRect, useWindows } from '@/os/windows';
import { dockMenu } from './dockMenu';
import { dockRect, useDockReserve } from './dockRects';
import { DockTile, tileName, type TileItem } from './DockTile';
import { dockMetrics, fitTile, layoutSlots, shelfWidth, type DockMetrics } from './geometry';
import { dockItems, type StackId } from './items';
import { StackPopover } from './StackPopover';
import { resolveView, STACKS, type StackView } from './stacks';
import { useMagnifier } from './useMagnifier';
import styles from './Dock.module.css';

/** How long the pointer may be gone before an auto-hiding Dock slides away (ms). */
const AUTOHIDE_DELAY = 400;

/**
 * The part of the screen the Dock may use: the safe area, clear of a landscape
 * phone's rounded corners and home indicator (on a Mac it is the whole screen).
 */
function useSafeArea(layer: RefObject<HTMLElement | null>) {
  const [safe, setSafe] = useState({ width: window.innerWidth, bottom: 0 });
  useLayoutEffect(() => {
    const element = layer.current!;
    const observer = new ResizeObserver(() =>
      setSafe({ width: element.clientWidth, bottom: window.innerHeight - element.getBoundingClientRect().bottom }),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [layer]);
  return safe;
}

/**
 * Open, bring forward or launch, as a click on a Dock icon does on macOS:
 * an app with visible windows brings all of them to the front, a hidden app
 * comes back, an app whose windows are all minimised restores the latest one,
 * and an app with no window opens one out of the icon. Returns true on launch.
 */
function activateApp(app: AppId, origin: DOMRect | null): boolean {
  const store = useWindows.getState();
  const own = store.windows.filter((w) => w.app === app);
  if (!own.length) {
    store.open(app, {}, origin ? toRect(origin) : undefined);
    return true;
  }
  const shown = own.filter((w) => !w.minimized && !w.hidden);
  const hidden = own.filter((w) => w.hidden);
  // Back to front, so the window that was on top stays on top.
  if (shown.length) shown.forEach((w) => store.focus(w.id));
  else if (hidden.length) hidden.forEach((w) => store.focus(w.id));
  else store.focus(own.at(-1)!.id);
  return false;
}

const px = (n: number) => `${n}px`;

function cssVars(m: DockMetrics, width: number): CSSProperties {
  const hide = springEasing(SPRINGS.smooth);
  return {
    '--tile': px(m.tile),
    '--icon': px(m.icon),
    '--pad-top': px(m.padTop),
    '--height': px(m.height),
    '--bottom': px(m.bottom),
    '--radius': px(m.radius),
    '--divider-line': px(m.dividerLine),
    '--dot': px(m.dot),
    '--dot-top': px(m.padTop + (m.tile + m.icon) / 2 + m.dotDrop),
    '--squircle-top': px(m.padTop + (m.tile - m.icon) / 2),
    '--magnified': px(m.magnified),
    '--rest': m.tile / m.magnified,
    '--width': px(width),
    '--hide-easing': hide.easing,
    '--hide-duration': `${hide.duration}ms`,
  } as CSSProperties;
}

interface OpenStack {
  id: StackId;
  anchor: DOMRect;
  dockTop: number;
}

/**
 * The macOS 27 Dock: measured geometry (geometry.ts), the Liquid Glass shelf
 * (refracting in Chromium), magnification, running dots, launch bounce, the
 * name label, stacks, the Trash, right-click menus, auto-hide and a keyboard
 * toolbar (← → Home End, Return, the menu key).
 */
export default function Dock() {
  const windows = useWindows((s) => s.windows);
  // Running apps as a stable key: focusing a window reorders `windows` but changes nothing here.
  const runningKey = [...new Set(windows.map((w) => w.app))].sort().join(' ');
  const items = useMemo(() => dockItems(new Set(runningKey.split(' ').filter(Boolean) as AppId[])), [runningKey]);
  const settings = useSettings(useShallow((s) => ({ size: s.dockSize, magnification: s.dockMagnification, autohide: s.dockAutohide })));
  const layer = useRef<HTMLDivElement>(null);
  const safe = useSafeArea(layer);

  const dividers = items.filter((item) => item.kind === 'divider').length;
  const tile = fitTile(settings.size, items.length - dividers, dividers, safe.width);
  const metrics = useMemo(() => dockMetrics(tile, settings.magnification), [tile, settings.magnification]);
  const slots = useMemo(() => layoutSlots(items.map((item) => (item.kind === 'divider' ? 'divider' : 'tile')), metrics), [items, metrics]);
  const width = shelfWidth(slots, metrics);

  useLayoutEffect(() => {
    useDockReserve.setState({ height: settings.autohide ? 0 : metrics.height + metrics.bottom + safe.bottom });
  }, [settings.autohide, metrics, safe.bottom]);

  const { itemRefs, artRefs, shelfRef, zoneRef, labelRef, setLabelTarget, onPointerMove, onPointerLeave } = useMagnifier(slots, metrics, settings.magnification);
  const dock = useRef<HTMLDivElement>(null);
  // The rim bends what is behind it over about a fifth of the tile, as in the capture.
  const lens = useRefraction(shelfRef, { radius: metrics.radius, bezel: metrics.tile * 0.22, strength: metrics.tile * 0.4 });

  const [label, setLabel] = useState(-1);
  const [focusIndex, setFocusIndex] = useState(0);
  const [stack, setStack] = useState<OpenStack | null>(null);
  const [views, setViews] = useState<Record<StackId, StackView>>({ awards: 'auto', documents: 'auto' });
  const menuOpen = useContextMenu((s) => s.request !== null);
  const hidden = useAutohide(settings.autohide, dock, stack !== null || menuOpen);

  const showLabel = (index: number) => {
    setLabel(index);
    setLabelTarget(index);
  };

  const tabStop = items[focusIndex]?.kind === 'divider' || !items[focusIndex] ? 0 : focusIndex;

  const onKeyDown = (event: KeyboardEvent) => {
    const order = [...(dock.current?.querySelectorAll<HTMLButtonElement>('[data-tile] > button') ?? [])];
    const at = order.indexOf(document.activeElement as HTMLButtonElement);
    const next = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: order.length - 1 }[event.key];
    if (at < 0 || next === undefined) return;
    event.preventDefault();
    order[Math.min(Math.max(next, 0), order.length - 1)]?.focus();
  };

  const activate = (item: TileItem, origin: DOMRect, index: number): boolean => {
    if (item.kind === 'app') return activateApp(item.app, origin);
    if (item.kind === 'trash') {
      useWindows.getState().open('finder', { location: 'trash' }, toRect(origin));
      return false;
    }
    const closing = stack?.id === item.stack;
    setStack(closing ? null : { id: item.stack, anchor: origin, dockTop: dock.current!.getBoundingClientRect().top });
    showLabel(closing ? index : -1);
    return false;
  };

  const showMenu = (item: TileItem, point: { clientX: number; clientY: number }) => {
    const menu = dockMenu(item, {
      activate: () => item.kind === 'app' && activateApp(item.app, dockRect(item.app)),
      setStackView: (view) => item.kind === 'stack' && setViews((v) => ({ ...v, [item.stack]: view })),
    });
    if (!menu) return;
    showLabel(-1);
    openContextMenu({ clientX: point.clientX, clientY: point.clientY, preventDefault: () => undefined }, menu.entries, menu.run);
  };

  const closeStack = (refocus: boolean) => {
    const id = stack?.id;
    setStack(null);
    if (refocus && id) dock.current?.querySelector<HTMLElement>(`[data-stack="${id}"] > button`)?.focus();
  };

  return (
    <div ref={layer} className={styles.layer}>
      <div
        ref={dock}
        className={styles.dock}
        role="toolbar"
        aria-label="Dock"
        aria-orientation="horizontal"
        style={cssVars(metrics, width)}
        data-hidden={hidden || undefined}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onKeyDown={onKeyDown}
      >
        <div ref={shelfRef} className={styles.shelf} style={lens ? ({ '--lens': lens } as CSSProperties) : undefined} />
        <div ref={zoneRef} className={styles.zone} />
        {items.map((item, i) => {
          const slot = slots[i]!;
          const place = { left: slot.start, width: slot.size };
          const track = (element: HTMLElement | null) => {
            itemRefs.current[i] = element;
          };
          if (item.kind === 'divider') {
            return <div key={item.key} ref={track} className={styles.divider} style={place} role="separator" />;
          }
          return (
            <div
              key={item.key}
              ref={track}
              className={styles.item}
              style={place}
              data-tile
              data-running={(item.kind === 'app' && item.running) || undefined}
              data-stack={item.kind === 'stack' ? item.stack : undefined}
            >
              <DockTile
                item={item}
                metrics={metrics}
                tabbable={i === tabStop}
                expanded={item.kind === 'stack' && stack?.id === item.stack}
                artRef={(element) => {
                  artRefs.current[i] = element;
                }}
                onActivate={(origin) => activate(item, origin, i)}
                onMenu={(point) => showMenu(item, point)}
                onHover={(hovered) => {
                  if (hovered && !stack) showLabel(i);
                  else if (!hovered && label === i) showLabel(-1);
                }}
                onFocus={() => {
                  setFocusIndex(i);
                  if (!stack) showLabel(i);
                }}
              />
              {item.kind === 'app' && <span className={styles.dot} aria-hidden="true" />}
            </div>
          );
        })}
        <span ref={labelRef} className={styles.label} data-shown={(label >= 0 && !stack && !menuOpen) || undefined} aria-hidden="true">
          {items[label] && items[label].kind !== 'divider' ? tileName(items[label]) : ''}
        </span>
      </div>
      {stack && (
        <StackPopover
          stack={stack.id}
          view={resolveView(views[stack.id], STACKS[stack.id].entries.length)}
          anchor={stack.anchor}
          dockTop={stack.dockTop}
          onClose={closeStack}
        />
      )}
    </div>
  );
}

/**
 * Dock auto-hide (⌥⌘D): the Dock slides off the bottom edge and comes back
 * when the pointer touches that edge or keyboard focus enters it, then leaves
 * again shortly after the pointer does. It stays while one of its stacks or
 * menus is showing.
 */
function useAutohide(enabled: boolean, dock: RefObject<HTMLDivElement | null>, pinned: boolean) {
  const [hidden, setHidden] = useState(true);
  const live = useRef({ over: false, pinned, timer: 0 });

  useEffect(() => {
    const s = live.current;
    s.pinned = pinned;
    if (!enabled || pinned || s.over) return;
    // A stack or menu just closed: leave unless the pointer comes back.
    s.timer = window.setTimeout(() => setHidden(true), AUTOHIDE_DELAY);
    return () => window.clearTimeout(s.timer);
  }, [enabled, pinned]);

  useEffect(() => {
    if (!enabled) return;
    const s = live.current;
    const element = dock.current;
    const update = (over: boolean) => {
      if (over === s.over) return;
      s.over = over;
      window.clearTimeout(s.timer);
      if (over) setHidden(false);
      else s.timer = window.setTimeout(() => !s.over && !s.pinned && setHidden(true), AUTOHIDE_DELAY);
    };
    const onMove = (event: PointerEvent) =>
      update(event.clientY >= window.innerHeight - 2 || Boolean(element?.contains(event.target as Node)));
    const onFocusIn = () => update(true);
    const onFocusOut = (event: FocusEvent) => update(Boolean(element?.contains(event.relatedTarget as Node)));
    const onLeaveWindow = () => update(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    element?.addEventListener('focusin', onFocusIn);
    element?.addEventListener('focusout', onFocusOut);
    return () => {
      window.clearTimeout(s.timer);
      s.over = false;
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      element?.removeEventListener('focusin', onFocusIn);
      element?.removeEventListener('focusout', onFocusOut);
    };
  }, [enabled, dock]);

  return enabled && hidden;
}
