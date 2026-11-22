import { useCallback, useEffect, useRef } from 'react';
import styles from './BlackScreen.module.css';

interface BlackScreenProps {
  /** Accessible name of what pressing does ("전원 켜기", "깨우기"). */
  label: string;
  onWake: () => void;
  /** Sleep: the display dims out, and moving the mouse wakes it after a moment. */
  sleep?: boolean;
}

/** Input arriving this soon after going to sleep is the click that chose 잠자기, not a wake-up. */
const GRACE_MS = 1000;

/** A switched-off or sleeping display: black, and any key or click brings it back. */
export function BlackScreen({ label, onWake, sleep = false }: BlackScreenProps) {
  const button = useRef<HTMLButtonElement>(null);
  const since = useRef(0);

  const wake = useCallback(
    (event: Event) => {
      if (event instanceof KeyboardEvent && event.repeat) return;
      if (performance.now() - since.current < GRACE_MS) return;
      onWake();
    },
    [onWake],
  );

  useEffect(() => {
    button.current?.focus({ preventScroll: true });
    since.current = performance.now();
    const events = sleep ? ['keydown', 'pointerdown', 'pointermove', 'wheel'] : ['keydown', 'pointerdown'];
    for (const type of events) window.addEventListener(type, wake);
    return () => {
      for (const type of events) window.removeEventListener(type, wake);
    };
  }, [wake, sleep]);

  return (
    <button
      ref={button}
      type="button"
      aria-label={label}
      className={styles.screen}
      data-sleep={sleep || undefined}
      // Assistive technology presses it with a click alone, no key or pointer event.
      onClick={(event) => wake(event.nativeEvent)}
    />
  );
}
