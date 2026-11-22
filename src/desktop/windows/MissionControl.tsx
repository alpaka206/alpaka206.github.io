import { useEffect, useRef, type KeyboardEvent } from 'react';
import { APPS, type AppId } from '@/os/apps';
import type { Rect } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import styles from './WindowLayer.module.css';

export interface OverviewTarget {
  id: string;
  app: AppId;
  title: string;
  rect: Rect;
  /** How far the window is scaled down, so the highlight follows its scaled corners. */
  scale: number;
}

interface MissionControlProps {
  targets: OverviewTarget[];
  onPick: (id: string) => void;
  onDismiss: () => void;
}

/**
 * The clickable layer over the spread-out windows (the windows themselves
 * glide into place on their own): each one gets a hit target, its app icon
 * and its title underneath. A click picks a window, a click on empty space or
 * Escape leaves; arrow keys and Tab move between windows, Return picks.
 */
export function MissionControl({ targets, onPick, onDismiss }: MissionControlProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    root.current?.querySelector<HTMLElement>('button')?.focus({ preventScroll: true });
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (previous?.isConnected && !document.activeElement?.closest('section')) previous.focus({ preventScroll: true });
    };
  }, [onDismiss]);

  const onKeyDown = (event: KeyboardEvent) => {
    const buttons = [...(root.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])];
    const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (step === undefined || at < 0) return;
    event.preventDefault();
    buttons[(at + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <div
      ref={root}
      className={styles.overview}
      role="dialog"
      aria-label="Mission Control"
      onPointerDown={(event) => event.target === event.currentTarget && onDismiss()}
      onKeyDown={onKeyDown}
    >
      {targets.map(({ id, app, title, rect, scale }) => (
        <button
          key={id}
          type="button"
          className={styles.target}
          style={{ translate: `${rect.x}px ${rect.y}px`, width: rect.w, height: rect.h, borderRadius: `calc(var(--mac-window-radius) * ${scale})` }}
          onClick={() => onPick(id)}
        >
          <AppIcon icon={APPS[app].icon} size={40} className={styles.targetIcon} />
          <span className={`${styles.targetTitle} truncate`}>{title}</span>
        </button>
      ))}
    </div>
  );
}
