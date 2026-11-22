import { useCallback, useEffect, useMemo, useRef } from 'react';
import { animateSpring, SPRINGS, type Spring } from '@/lib/spring';
import { lerpRect, type Rect } from './geometry';

interface MorphOptions {
  /** Progress units per second (1 = the whole way), e.g. a finger's speed over the path length. */
  velocity?: number;
  spring?: Spring;
  onComplete?: () => void;
}

/**
 * Drives an element between rectangles. `set` jumps (a finger dragging),
 * `animate` springs from wherever the element is now, so a new animation or
 * a gesture can interrupt the running one without a jump.
 */
export function useRectMorph(apply: (rect: Rect) => void) {
  const current = useRef<Rect | null>(null);
  const running = useRef<() => void>(undefined);

  const stop = useCallback(() => {
    running.current?.();
    running.current = undefined;
  }, []);

  const set = useCallback(
    (rect: Rect) => {
      current.current = rect;
      apply(rect);
    },
    [apply],
  );

  const animate = useCallback(
    (to: Rect, { velocity = 0, spring = SPRINGS.smooth, onComplete }: MorphOptions = {}) => {
      stop();
      const from = current.current ?? to;
      running.current = animateSpring({
        from: 0,
        to: 1,
        velocity,
        spring,
        onUpdate: (t) => set(lerpRect(from, to, t)),
        onComplete: () => {
          running.current = undefined;
          onComplete?.();
        },
      });
    },
    [set, stop],
  );

  useEffect(() => stop, [stop]);
  return useMemo(() => ({ set, animate, stop }), [set, animate, stop]);
}

/** Speed along a path in progress units: a finger moving `speed` px/s over a path `distance` px long. */
export const progressVelocity = (speed: number, distance: number) => speed / Math.max(distance, 1);
