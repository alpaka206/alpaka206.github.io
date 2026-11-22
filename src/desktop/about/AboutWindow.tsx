import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useRestoreFocus } from '@/lib/focus';
import { useDrag } from '@/lib/useDrag';
import { focusedWindowId, useWindows } from '@/os/windows';
import { Symbol } from '@/ui/Symbol';
import styles from './About.module.css';

interface AboutWindowProps {
  label: string;
  width: number;
  onClose: () => void;
  /** Opens a little lower than a window already on screen, as macOS staggers new windows. */
  stagger?: number;
  children: ReactNode;
}

/**
 * A title-bar-only macOS 27 window (macos.md §2, §4): radius 16, close button
 * live and the other two greyed, 14 pt lights at x 9, y 9, 23 pt apart.
 * Movable by its background, like About This Mac; grey when another window
 * takes the click. Esc or ⌘W closes it, and focus goes back to its opener.
 */
export function AboutWindow({ label, width, onClose, stagger = 0, children }: AboutWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(true);
  const origin = useRef({ x: 0, y: 0, minY: 0 });
  // Focus goes back to the opener, but not once another window has become key (자세한 정보… opened one,
  // or one was clicked): focusing into a window makes it key, and would pull the old one back in front.
  const [keyWindow] = useState(focusedWindowId);
  useRestoreFocus(() => focusedWindowId() === keyWindow);

  useEffect(() => ref.current?.focus({ preventScroll: true }), []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => setActive(ref.current?.contains(event.target as Node) ?? false);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  const drag = useDrag({
    onStart: () => {
      const top = (ref.current?.getBoundingClientRect().top ?? 0) - offset.y;
      // The title bar never goes under the menu bar, where the desktop area starts.
      origin.current = { ...offset, minY: useWindows.getState().area.y - top };
    },
    onMove: ({ dx, dy }) => setOffset({ x: origin.current.x + dx, y: Math.max(origin.current.minY, origin.current.y + dy) }),
  });

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      // Its ⌘W closes this panel, never the window behind it (os/keyboard.ts skips menu shortcuts in here).
      data-owns-keys
      className={styles.window}
      data-active={active || undefined}
      style={{ '--width': `${width}px`, '--stagger': `${stagger}px`, transform: `translate(${offset.x}px, ${offset.y}px)` } as CSSProperties}
      onPointerDown={(event) => {
        if (!(event.target as Element).closest('button, a')) drag(event);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' && !(event.metaKey && event.code === 'KeyW')) return;
        event.preventDefault();
        onClose();
      }}
    >
      <div className={styles.lights}>
        <button type="button" className={styles.close} aria-label="닫기" onClick={onClose}>
          <Symbol name="xmark" size={10} weight="semibold" />
        </button>
        <span className={styles.light} aria-hidden="true" />
        <span className={styles.light} aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}
