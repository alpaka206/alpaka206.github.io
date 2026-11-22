import { useEffect, useState } from 'react';

/**
 * Height of the on-screen keyboard. iOS does not resize the layout viewport
 * for it, only the visual viewport, so the difference is the keyboard.
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => setInset(Math.max(0, Math.round(window.innerHeight - viewport.height - viewport.offsetTop)));
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    update();
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);
  return inset;
}

/** Calls `onEscape` while mounted; for overlays that a hardware keyboard should be able to dismiss. */
export function useEscape(onEscape: () => void) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEscape]);
}

/** iOS owns gestures that start at the very top (Notification Center) and bottom (Home) edges (ios.md §11). */
const EDGE_TOP = 44;
const EDGE_BOTTOM = 20;
export const inSystemEdge = (clientY: number) => clientY < EDGE_TOP || clientY > window.innerHeight - EDGE_BOTTOM;
