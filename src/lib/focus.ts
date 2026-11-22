import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Puts focus back on whatever had it when the overlay first rendered (the
 * button that opened it) once the overlay unmounts. Read during the first
 * render, before an autoFocus inside the overlay moves it. `when` can veto the
 * restore, e.g. when focusing the opener would pull an old window to the front.
 */
export function useRestoreFocus(when?: () => boolean) {
  const [opener] = useState(() => document.activeElement as HTMLElement | null);
  const allowed = useRef(when);
  const mounted = useRef(false);
  useLayoutEffect(() => {
    allowed.current = when;
  });
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      // Deferred so StrictMode's immediate re-mount (development only) cancels it.
      queueMicrotask(() => {
        if (!mounted.current && opener?.isConnected && (allowed.current?.() ?? true)) opener.focus({ preventScroll: true });
      });
    };
  }, [opener]);
}
