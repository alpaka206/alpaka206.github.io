import { create } from 'zustand';
import type { AppId } from '@/os/apps';
import type { Rect } from '@/os/windows';

/**
 * Mission Control (⌃↑, the top-left hot corner) and its per-app variant
 * ("모든 윈도우 보기" in the Dock menu): every visible window spread out
 * without overlap, so one click picks it.
 */
interface MissionControlState {
  open: boolean;
  /** Only this app's windows, or all of them. */
  app: AppId | null;
}

export const useMissionControl = create<MissionControlState>(() => ({ open: false, app: null }));

export const openMissionControl = (app: AppId | null = null) => useMissionControl.setState({ open: true, app });
export const closeMissionControl = () => useMissionControl.setState({ open: false, app: null });
export const toggleMissionControl = () =>
  useMissionControl.getState().open ? closeMissionControl() : openMissionControl();

/** Space between windows, both ways. */
const GAP = 32;
/** Room under each window for its title. */
const LABEL = 28;
/** Even a lone window shrinks a little, so the overview reads as one. */
const MAX_SCALE = 0.88;

const centre = (r: Rect) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

/**
 * One scale for every window (proportions kept), rows that never overlap,
 * windows taken in reading order of where they are now so the overview
 * resembles the desktop. Tries every row count and keeps the one that shows
 * the windows largest.
 */
export function overviewLayout(frames: readonly { id: string; rect: Rect }[], bounds: Rect): Record<string, Rect> {
  if (!frames.length) return {};
  const ordered = [...frames].sort((a, b) => centre(a.rect).y - centre(b.rect).y || centre(a.rect).x - centre(b.rect).x);

  let best: { scale: number; rows: (typeof frames)[number][][] } | undefined;
  for (let count = 1; count <= ordered.length; count++) {
    const rows: (typeof frames)[number][][] = [];
    let taken = 0;
    for (let r = 0; r < count; r++) {
      const size = Math.ceil((ordered.length - taken) / (count - r));
      rows.push(ordered.slice(taken, taken + size).sort((a, b) => centre(a.rect).x - centre(b.rect).x));
      taken += size;
    }
    const widest = Math.min(...rows.map((row) => (bounds.w - GAP * (row.length - 1)) / row.reduce((sum, f) => sum + f.rect.w, 0)));
    const tallest = (bounds.h - count * LABEL - GAP * (count - 1)) / rows.reduce((sum, row) => sum + Math.max(...row.map((f) => f.rect.h)), 0);
    const scale = Math.min(widest, tallest, MAX_SCALE);
    if (!best || scale > best.scale) best = { scale, rows };
  }

  const { scale, rows } = best!;
  const heights = rows.map((row) => Math.max(...row.map((f) => f.rect.h)) * scale);
  const total = heights.reduce((sum, h) => sum + h + LABEL, 0) + GAP * (rows.length - 1);
  let y = bounds.y + (bounds.h - total) / 2;
  const out: Record<string, Rect> = {};
  rows.forEach((row, r) => {
    const band = heights[r]!;
    const width = row.reduce((sum, f) => sum + f.rect.w * scale, 0) + GAP * (row.length - 1);
    let x = bounds.x + (bounds.w - width) / 2;
    for (const f of row) {
      const w = f.rect.w * scale;
      const h = f.rect.h * scale;
      out[f.id] = { x, y: y + (band - h) / 2, w, h };
      x += w + GAP;
    }
    y += band + LABEL + GAP;
  });
  return out;
}
