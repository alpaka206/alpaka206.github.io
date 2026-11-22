import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { create } from 'zustand';
import { useWindowTitles } from '@/desktop/kit/window';
import { springEasing, SPRINGS } from '@/lib/spring';
import { APPS } from '@/os/apps';
import { registerCommand } from '@/os/commands';
import { motionReduced } from '@/os/theme';
import { frameOf, topWindow, useWindows, type Rect, type WindowModel } from '@/os/windows';
import { toTransform } from './animations';
import type { TileZone } from './geometry';
import { MissionControl, type OverviewTarget } from './MissionControl';
import { closeMissionControl, overviewLayout, toggleMissionControl, useMissionControl } from './overview';
import { WindowFrame } from './WindowFrame';
import styles from './WindowLayer.module.css';

/**
 * Windows that have been closed but are still playing their exit. They are
 * captured the moment the store drops them (a synchronous subscription), so
 * React renders them in the same pass and never unmounts the app mid-exit.
 */
const useClosing = create<{ closing: { model: WindowModel; z: number }[] }>(() => ({ closing: [] }));

/** Window stacking: two z-steps per window, so the tiling preview can sit right under the top one. */
const zOf = (index: number) => (index + 1) * 2;

/** How long the pointer rests in the top-left corner before Mission Control opens (ms). */
const HOT_CORNER_DWELL = 250;

/** ⌃↑ (registered command) and the top-left hot corner. */
function useMissionControlTriggers() {
  useEffect(() => {
    const dispose = registerCommand('missionControl.toggle', toggleMissionControl);
    let timer = 0;
    let armed = true;
    const onMove = (event: PointerEvent) => {
      const inCorner = event.clientX <= 1 && event.clientY <= 1;
      if (inCorner && armed && !timer) {
        timer = window.setTimeout(() => {
          timer = 0;
          armed = false;
          toggleMissionControl();
        }, HOT_CORNER_DWELL);
      } else if (!inCorner) {
        window.clearTimeout(timer);
        timer = 0;
        // Leave the corner before it can fire again.
        if (event.clientX > 12 || event.clientY > 12) armed = true;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      dispose();
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);
}

/**
 * Every window, in front-to-back order (z-index), inside the desktop area.
 * The DOM keeps a stable order (by id) so focusing a window never moves its
 * node: an app's iframes and scroll positions survive. Also hosts the tiling
 * preview and Mission Control.
 */
export default function WindowLayer() {
  useMissionControlTriggers();
  const windows = useWindows((s) => s.windows);
  const area = useWindows((s) => s.area);
  const desktopFocused = useWindows((s) => s.desktopFocused);
  const closing = useClosing((s) => s.closing);
  const mission = useMissionControl();
  const titles = useWindowTitles();
  const [hint, setHint] = useState<{ rect: Rect; shown: boolean } | null>(null);

  useEffect(
    () =>
      useWindows.subscribe((state, previous) => {
        const gone = previous.windows.filter((p) => !state.windows.some((w) => w.id === p.id));
        const back = useClosing.getState().closing.filter((c) => state.windows.some((w) => w.id === c.model.id));
        if (!gone.length && !back.length) return;
        useClosing.setState((s) => ({
          closing: [
            ...s.closing.filter((c) => !state.windows.some((w) => w.id === c.model.id)),
            ...gone.map((model) => ({ model, z: zOf(previous.windows.indexOf(model)) })),
          ],
        }));
      }),
    [],
  );

  const onExited = useCallback((id: string) => {
    useClosing.setState((s) => ({ closing: s.closing.filter((c) => c.model.id !== id) }));
  }, []);

  const onTileHint = useCallback((zone: TileZone | null) => {
    const { area: current } = useWindows.getState();
    setHint((h) => (zone ? { rect: frameOf({ placement: zone, rect: current }, current), shown: true } : h && { ...h, shown: false }));
  }, []);

  // Mission Control: the visible windows (of one app, from the Dock menu), spread out.
  const targets = useMemo<OverviewTarget[]>(() => {
    if (!mission.open) return [];
    const visible = windows.filter((w) => !w.minimized && !w.hidden && (!mission.app || w.app === mission.app));
    const bounds = { x: area.x + 48, y: area.y + 40, w: area.w - 96, h: area.h - 72 };
    const layout = overviewLayout(visible.map((w) => ({ id: w.id, rect: frameOf(w, area) })), bounds);
    return visible.map((w) => {
      const rect = layout[w.id]!;
      return { id: w.id, app: w.app, title: titles[w.id] ?? APPS[w.app].name, rect, scale: rect.w / frameOf(w, area).w };
    });
  }, [mission.open, mission.app, windows, area, titles]);
  const targetOf = useMemo(() => new Map(targets.map((t) => [t.id, t.rect])), [targets]);

  useEffect(() => {
    if (mission.open && !targets.length) closeMissionControl();
  }, [mission.open, targets.length]);

  const hideHint = useCallback(() => setHint(null), []);

  const pick = useCallback((id: string) => {
    closeMissionControl();
    useWindows.getState().focus(id);
  }, []);

  const top = topWindow(windows);
  const live = windows.map((model, index) => ({ model, z: zOf(index), closing: false }));
  const all = [...live, ...closing.map((c) => ({ ...c, closing: true }))].sort((a, b) => (a.model.id < b.model.id ? -1 : 1));

  return (
    <div className={styles.layer} data-overview={mission.open || undefined}>
      <div className={styles.dim} />
      {all.map(({ model, z, closing: exiting }) => (
        <WindowFrame
          key={model.id}
          model={model}
          area={area}
          z={z}
          active={!exiting && !desktopFocused && !mission.open && top?.id === model.id}
          closing={exiting}
          onExited={onExited}
          overview={targetOf.get(model.id) ?? null}
          onTileHint={onTileHint}
        />
      ))}
      {hint && <TilePreview rect={hint.rect} shown={hint.shown} z={zOf(windows.length - 1) - 1} onHidden={hideHint} />}
      {mission.open && <MissionControl targets={targets} onPick={pick} onDismiss={closeMissionControl} />}
    </div>
  );
}

/**
 * Where a dragged window will tile: a translucent rounded rect behind it that
 * fades in, glides between zones and fades out.
 */
function TilePreview({ rect, shown, z, onHidden }: { rect: Rect; shown: boolean; z: number; onHidden: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const last = useRef<Rect | null>(null);

  useLayoutEffect(() => {
    const node = el.current;
    if (!node) return;
    const previous = last.current;
    last.current = rect;
    const { easing, duration } = springEasing(SPRINGS.snappy);
    const timing = { duration: motionReduced() ? 1 : duration, easing };
    if (!previous) node.animate({ opacity: [0, 1], transform: ['scale(0.94)', 'none'] }, timing);
    else if (previous !== rect) node.animate({ transformOrigin: ['0 0', '0 0'], transform: [toTransform(previous, rect), 'none'] }, timing);
  }, [rect]);

  useLayoutEffect(() => {
    if (shown || !el.current) return;
    const animation = el.current.animate({ opacity: [1, 0] }, { duration: motionReduced() ? 1 : 160, fill: 'forwards' });
    animation.onfinish = onHidden;
    return () => animation.cancel();
  }, [shown, onHidden]);

  return <div ref={el} className={styles.preview} style={{ translate: `${rect.x}px ${rect.y}px`, width: rect.w, height: rect.h, zIndex: z }} />;
}
