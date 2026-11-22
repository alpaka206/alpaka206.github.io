import type { Rect } from '@/os/windows';

/**
 * Keyframes for macOS's genie minimise, approximated with what the compositor
 * can animate: a transform (translate + scale, origin top-left) squeezes the
 * window's content, and a clip-path polygon cuts it to a funnel that narrows
 * toward the Dock icon. First the window's bottom stretches down to the icon
 * while the funnel forms; then the top slides down through the funnel into
 * the icon. Played backwards it is the restore.
 */
const ROWS = 12;
const STEPS = 18;
/** Share of the animation spent forming the funnel before the window slides in. */
const STRETCH = 0.4;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const round = (n: number) => Math.round(n * 10) / 10;

export function genieKeyframes(win: Rect, icon: Rect): Keyframe[] {
  const frames: Keyframe[] = [];
  const iconBottom = icon.y + icon.h;
  const funnelSpan = Math.max(icon.y - win.y, 1);

  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const stretch = easeInOut(clamp01(t / STRETCH));
    const slide = easeInOut(clamp01((t - STRETCH) / (1 - STRETCH)));

    // Vertical: the bottom reaches the icon, then the top follows it in.
    const top = lerp(win.y, icon.y, slide);
    const bottom = lerp(win.y + win.h, iconBottom, stretch);
    const sy = Math.max(bottom - top, 0.01) / win.h;
    const ty = top - win.y;
    // Horizontal: the content narrows to the icon only while it slides in.
    const squeeze = slide * slide;
    const sx = lerp(1, icon.w / win.w, squeeze);
    const centre = lerp(win.x + win.w / 2, icon.x + icon.w / 2, squeeze);
    const tx = centre - (win.w * sx) / 2 - win.x;

    // The funnel in screen space, mapped back into the element's own coordinates.
    const left: string[] = [];
    const right: string[] = [];
    for (let r = 0; r <= ROWS; r++) {
      const ly = (win.h * r) / ROWS;
      const screenY = win.y + ty + ly * sy;
      const pinch = smooth(clamp01((screenY - win.y) / funnelSpan)) * stretch;
      const l = (lerp(win.x, icon.x, pinch) - win.x - tx) / sx;
      const rr = (lerp(win.x + win.w, icon.x + icon.w, pinch) - win.x - tx) / sx;
      left.push(`${round(l)}px ${round(ly)}px`);
      right.unshift(`${round(rr)}px ${round(ly)}px`);
    }

    frames.push({
      offset: t,
      transformOrigin: '0 0',
      transform: `translate(${round(tx)}px, ${round(ty)}px) scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`,
      clipPath: `polygon(${[...left, ...right].join(', ')})`,
      // The last stretch fades, so nothing sits on top of the icon when it lands.
      opacity: t < 0.82 ? 1 : Math.max(0, +(1 - (t - 0.82) / 0.18).toFixed(3)),
    });
  }
  return frames;
}
