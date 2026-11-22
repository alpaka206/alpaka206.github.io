import { toRect, type Rect as Box } from '@/os/windows';

/**
 * Rectangles for the zoom transitions (app launch, folders). A full-screen
 * layer is made to look like any smaller rounded rect with one uniform scale
 * plus a clip, so the app's content is never squashed: it is scaled to the
 * rect's width and cropped top and bottom to its height, the way iOS shows an
 * app's launch screen inside its icon.
 */
export type Rect = Box & {
  /** Corner radius in screen pixels. */
  r: number;
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const lerpRect = (a: Rect, b: Rect, t: number): Rect => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
  r: lerp(a.r, b.r, t),
});

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** An icon's squircle corner as a circular radius: 26% of its edge (ios.md §3, 16.7 pt at 64 pt). */
export const iconRadius = (icon: Element) => icon.getBoundingClientRect().width * 0.26;

export const rectOf = (element: Element, r: number): Rect => ({ ...toRect(element.getBoundingClientRect()), r });

/** True when at least part of the rect is on screen (an icon on another home page is not). */
export const isOnScreen = (rect: Rect, width: number, height: number) =>
  rect.w > 0 && rect.x + rect.w > 0 && rect.x < width && rect.y + rect.h > 0 && rect.y < height;

export interface Frame {
  transform: string;
  clipPath: string;
  /** Top of the visible band in the layer's own (unscaled) pixels. */
  top: number;
  /** Height of the visible band in the layer's own pixels. */
  height: number;
  scale: number;
}

/** Transform and clip that make a `width`×`height` layer (origin top left) appear as `rect`. */
export function frameFor(rect: Rect, width: number, height: number): Frame {
  const scale = Math.max(rect.w / width, 1e-3);
  const visible = Math.min(rect.h / scale, height);
  const top = (height - visible) / 2;
  return {
    transform: `translate3d(${rect.x}px, ${rect.y - top * scale}px, 0) scale(${scale})`,
    clipPath: `inset(${top}px 0px round ${Math.max(rect.r, 0) / scale}px)`,
    top,
    height: visible,
    scale,
  };
}
