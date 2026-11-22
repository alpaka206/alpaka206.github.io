import { useLayoutEffect, useRef, type RefObject } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import { motionReduced } from '@/os/theme';

/**
 * FLIP: after a re-render that moved `[data-flip]` children (icons making
 * room for a dragged one), animate each from where it was to where it is.
 * Layout offsets are used, so the jiggle rotation does not skew the measure.
 * `skip` is left alone (the icon under the finger positions itself).
 */
export function useFlip(container: RefObject<HTMLElement | null>, key: unknown, skip: string | null) {
  const last = useRef(new Map<string, { x: number; y: number }>());
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const { easing, duration } = springEasing(SPRINGS.snappy);
    const next = new Map<string, { x: number; y: number }>();
    for (const element of root.querySelectorAll<HTMLElement>('[data-flip]')) {
      const id = element.dataset.flip!;
      const now = { x: element.offsetLeft, y: element.offsetTop };
      next.set(id, now);
      const before = last.current.get(id);
      if (!before || id === skip || motionReduced()) continue;
      const dx = before.x - now.x;
      const dy = before.y - now.y;
      if (dx || dy) element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration, easing });
    }
    last.current = next;
  }, [container, key, skip]);
}
