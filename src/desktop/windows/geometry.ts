import type { Placement, Rect } from '@/os/windows';

/** How much of a window must stay on screen sideways, and of its title bar above the bottom. */
const KEEP_VISIBLE = 96;
const TITLE_BAR = 32;

/**
 * Where a dragged window may go: its top edge never slides under the menu
 * bar, and enough of it stays on screen to grab it again.
 */
export function clampToScreen(rect: Rect, area: Rect, screenWidth: number): Rect {
  // Whole pixels, so text inside the window stays sharp.
  return {
    ...rect,
    x: Math.round(Math.min(Math.max(rect.x, KEEP_VISIBLE - rect.w), screenWidth - KEEP_VISIBLE)),
    y: Math.round(Math.min(Math.max(rect.y, area.y), area.y + area.h - TITLE_BAR)),
  };
}

export type TileZone = Exclude<Placement, 'normal'>;

/**
 * macOS 15+ window tiling while dragging: the pointer at the top of the screen
 * fills it, at the left or right edge it takes that half.
 */
export function tileZone(pointer: { x: number; y: number }, area: Rect, screenWidth: number): TileZone | null {
  if (pointer.y <= area.y + 1) return 'zoomed';
  if (pointer.x <= 1) return 'left';
  if (pointer.x >= screenWidth - 2) return 'right';
  return null;
}

/**
 * Pulling a zoomed or tiled window away restores its own size, placed so the
 * point under the pointer stays at the same share of the title bar's width.
 */
export function restoreUnderPointer(frame: Rect, normal: Rect, pointer: { x: number; y: number }): Rect {
  const share = frame.w ? (pointer.x - frame.x) / frame.w : 0.5;
  return { x: Math.round(pointer.x - share * normal.w), y: frame.y, w: normal.w, h: normal.h };
}

export interface Edges {
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

/** Resizing from `edges` by (dx, dy), never below `min`, never above the menu bar, in whole pixels. */
export function resizeRect(start: Rect, edges: Edges, dx: number, dy: number, min: { w: number; h: number }, area: Rect): Rect {
  const moveX = Math.round(dx);
  const moveY = Math.round(dy);
  let { x, y, w, h } = start;
  if (edges.right) w = Math.max(min.w, start.w + moveX);
  if (edges.bottom) h = Math.max(min.h, start.h + moveY);
  if (edges.left) {
    w = Math.max(min.w, start.w - moveX);
    x = start.x + start.w - w;
  }
  if (edges.top) {
    const top = Math.max(area.y, start.y + moveY);
    h = Math.max(min.h, start.y + start.h - top);
    y = start.y + start.h - h;
  }
  return { x, y, w, h };
}

/** The window's own size, centred the way 윈도우 › 가운데로 places it (a third from the top). */
export const centred = (rect: Rect, area: Rect): Rect => ({
  ...rect,
  x: Math.round(area.x + (area.w - rect.w) / 2),
  y: Math.round(area.y + Math.max(0, (area.h - rect.h) / 3)),
});

export const sameRect = (a: Rect, b: Rect) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;
