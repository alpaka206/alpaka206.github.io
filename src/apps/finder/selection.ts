import type { Rect } from '@/os/windows';

/**
 * Finder selection, independent of how items are drawn. `order` is the visual
 * order of item ids in the current view; `anchor` is where a shift range
 * starts and `focus` is the item the keyboard moves from.
 */
export interface Selection {
  ids: readonly string[];
  anchor: string | null;
  focus: string | null;
}

export const NONE: Selection = { ids: [], anchor: null, focus: null };

export const only = (id: string): Selection => ({ ids: [id], anchor: id, focus: id });

function range(order: readonly string[], from: string | null, to: string): string[] {
  const a = from ? order.indexOf(from) : -1;
  const b = order.indexOf(to);
  if (a < 0 || b < 0) return [to];
  return order.slice(Math.min(a, b), Math.max(a, b) + 1);
}

/** A click: plain selects one, ⌘ toggles, ⇧ extends from the anchor. */
export function click(selection: Selection, order: readonly string[], id: string, mods: { meta?: boolean; shift?: boolean }): Selection {
  if (mods.shift && selection.anchor) {
    return { ids: range(order, selection.anchor, id), anchor: selection.anchor, focus: id };
  }
  if (mods.meta) {
    const has = selection.ids.includes(id);
    const ids = has ? selection.ids.filter((x) => x !== id) : [...selection.ids, id];
    return { ids, anchor: id, focus: has ? (ids.at(-1) ?? null) : id };
  }
  return only(id);
}

/** Arrow keys: move to `target`, or extend the range to it with ⇧. */
export function moveTo(selection: Selection, order: readonly string[], target: string, extend: boolean): Selection {
  if (extend && selection.anchor) return { ids: range(order, selection.anchor, target), anchor: selection.anchor, focus: target };
  return only(target);
}

export function selectAll(order: readonly string[]): Selection {
  return { ids: [...order], anchor: order[0] ?? null, focus: order.at(-1) ?? null };
}

type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * The next item in `direction` from `index` among laid-out boxes (in visual
 * order). Left and right step through the order, wrapping rows as Finder's
 * icon view does; up and down pick the nearest item in the adjacent row by
 * horizontal centre, which also crosses group headers.
 */
export function neighbor(boxes: readonly Rect[], index: number, direction: Direction): number | null {
  const from = boxes[index];
  if (!from) return boxes.length ? 0 : null;
  if (direction === 'left') return index > 0 ? index - 1 : null;
  if (direction === 'right') return index < boxes.length - 1 ? index + 1 : null;
  const centre = (b: Rect) => b.x + b.w / 2;
  const sameRow = (b: Rect) => Math.abs(b.y - from.y) < from.h / 2;
  const candidates = boxes
    .map((box, i) => ({ box, i }))
    .filter(({ box }) => !sameRow(box) && (direction === 'down' ? box.y > from.y : box.y < from.y));
  if (!candidates.length) return null;
  const rowY = direction === 'down' ? Math.min(...candidates.map((c) => c.box.y)) : Math.max(...candidates.map((c) => c.box.y));
  const row = candidates.filter(({ box }) => Math.abs(box.y - rowY) < from.h / 2);
  row.sort((a, b) => Math.abs(centre(a.box) - centre(from)) - Math.abs(centre(b.box) - centre(from)));
  return row[0]?.i ?? null;
}
