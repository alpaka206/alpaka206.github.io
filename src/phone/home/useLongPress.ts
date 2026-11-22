import { useLayoutEffect, useRef, type PointerEvent } from 'react';

/** iOS's touch-and-hold is about half a second; moving the finger first cancels it. */
const HOLD_MS = 500;
const SLOP = 10;

/**
 * Press and hold. Returns the pointerdown handler and `consume()`, which
 * reports (once) whether the press became a long press, so the click that
 * follows can be ignored.
 */
export function useLongPress(onLongPress: () => void) {
  const latest = useRef(onLongPress);
  const fired = useRef(false);
  useLayoutEffect(() => {
    latest.current = onLongPress;
  });

  const onPointerDown = (down: PointerEvent<HTMLElement>) => {
    fired.current = false;
    if (down.button !== 0) return;
    const { pointerId, clientX: x0, clientY: y0 } = down;
    const timer = window.setTimeout(() => {
      fired.current = true;
      cleanup();
      latest.current();
    }, HOLD_MS);
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerId === pointerId && Math.hypot(event.clientX - x0, event.clientY - y0) > SLOP) cleanup();
    };
    const end = (event: globalThis.PointerEvent) => {
      if (event.pointerId === pointerId) cleanup();
    };
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const consume = () => {
    const was = fired.current;
    fired.current = false;
    return was;
  };

  return { onPointerDown, consume };
}
