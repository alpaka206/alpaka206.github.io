import { useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';

interface DragState {
  dx: number;
  dy: number;
  /** Pixels per second, smoothed over the last ~80 ms. */
  vx: number;
  vy: number;
  event: PointerEvent;
}

interface DragHandlers {
  onStart?: (state: DragState) => void;
  onMove?: (state: DragState) => void;
  onEnd?: (state: DragState) => void;
  /** A press that never moved past the threshold. */
  onTap?: (event: PointerEvent) => void;
  /**
   * The browser took the pointer mid-drag (a system gesture, a scroll): put
   * things back. Without it, onEnd runs with no movement and no velocity,
   * which snaps most gestures home.
   */
  onCancel?: () => void;
}

interface Options {
  /** Movement before the gesture counts as a drag (hysteresis). */
  threshold?: number;
  /** Lock to one axis once the drag starts; null tracks both. */
  axis?: 'x' | 'y' | null;
}

/**
 * Pointer-captured drag with velocity tracking. The element keeps receiving
 * moves even when the pointer leaves it, and handlers can change between
 * renders without re-binding. A gesture still running when the component
 * unmounts is dropped without calling anything.
 */
export function useDrag(handlers: DragHandlers, { threshold = 6, axis = null }: Options = {}) {
  const latest = useRef(handlers);
  useLayoutEffect(() => {
    latest.current = handlers;
  });
  /** Removes the running gesture's window listeners. */
  const release = useRef<(() => void) | null>(null);
  useEffect(() => () => release.current?.(), []);

  return (down: ReactPointerEvent<HTMLElement>) => {
    if (down.button !== 0) return;
    release.current?.();
    const target = down.currentTarget;
    const id = down.pointerId;
    const x0 = down.clientX;
    const y0 = down.clientY;
    const samples: { t: number; x: number; y: number }[] = [{ t: down.timeStamp, x: x0, y: y0 }];
    let dragging = false;

    const state = (event: PointerEvent): DragState => {
      const now = event.timeStamp;
      while (samples.length > 2 && now - samples[0]!.t > 80) samples.shift();
      const first = samples[0]!;
      const dt = Math.max(now - first.t, 1) / 1000;
      const dx = event.clientX - x0;
      const dy = event.clientY - y0;
      return {
        dx: axis === 'y' ? 0 : dx,
        dy: axis === 'x' ? 0 : dy,
        vx: axis === 'y' ? 0 : (event.clientX - first.x) / dt,
        vy: axis === 'x' ? 0 : (event.clientY - first.y) / dt,
        event,
      };
    };

    const move = (event: PointerEvent) => {
      if (event.pointerId !== id) return;
      samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
      if (!dragging) {
        const dx = event.clientX - x0;
        const dy = event.clientY - y0;
        const distance = axis === 'x' ? Math.abs(dx) : axis === 'y' ? Math.abs(dy) : Math.hypot(dx, dy);
        if (distance < threshold) return;
        // A vertical-only gesture yields to horizontal intent (and vice versa).
        if (axis === 'y' && Math.abs(dx) > Math.abs(dy)) return finish(event, false);
        if (axis === 'x' && Math.abs(dy) > Math.abs(dx)) return finish(event, false);
        dragging = true;
        target.setPointerCapture(id);
        document.documentElement.dataset.dragging = '';
        latest.current.onStart?.(state(event));
      }
      latest.current.onMove?.(state(event));
    };

    const finish = (event: PointerEvent, completed = true) => {
      if (event.pointerId !== id) return;
      release.current?.();
      const { onEnd, onTap, onCancel } = latest.current;
      if (dragging && event.type === 'pointercancel') {
        if (onCancel) onCancel();
        else onEnd?.({ dx: 0, dy: 0, vx: 0, vy: 0, event });
      } else if (dragging) onEnd?.(state(event));
      else if (completed && event.type === 'pointerup') onTap?.(event);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    release.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      delete document.documentElement.dataset.dragging;
      release.current = null;
    };
  };
}
