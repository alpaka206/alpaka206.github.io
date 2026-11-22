import {
  memo,
  Suspense,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentType,
  type LazyExoticComponent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { flushSync } from 'react-dom';
import { DESKTOP_VIEWS, type DesktopAppProps } from '@/apps/registry';
import { dockRect } from '@/desktop/dock/dockRects';
import { WindowContext, useWindowTitles } from '@/desktop/kit/window';
import { openContextMenu } from '@/desktop/menus/contextMenu';
import { useDrag } from '@/lib/useDrag';
import { APPS } from '@/os/apps';
import { frameOf, toRect, useWindows, type Rect, type WindowModel } from '@/os/windows';
import { animateClose, animateFrame, animateGenie, animateHide, animateOpen, animateOverview, drawnRect } from './animations';
import { centred, clampToScreen, resizeRect, restoreUnderPointer, sameRect, tileZone, type Edges, type TileZone } from './geometry';
import { markReady } from './ready';
import { ResizeHandles } from './ResizeHandles';
import { TrafficLights } from './TrafficLights';
import styles from './WindowFrame.module.css';

/** Presses on these never move the window, even inside a drag region. */
const INTERACTIVE = 'button, a, input, select, textarea, [role="button"], [contenteditable=""], [contenteditable="true"]';

interface WindowFrameProps {
  model: WindowModel;
  area: Rect;
  z: number;
  /** Key window: coloured controls, the stronger shadow. */
  active: boolean;
  /** Closed: play the exit, then report back. */
  closing: boolean;
  onExited: (id: string) => void;
  /** Mission Control target, or null on the desktop. */
  overview: Rect | null;
  /** While dragging: the tiling zone under the pointer, for the preview. */
  onTileHint: (zone: TileZone | null) => void;
}

/** Where a window minimises to when its app has no Dock tile: the middle of the Dock. */
const dockFallback = (): Rect => ({ x: window.innerWidth / 2 - 24, y: window.innerHeight - 64, w: 48, h: 48 });

/** Hidden and inert while minimised or hidden; the window stays mounted, so the app keeps its state. */
function conceal(el: HTMLElement, on: boolean) {
  el.toggleAttribute('data-concealed', on);
  el.inert = on;
}

function ReadyMark({ id }: { id: string }) {
  useEffect(() => markReady(id), [id]);
  return null;
}

/** A quiet placeholder while the app's code downloads: the toolbar band and nothing else. */
function Skeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true">
      <div className={styles.skeletonBar} data-window-drag />
    </div>
  );
}

const store = useWindows.getState;

/**
 * One desktop window: frame, shadow, traffic lights, resize edges, and the
 * app's view in a Suspense boundary. It moves by dragging any
 * [data-window-drag] area that is not a control (the position goes straight
 * to `translate` and is committed on release), tiles at the screen edges,
 * zooms on a double-click, and animates every change of state from wherever
 * it is drawn at that moment.
 */
