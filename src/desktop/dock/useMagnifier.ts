import { useCallback, useEffect, useLayoutEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { animateSpring, type Spring } from '@/lib/spring';
import { motionReduced } from '@/os/theme';
import { magnify, SQUIRCLE, type DockMetrics, type Slot } from './geometry';

/** Icons swell quickly under an arriving pointer and settle with a little give when it leaves. */
const GROW: Spring = { duration: 0.22, bounce: 0 };
const SETTLE: Spring = { duration: 0.42, bounce: 0.18 };

/**
 * Dock magnification, written straight to the DOM once per frame: each item
 * gets a translateX and its icon a scale, the shelf a new width. Nothing here
 * re-renders React. `amount` springs between 0 and 1 so the icons grow when
 * the pointer arrives and settle with a little give when it leaves. The Dock
 * fills the returned refs: `itemRefs` and `artRefs` by item index.
 */
export function useMagnifier(slots: readonly Slot[], m: DockMetrics, enabled: boolean) {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const artRefs = useRef<(HTMLElement | null)[]>([]);
  const shelfRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const live = useRef({ pointer: 0, amount: 0, target: 0, labelIndex: -1, frame: 0, origin: 0 });
  const stopSpring = useRef<(() => void) | undefined>(undefined);
  const latest = useRef({ slots, m });

  const apply = useCallback(() => {
    const s = live.current;
    s.frame = 0;
    const { slots, m } = latest.current;
    const resting = s.amount === 0 && s.target === 0;
    const out = magnify(slots, s.pointer, s.amount, m);
    slots.forEach((_, i) => {
      const item = itemRefs.current[i];
      const art = artRefs.current[i];
      if (item) item.style.transform = resting ? '' : `translate3d(${out.offsets[i]}px, 0, 0)`;
      if (art) art.style.transform = resting ? '' : `scale(${out.sizes[i]! / m.magnified})`;
    });
    // The shelf's width is the one per-frame layout change: the glass (and its
    // refraction map) must hug the magnified icons. The shelf is absolutely
    // positioned and contained, so the relayout stays inside it.
    for (const el of [shelfRef.current, zoneRef.current]) {
      if (!el) continue;
      el.style.transform = resting ? '' : `translate3d(${out.left}px, 0, 0)`;
      el.style.width = resting ? '' : `${out.right - out.left}px`;
    }
    // The band above the shelf that the tallest icon reaches into.
    if (zoneRef.current) zoneRef.current.style.height = resting ? '' : `${Math.max(0, m.magnified - m.tile - m.padTop)}px`;
    const label = labelRef.current;
    const target = s.labelIndex;
    if (label && target >= 0 && slots[target]) {
      const slot = slots[target];
      const x = slot.start + slot.size / 2 + (out.offsets[target] ?? 0);
      // Icons grow from their bottom edge, so the squircle's top rises by this share of the growth.
      const lift = ((out.sizes[target] ?? slot.size) - slot.size) * ((1 + SQUIRCLE) / 2);
      label.style.transform = `translate3d(${x}px, ${-lift}px, 0) translateX(-50%)`;
    }
  }, []);

  const schedule = useCallback(() => {
    if (!live.current.frame) live.current.frame = requestAnimationFrame(apply);
  }, [apply]);

  const springTo = useCallback(
    (target: number, spring: Spring) => {
      const s = live.current;
      if (s.target === target && stopSpring.current) return;
      s.target = target;
      stopSpring.current?.();
      if (motionReduced()) {
        s.amount = target;
        stopSpring.current = undefined;
        schedule();
        return;
      }
      stopSpring.current = animateSpring({
        from: s.amount,
        to: target,
        spring,
        onUpdate: (value) => {
          s.amount = value;
          apply();
        },
        onComplete: () => {
          stopSpring.current = undefined;
        },
      });
    },
    [apply, schedule],
  );

  // Re-lay out before paint when items come and go (an app launches) or the size changes.
  useLayoutEffect(() => {
    latest.current = { slots, m };
    apply();
  }, [slots, m, apply]);

  useEffect(
    () => () => {
      stopSpring.current?.();
      cancelAnimationFrame(live.current.frame);
    },
    [],
  );

  /** The item the name label points at (hover or keyboard focus); -1 hides it. */
  const setLabelTarget = (index: number) => {
    live.current.labelIndex = index;
    schedule();
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType === 'touch') return;
    const s = live.current;
    // The Dock's own box never moves sideways, so its left edge is a stable origin.
    if (s.target === 0) s.origin = event.currentTarget.getBoundingClientRect().left;
    s.pointer = event.clientX - s.origin;
    if (s.target !== 1) springTo(1, GROW);
    else schedule();
  };
  const onPointerLeave = () => {
    if (enabled) springTo(0, SETTLE);
  };

  return { itemRefs, artRefs, shelfRef, zoneRef, labelRef, setLabelTarget, onPointerMove, onPointerLeave };
}
