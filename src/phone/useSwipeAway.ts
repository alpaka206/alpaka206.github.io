import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { animateSpring, project, rubberband, SPRINGS, type Spring } from '@/lib/spring';
import { useDrag } from '@/lib/useDrag';
import { motionReduced } from '@/os/theme';

interface SwipeAwayOptions {
  /** Draws the surface `y` px from where it rests. */
  place: (y: number) => void;
  /** Where it goes when dismissed, in px from rest: negative is up. */
  away: () => number;
  /** A release projected this far toward `away` dismisses; anything less springs back. */
  threshold: () => number;
  /** It has gone. */
  onAway: () => void;
}

/**
 * A surface flicked off screen along one axis (a banner up, a sheet down,
 * the Lock Screen up): it follows the finger toward `away`, rubber-bands the
 * other way, and on release springs back or leaves with the finger's speed.
 * `enter` slides it in from `away`; `dismiss` sends it there.
 */
export function useSwipeAway(options: SwipeAwayOptions) {
  const latest = useRef(options);
  useLayoutEffect(() => {
    latest.current = options;
  });
  const offset = useRef(0);
  const grabbed = useRef(0);
  const stop = useRef<() => void>(undefined);

  const move = useCallback((y: number) => {
    offset.current = y;
    latest.current.place(y);
  }, []);

  const spring = useCallback(
    (to: number, velocity: number, curve: Spring, onComplete?: () => void) => {
      stop.current?.();
      stop.current = animateSpring({ from: offset.current, to, velocity, spring: curve, onUpdate: move, onComplete });
    },
    [move],
  );

  const enter = useCallback(() => {
    if (motionReduced()) return move(0);
    move(latest.current.away());
    spring(0, 0, SPRINGS.snappy);
  }, [move, spring]);

  /** Leaves (at once under reduced motion), then runs `then`, onAway by default. */
  const dismiss = useCallback(
    (velocity = 0, then = () => latest.current.onAway()) => {
      if (!motionReduced()) return spring(latest.current.away(), velocity, SPRINGS.smooth, then);
      stop.current?.();
      then();
    },
    [spring],
  );

  const drag = useDrag(
    {
      onStart: () => {
        stop.current?.();
        grabbed.current = offset.current;
      },
      onMove: ({ dy }) => {
        const away = latest.current.away();
        const y = grabbed.current + dy;
        move(y * away >= 0 ? y : rubberband(y, Math.abs(away)));
      },
      onEnd: ({ vy }) => {
        const { away, threshold } = latest.current;
        if (project(offset.current, vy) * Math.sign(away()) > threshold()) dismiss(vy);
        else spring(0, vy, SPRINGS.snappy);
      },
    },
    { axis: 'y' },
  );

  useEffect(() => () => stop.current?.(), []);
  return { drag, enter, dismiss };
}
