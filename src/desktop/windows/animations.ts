import { springEasing, SPRINGS } from '@/lib/spring';
import { motionReduced } from '@/os/theme';
import type { Rect } from '@/os/windows';
import { genieKeyframes } from './genie';

/**
 * Window animations, all on transform, opacity and clip-path (the compositor
 * runs them). Each starts from whatever is on screen at that instant, so a
 * window can be interrupted mid-animation (closed while opening, zoomed while
 * gliding) without a jump. Reduce Motion turns them into short fades.
 * Every transform here uses a top-left origin.
 */

/** Where the element is drawn right now, given the frame its transform is relative to. */
export function drawnRect(el: HTMLElement, frame: Rect): Rect {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === 'none') return frame;
  const m = new DOMMatrixReadOnly(transform);
  return { x: frame.x + m.e, y: frame.y + m.f, w: frame.w * m.a, h: frame.h * m.d };
}

const stopAll = (el: HTMLElement) => el.getAnimations().forEach((animation) => animation.cancel());

const fade = (el: HTMLElement, from: string, to: string, duration = 150, fill: FillMode = 'none') =>
  el.animate({ opacity: [from, to] }, { duration, easing: 'ease-out', fill });

/** The transform (origin top-left) that draws `to` where `from` is. */
export const toTransform = (from: Rect, to: Rect) =>
  `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.w / to.w}, ${from.h / to.h})`;

/** Opens out of `origin` (a Dock or desktop icon), or out of the window's own centre at 94 %. */
export function animateOpen(el: HTMLElement, frame: Rect, origin?: Rect): Animation {
  stopAll(el);
  if (motionReduced()) return fade(el, '0', '1');
  const scale = origin ? Math.min(Math.max(origin.w / frame.w, origin.h / frame.h, 0.05), 1) : 0.94;
  const centre = origin ? { x: origin.x + origin.w / 2, y: origin.y + origin.h / 2 } : { x: frame.x + frame.w / 2, y: frame.y + frame.h / 2 };
  const start = { x: centre.x - (frame.w * scale) / 2, y: centre.y - (frame.h * scale) / 2, w: frame.w * scale, h: frame.h * scale };
  const { easing, duration } = springEasing(SPRINGS.snappy);
  fade(el, '0', '1', origin ? 200 : 140);
  return el.animate({ transform: [toTransform(start, frame), 'none'], transformOrigin: ['0 0', '0 0'] }, { duration, easing });
}

/** Close: a quick shrink toward the window's centre while it fades. */
export function animateClose(el: HTMLElement, frame: Rect): Animation {
  const drawn = drawnRect(el, frame);
  const opacity = getComputedStyle(el).opacity;
  stopAll(el);
  if (motionReduced()) return fade(el, opacity, '0', 120, 'forwards');
  const end = { x: drawn.x + drawn.w * 0.03, y: drawn.y + drawn.h * 0.03, w: drawn.w * 0.94, h: drawn.h * 0.94 };
  return el.animate(
    { transform: [toTransform(drawn, frame), toTransform(end, frame)], transformOrigin: ['0 0', '0 0'], opacity: [opacity, '0'] },
    { duration: 180, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
  );
}

/**
 * Genie into the Dock icon at `icon`; `restore` plays it backwards, out of the
 * icon (≈ 0.5 s, as on macOS). Both fill, so reversing one mid-way and letting
 * it finish never flashes the other end; the caller cancels a finished restore.
 */
export function animateGenie(el: HTMLElement, frame: Rect, icon: Rect, restore: boolean): Animation {
  stopAll(el);
  if (motionReduced()) return fade(el, restore ? '0' : '1', restore ? '1' : '0', 150, 'both');
  return el.animate(genieKeyframes(frame, icon), { duration: 520, easing: 'linear', direction: restore ? 'reverse' : 'normal', fill: 'both' });
}

/** A new frame (zoom, tiling, 가운데로): glide there from where the window is drawn, `drawn`. */
export function animateFrame(el: HTMLElement, drawn: Rect, next: Rect): Animation | undefined {
  stopAll(el);
  if (motionReduced() || !next.w || !next.h) return;
  const { easing, duration } = springEasing(SPRINGS.smooth);
  return el.animate({ transform: [toTransform(drawn, next), 'none'], transformOrigin: ['0 0', '0 0'] }, { duration, easing });
}

/** Mission Control: glide to `target` and stay there; `null` glides back to the window's frame. */
export function animateOverview(el: HTMLElement, frame: Rect, target: Rect | null): Animation | undefined {
  const drawn = drawnRect(el, frame);
  stopAll(el);
  const end = target ? toTransform(target, frame) : 'none';
  el.style.transformOrigin = '0 0';
  el.style.transform = target ? end : '';
  if (motionReduced()) return;
  const { easing, duration } = springEasing(SPRINGS.snappy);
  return el.animate({ transform: [toTransform(drawn, frame), end] }, { duration, easing });
}

/** ⌘H and back: macOS simply drops the windows; a short fade keeps it from flashing. */
export function animateHide(el: HTMLElement, hide: boolean): Animation {
  const opacity = getComputedStyle(el).opacity;
  stopAll(el);
  return fade(el, opacity, hide ? '0' : '1', motionReduced() ? 1 : 140, 'forwards');
}
