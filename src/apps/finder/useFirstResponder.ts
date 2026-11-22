import { useEffect, useEffectEvent, type RefObject } from 'react';
import { useWindowFrame } from '@/desktop/kit/window';

/**
 * Keeps the keyboard on a window's main view, as AppKit keeps a first
 * responder: the file list, the document, the photo grid. It takes focus
 * when the window becomes key with focus elsewhere, and when focus has fallen
 * back to <body> or to the window frame (the frame focuses itself as it
 * opens; a view that changes unmounts the focused element). It never takes
 * focus from a control inside the window, such as the search field.
 *
 * `scope` is the app's outermost element; `key` changes when the view does.
 */
export function useFirstResponder(view: () => HTMLElement | null | undefined, scope: RefObject<HTMLElement | null>, key: string) {
  const { active } = useWindowFrame();
  const claim = useEffectEvent(() => {
    const target = view();
    if (!target || !active) return;
    const holder = document.activeElement;
    const dropped = !holder || holder.contains(target);
    const elsewhere = !scope.current?.contains(holder);
    if (dropped || elsewhere) target.focus({ preventScroll: true });
  });
  // Child effects run before the frame's own "focus the key window" effect, so the frame sees focus inside and leaves it.
  useEffect(() => claim(), [active, key]);
}
