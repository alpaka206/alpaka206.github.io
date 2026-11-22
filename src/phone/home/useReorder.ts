import { useCallback, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import { motionReduced } from '@/os/theme';
import { moveTo } from './items';

/** The finger must be over this much of a neighbour's 64 pt icon before they trade places. */
const HIT_INSET = 8;

const slotOf = (id: string) => document.querySelector<HTMLElement>(`[data-flip="${CSS.escape(id)}"]`);

/** A slot's untransformed box on screen (its page is never transformed). */
function layoutBox(slot: HTMLElement) {
  const page = (slot.offsetParent as HTMLElement | null)?.getBoundingClientRect() ?? { left: 0, top: 0 };
  return { left: page.left + slot.offsetLeft, top: page.top + slot.offsetTop, width: slot.offsetWidth };
}

/**
 * Jiggle-mode dragging: the icon follows the finger (scaled up a little),
 * neighbours make room as it passes over them, and on release it springs
 * into its new slot. Reordering stays within one Home Screen page.
 */
export function useReorder(order: readonly string[], onChange: (order: string[]) => void) {
  const [dragging, setDragging] = useState<string | null>(null);
  const live = useRef({ order, id: '', x: 0, y: 0, grabX: 0, grabY: 0 });
  useLayoutEffect(() => {
    live.current.order = order;
  });

  const place = useCallback(() => {
    const { id, x, y, grabX, grabY } = live.current;
    if (!id) return;
    const slot = slotOf(id);
    if (!slot) return;
    const box = layoutBox(slot);
    slot.style.transform = `translate3d(${x - grabX - box.left}px, ${y - grabY - box.top}px, 0) scale(1.12)`;
  }, []);

  // A reorder moves the dragged slot in the grid: put it back under the finger before paint.
  useLayoutEffect(() => {
    if (dragging) place();
  }, [order, dragging, place]);

  const start = (id: string, peers: readonly string[], down: PointerEvent<HTMLElement>) => {
    const slot = slotOf(id);
    if (!slot || down.button !== 0) return;
    down.preventDefault();
    const box = layoutBox(slot);
    Object.assign(live.current, { id, x: down.clientX, y: down.clientY, grabX: down.clientX - box.left, grabY: down.clientY - box.top });
    const pointer = down.pointerId;
    setDragging(id);

    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== pointer) return;
      live.current.x = event.clientX;
      live.current.y = event.clientY;
      place();
      const over = peers.find((peer) => {
        const other = peer !== id && slotOf(peer);
        if (!other) return false;
        const b = layoutBox(other);
        return event.clientX > b.left + HIT_INSET && event.clientX < b.left + b.width - HIT_INSET && event.clientY > b.top + HIT_INSET && event.clientY < b.top + b.width - HIT_INSET;
      });
      if (over) onChange(moveTo(live.current.order, id, over));
    };
    const end = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== pointer) return;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      const from = slot.style.transform;
      slot.style.transform = '';
      live.current.id = '';
      setDragging(null);
      if (from && !motionReduced()) slot.animate([{ transform: from }, { transform: 'none' }], springEasing(SPRINGS.snappy));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  return { dragging, start };
}
