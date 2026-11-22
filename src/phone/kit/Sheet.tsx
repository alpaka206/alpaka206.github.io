import { createContext, useCallback, useContext, useLayoutEffect, useRef, type ReactNode } from 'react';
import { useRestoreFocus } from '@/lib/focus';
import { useEscape } from '../hooks';
import { useSwipeAway } from '../useSwipeAway';
import { GlassButton } from './GlassButton';
import styles from './Sheet.module.css';

const DismissContext = createContext<() => void>(() => undefined);

/** Lets sheet content close its sheet (e.g. after sending), with the same animation as a swipe. */
export const useDismissSheet = () => useContext(DismissContext);

interface SheetProps {
  title: string;
  /** Called once the sheet has animated away. */
  onClose: () => void;
  trailing?: ReactNode;
  children: ReactNode;
}

/**
 * A modal sheet (large detent, ios.md §7) that slides up over a 20% dimming
 * layer. Drag the header down to dismiss: a flick projects past half the
 * sheet's height, or the sheet springs back. The close button and Escape do
 * the same. While it is up, the rest of the app is inert.
 */
export function Sheet({ title, onClose, trailing, children }: SheetProps) {
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const height = () => panel.current?.offsetHeight ?? 0;
  const { drag, enter, dismiss } = useSwipeAway({
    place: (y) => {
      if (panel.current) panel.current.style.transform = `translate3d(0, ${y}px, 0)`;
      if (scrim.current) scrim.current.style.opacity = String(Math.max(0, 1 - y / Math.max(height(), 1)));
    },
    away: height,
    threshold: () => height() / 2,
    onAway: onClose,
  });
  const close = useCallback(() => dismiss(), [dismiss]);
  useEscape(close);
  useRestoreFocus();

  useLayoutEffect(() => {
    const self = layer.current;
    const behind = [...(self?.parentElement?.children ?? [])].filter(
      (element): element is HTMLElement => element !== self && element instanceof HTMLElement && !element.inert,
    );
    for (const element of behind) element.inert = true;
    heading.current?.focus({ preventScroll: true });
    enter();
    return () => {
      for (const element of behind) element.inert = false;
    };
  }, [enter]);

  return (
    <div ref={layer} className={styles.layer} role="dialog" aria-modal="true" aria-label={title}>
      <div ref={scrim} className={styles.scrim} onClick={close} aria-hidden="true" />
      <div ref={panel} className={styles.sheet}>
        <DismissContext.Provider value={close}>
          <header className={styles.header} onPointerDown={drag}>
            <span className={styles.grabber} aria-hidden="true" />
            <div className={styles.leading}>
              <GlassButton icon="xmark" label="닫기" onClick={close} />
            </div>
            <h2 ref={heading} className={styles.title} tabIndex={-1}>
              {title}
            </h2>
            <div className={styles.trailing}>{trailing}</div>
          </header>
          <div className={styles.body}>{children}</div>
        </DismissContext.Provider>
      </div>
    </div>
  );
}