export const WindowFrame = memo(function WindowFrame({ model, area, z, active, closing, onExited, overview, onTileHint }: WindowFrameProps) {
  const { id, app } = model;
  const frame = frameOf(model, area);
  const el = useRef<HTMLElement>(null);
  /** The layout rect the element has right now: React's frame, or a drag or resize in progress. */
  const laidOut = useRef<Rect>(frame);
  const lastArea = useRef(area);
  const genie = useRef<Animation | null>(null);
  const exiting = useRef<Animation | null>(null);
  const title = useWindowTitles((s) => s[id]) ?? APPS[app].name;
  const context = useMemo(() => ({ id, app, active }), [id, app, active]);
  const View = DESKTOP_VIEWS[app] as LazyExoticComponent<ComponentType<DesktopAppProps>>;

  // ---- Appear, then follow frame changes (zoom, tiling, 가운데로) with a glide ----
  const appear = useEffectEvent(() => {
    const node = el.current!;
    if (model.minimized || model.hidden) conceal(node, true);
    else animateOpen(node, frame, model.origin);
  });
  useLayoutEffect(() => appear(), []);

  const reframe = useEffectEvent(() => {
    const previous = laidOut.current;
    const resized = lastArea.current !== area;
    laidOut.current = frame;
    lastArea.current = area;
    // A browser resize moves zoomed windows at once; Mission Control and the exit own the transform.
    if (sameRect(previous, frame) || resized || overview || closing) return;
    animateFrame(el.current!, drawnRect(el.current!, previous), frame);
  });
  const frameKey = `${frame.x} ${frame.y} ${frame.w} ${frame.h}`;
  useLayoutEffect(() => reframe(), [frameKey, area]);

  // ---- Minimise into the Dock and back out (either one reverses the other mid-way) ----
  const minimise = useEffectEvent((minimized: boolean) => {
    const node = el.current!;
    if (!minimized) conceal(node, false);
    const running = genie.current?.playState === 'running' ? genie.current : null;
    if (running) running.reverse();
    else {
      const icon = dockRect(app);
      genie.current = animateGenie(node, frame, icon ? toRect(icon) : dockFallback(), !minimized);
    }
    const animation = genie.current!;
    animation.onfinish = minimized ? () => conceal(node, true) : () => animation.cancel();
  });
  const minimizedBefore = useRef(model.minimized);
  useLayoutEffect(() => {
    if (minimizedBefore.current === model.minimized) return;
    minimizedBefore.current = model.minimized;
    minimise(model.minimized);
  }, [model.minimized]);

  // ---- ⌘H and back ----
  const hide = useEffectEvent((hidden: boolean) => {
    const node = el.current!;
    if (model.minimized) return;
    if (hidden) animateHide(node, true).onfinish = () => conceal(node, true);
    else {
      conceal(node, false);
      animateHide(node, false);
    }
  });
  const hiddenBefore = useRef(model.hidden);
  useLayoutEffect(() => {
    if (hiddenBefore.current === model.hidden) return;
    hiddenBefore.current = model.hidden;
    hide(model.hidden);
  }, [model.hidden]);

  // ---- Close ----
  const exit = useEffectEvent(() => {
    const node = el.current!;
    if (node.hasAttribute('data-concealed')) return onExited(id);
    exiting.current = animateClose(node, frame);
    exiting.current.onfinish = () => onExited(id);
  });
  useLayoutEffect(() => {
    if (closing) return exit();
    // Opened again before the exit finished: play it back instead of letting it end the window.
    const animation = exiting.current;
    if (!animation) return;
    exiting.current = null;
    animation.onfinish = null;
    animation.reverse();
  }, [closing]);

  // ---- Mission Control ----
  const overviewKey = overview ? `${overview.x} ${overview.y} ${overview.w} ${overview.h}` : '';
  const inOverview = useRef(false);
  const spread = useEffectEvent(() => {
    if (closing || (!overview && !inOverview.current)) return;
    inOverview.current = Boolean(overview);
    animateOverview(el.current!, frame, overview);
  });
  useLayoutEffect(() => spread(), [overviewKey]);

  // A press or tabbing into a window makes it key, so menus and shortcuts follow the keyboard too.
  const makeKey = () => !closing && !overview && !active && store().focus(id);

  // The key window takes keyboard focus, unless something inside it already has it.
  useEffect(() => {
    const node = el.current;
    if (active && node && !node.contains(document.activeElement)) node.focus({ preventScroll: true });
  }, [active]);

  // ---- Moving ----
  const move = useRef<{ base: Rect; dx: number; dy: number; zone: TileZone | null } | null>(null);
  const startMove = useDrag(
    {
      onStart: ({ dx, dy, event }) => {
        const { windows, area: current } = store();
        const live = windows.find((w) => w.id === id);
        if (!live) return;
        let base = laidOut.current;
        if (live.placement !== 'normal') {
          // Pulled out of a zoomed or tiled frame: back to its own size, under the pointer.
          base = clampToScreen(restoreUnderPointer(frameOf(live, current), live.rect, { x: event.clientX, y: event.clientY }), current, window.innerWidth);
          flushSync(() => store().setRect(id, base));
        }
        move.current = { base, dx, dy, zone: null };
      },
      onMove: ({ dx, dy, event }) => {
        const m = move.current;
        const node = el.current;
        if (!m || !node) return;
        const current = store().area;
        const next = clampToScreen({ ...m.base, x: m.base.x + dx - m.dx, y: m.base.y + dy - m.dy }, current, window.innerWidth);
        node.style.translate = `${next.x}px ${next.y}px`;
        laidOut.current = next;
        const zone = tileZone({ x: event.clientX, y: event.clientY }, current, window.innerWidth);
        if (zone !== m.zone) {
          m.zone = zone;
          onTileHint(zone);
        }
      },
      onEnd: () => {
        const m = move.current;
        move.current = null;
        if (!m) return;
        onTileHint(null);
        if (m.zone) store().place(id, m.zone);
        else store().setRect(id, laidOut.current);
      },
      // The browser took the pointer: the window goes back where the drag began, untiled.
      onCancel: () => {
        const m = move.current;
        move.current = null;
        if (!m) return;
        onTileHint(null);
        laidOut.current = m.base;
        if (el.current) el.current.style.translate = `${m.base.x}px ${m.base.y}px`;
      },
    },
    { threshold: 3 },
  );

  const isDragArea = (target: EventTarget | null) => {
    const element = target as Element | null;
    const region = element?.closest('[data-window-drag]');
    return Boolean(region && el.current?.contains(region) && !element?.closest(INTERACTIVE));
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!closing && !overview && isDragArea(event.target)) startMove(event);
  };

  const onDoubleClick = (event: MouseEvent) => {
    if (!closing && !overview && isDragArea(event.target)) store().toggleZoom(id);
  };

  // ---- Resizing ----
  const resize = useRef<{ edges: Edges; start: Rect } | null>(null);
  const startResize = useDrag(
    {
      onMove: ({ dx, dy }) => {
        const r = resize.current;
        const node = el.current;
        if (!r || !node) return;
        // Live resizing relayouts the app on every frame: that is the point of it.
        const next = resizeRect(r.start, r.edges, dx, dy, APPS[app].minSize, store().area);
        node.style.translate = `${next.x}px ${next.y}px`;
        node.style.width = `${next.w}px`;
        node.style.height = `${next.h}px`;
        laidOut.current = next;
      },
      onEnd: () => {
        if (!resize.current) return;
        resize.current = null;
        store().setRect(id, laidOut.current);
      },
      onCancel: () => {
        const r = resize.current;
        resize.current = null;
        const node = el.current;
        if (!r || !node) return;
        laidOut.current = r.start;
        node.style.translate = `${r.start.x}px ${r.start.y}px`;
        node.style.width = `${r.start.w}px`;
        node.style.height = `${r.start.h}px`;
      },
    },
    { threshold: 1 },
  );

  const onResizeStart = (edges: Edges, event: PointerEvent<HTMLElement>) => {
    if (closing || overview) return;
    store().focus(id);
    resize.current = { edges, start: laidOut.current };
    startResize(event);
  };

  // ---- The green button's tiling menu ----
  const showTileMenu = (anchor: DOMRect) => {
    const run = (command: string) => {
      const s = store();
      const live = s.windows.find((w) => w.id === id);
      if (command === 'center') {
        if (live) s.setRect(id, centred(live.rect, s.area));
      } else s.place(id, command as TileZone);
    };
    openContextMenu(
      { clientX: anchor.left, clientY: anchor.bottom + 6 },
      [
        { label: '채우기', command: 'zoomed' },
        'separator',
        { label: '왼쪽 반', command: 'left' },
        { label: '오른쪽 반', command: 'right' },
        'separator',
        { label: '가운데로', command: 'center' },
      ],
      run,
    );
  };

  return (
    <section
      ref={el}
      className={styles.frame}
      style={{ translate: `${frame.x}px ${frame.y}px`, width: frame.w, height: frame.h, zIndex: z }}
      aria-label={title}
      tabIndex={-1}
      data-active={active || undefined}
      data-chrome={APPS[app].chrome ?? 'unified'}
      data-overview={overview ? '' : undefined}
      onPointerDownCapture={makeKey}
      onFocus={makeKey}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
    >
      <div className={styles.surface} inert={overview ? true : undefined}>
        <WindowContext.Provider value={context}>
          <Suspense fallback={<Skeleton />}>
            <ReadyMark id={id} />
            <View windowId={id} props={model.props} />
          </Suspense>
        </WindowContext.Provider>
      </div>
      {/* The title bar around the controls drags the window whatever the app draws there. */}
      <div className={styles.controlsArea} data-window-drag />
      <TrafficLights
        active={active}
        chrome={APPS[app].chrome ?? 'unified'}
        filled={model.placement !== 'normal'}
        onClose={() => store().close(id)}
        onMinimize={() => store().minimize(id)}
        onZoom={() => store().toggleZoom(id)}
        onTileMenu={showTileMenu}
      />
      {!overview && <ResizeHandles onResizeStart={onResizeStart} />}
    </section>
  );
});
