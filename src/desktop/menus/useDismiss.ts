import { useEffect, useRef, type RefObject } from 'react';

interface DismissOptions {
  /** Pointer presses on elements matching this selector do not dismiss (the button that toggles the surface). */
  ignore?: string;
  /** Close when anything scrolls or the wheel turns (context menus). */
  scroll?: boolean;
  /** Close on Escape. Off when the surface handles Escape itself (menus, Spotlight). */
  escape?: boolean;
}

/**
 * Closes a transient surface (menu, panel) the way macOS does: a press
 * anywhere outside it, the window losing focus, or Escape.
 */
export function useDismiss(
  open: boolean,
  inside: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  { ignore, scroll = false, escape = true }: DismissOptions = {},
) {
  const latest = useRef(onDismiss);
  useEffect(() => {
    latest.current = onDismiss;
  });

  useEffect(() => {
    if (!open) return;
    const dismiss = () => latest.current();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target || inside.current?.contains(target)) return;
      if (ignore && target.closest(ignore)) return;
      dismiss();
    };
    const onKey = (event: KeyboardEvent) => {
      if (escape && event.key === 'Escape') dismiss();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('blur', dismiss);
    window.addEventListener('resize', dismiss);
    if (scroll) {
      window.addEventListener('wheel', dismiss, { passive: true });
      window.addEventListener('scroll', dismiss, true);
    }
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('blur', dismiss);
      window.removeEventListener('resize', dismiss);
      window.removeEventListener('wheel', dismiss);
      window.removeEventListener('scroll', dismiss, true);
    };
  }, [open, inside, ignore, scroll, escape]);
}
