/**
 * Springs, parameterised the way SwiftUI does it: `duration` is the perceived
 * response time in seconds and `bounce` is 0 for no overshoot, up to ~0.4 for a
 * playful bounce. Two consumers:
 *  - springEasing(): a CSS `linear()` easing for Web Animations / transitions;
 *  - animateSpring(): a rAF loop that starts from a live value and velocity,
 *    so a gesture can hand off to the animation without a visible stop.
 */
export interface Spring {
  duration: number;
  bounce: number;
}

export const SPRINGS = {
  /** Default for UI state changes: critically damped. */
  smooth: { duration: 0.35, bounce: 0 },
  /** Windows, sheets, panels: a hint of life. */
  snappy: { duration: 0.32, bounce: 0.12 },
  /** App launch from an icon, Dock bounce. */
} as const satisfies Record<string, Spring>;

interface Physics {
  omega: number; // undamped angular frequency
  zeta: number; // damping ratio
}

function physics({ duration, bounce }: Spring): Physics {
  const stiffness = ((2 * Math.PI) / duration) ** 2;
  const damping = bounce >= 0 ? ((1 - bounce) * 4 * Math.PI) / duration : (4 * Math.PI) / (duration * (1 + bounce));
  const omega = Math.sqrt(stiffness);
  return { omega, zeta: damping / (2 * omega) };
}

/** Displacement from the target after `t` seconds, starting at x0 with velocity v0 (mass 1). */
export function displacement({ omega, zeta }: Physics, x0: number, v0: number, t: number): number {
  if (zeta < 1) {
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return Math.exp(-zeta * omega * t) * (x0 * Math.cos(wd * t) + ((v0 + zeta * omega * x0) / wd) * Math.sin(wd * t));
  }
  if (zeta === 1) return Math.exp(-omega * t) * (x0 + (v0 + omega * x0) * t);
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -omega * (zeta - s);
  const r2 = -omega * (zeta + s);
  const c2 = (v0 - r1 * x0) / (r2 - r1);
  return (x0 - c2) * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
}

const REST = 0.0005;
const STEP = 1 / 120;

/** Samples of progress (0 → 1) at 120 Hz until the spring rests. */
export function sampleSpring(spring: Spring, initialVelocity = 0): number[] {
  const p = physics(spring);
  const samples = [0];
  // Normalised: start one unit away from the target, velocity in units per second.
  for (let t = STEP; t < 10; t += STEP) {
    const x = displacement(p, -1, initialVelocity, t);
    const v = (displacement(p, -1, initialVelocity, t + 1e-4) - x) / 1e-4;
    samples.push(1 + x);
    if (Math.abs(x) < REST && Math.abs(v) < REST * 20) break;
  }
  samples[samples.length - 1] = 1;
  return samples;
}

const cache = new Map<string, { easing: string; duration: number }>();

/** CSS easing that traces the spring, plus the time (ms) it takes to settle. */
export function springEasing(spring: Spring): { easing: string; duration: number } {
  const id = `${spring.duration}:${spring.bounce}`;
  const hit = cache.get(id);
  if (hit) return hit;
  const samples = sampleSpring(spring);
  // Every other sample is plenty for linear() and keeps the string short.
  const points = samples.filter((_, i) => i % 2 === 0 || i === samples.length - 1);
  const result = {
    easing: `linear(${points.map((v) => +v.toFixed(4)).join(', ')})`,
    duration: Math.round((samples.length - 1) * STEP * 1000),
  };
  cache.set(id, result);
  return result;
}

export interface SpringAnimation {
  from: number;
  to: number;
  /** Units per second, e.g. the finger's velocity when it lifted. */
  velocity?: number;
  spring?: Spring;
  onUpdate: (value: number, velocity: number) => void;
  onComplete?: () => void;
}

/** Runs a spring on requestAnimationFrame. Returns a function that stops it where it is. */
export function animateSpring({ from, to, velocity = 0, spring = SPRINGS.smooth, onUpdate, onComplete }: SpringAnimation) {
  const p = physics(spring);
  const x0 = from - to;
  let frame = 0;
  let start: number | undefined;

  const tick = (now: number) => {
    start ??= now;
    const t = (now - start) / 1000;
    const x = displacement(p, x0, velocity, t);
    const v = (displacement(p, x0, velocity, t + 1e-3) - x) / 1e-3;
    const range = Math.max(Math.abs(x0), 1);
    if (Math.abs(x) < range * REST && Math.abs(v) < range * REST * 20) {
      onUpdate(to, 0);
      onComplete?.();
      return;
    }
    onUpdate(to + x, v);
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

/**
 * Where a flick would come to rest (Apple's "projection"): current position plus
 * velocity times the deceleration integral. d = 0.998 is UIScrollView's normal rate.
 */
export const project = (position: number, velocity: number, decelerationRate = 0.998) =>
  position + ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);

/** Rubber-band resistance past a limit, like scroll views at their edges. */
export const rubberband = (overshoot: number, dimension: number, constant = 0.55) =>
  (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
