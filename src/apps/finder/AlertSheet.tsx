import { useEffect, useId, useRef, type KeyboardEvent } from 'react';
import type { MediaKey } from '@/content/types';
import { Button } from '@/desktop/kit/controls';
import { useDismiss } from '@/desktop/menus/useDismiss';
import { useRestoreFocus } from '@/lib/focus';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import styles from './AlertSheet.module.css';

interface AlertAction {
  label: string;
  onPress: () => void;
  /** A page to open in a new tab: the button is then a real link, so ⌘-click and the browser's link menu work. */
  href?: string;
}

interface AlertSheetProps {
  icon: MediaKey;
  title: string;
  message: string;
  /** Right, blue button; it has focus, so Return presses it. */
  primary: AlertAction;
  /** Left button (취소, or a second choice). */
  secondary: AlertAction;
  /** Escape or a press outside the window: close without doing anything. */
  onDismiss: () => void;
}

/**
 * An NSAlert shown as a sheet of the window (macos.md §10, run-time values):
 * 260 pt wide, radius 26, a 64 pt app icon, Bold 13 title over Regular 13
 * text, and two 110 × 28 pill buttons 8 pt apart, the default on the right.
 * The window behind is dimmed by the kit's window-modal overlay.
 */
export function AlertSheet({ icon, title, message, primary, secondary, onDismiss }: AlertSheetProps) {
  const titleId = useId();
  const messageId = useId();
  const sheet = useRef<HTMLDivElement>(null);
  useRestoreFocus();
  useDismiss(true, sheet, onDismiss);
  // An effect rather than autoFocus: it runs after useRestoreFocus's, so StrictMode's remount cannot undo it.
  useEffect(() => sheet.current?.querySelector<HTMLElement>('[data-default]')?.focus({ preventScroll: true }), []);

  // Window-modal: Tab stays inside the sheet.
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const controls = [...(sheet.current?.querySelectorAll<HTMLElement>('button, a') ?? [])];
    const index = controls.indexOf(document.activeElement as HTMLElement);
    const next = controls[(index + (event.shiftKey ? controls.length - 1 : 1)) % controls.length];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  };

  return (
    <div ref={sheet} className={styles.overlay} onKeyDown={onKeyDown}>
      <Glass
        variant="panel"
        radius={26}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className={styles.sheet}
      >
        <AppIcon icon={icon} size={64} className={styles.icon} />
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <p id={messageId} className={styles.message}>
          {message}
        </p>
        <div className={styles.buttons}>
          {secondary.href ? (
            <a className={styles.link} data-size="large" href={secondary.href} target="_blank" rel="noopener" onClick={secondary.onPress}>
              {secondary.label}
            </a>
          ) : (
            <Button size="large" onClick={secondary.onPress}>
              {secondary.label}
            </Button>
          )}
          <Button size="large" variant="prominent" data-default onClick={primary.onPress}>
            {primary.label}
          </Button>
        </div>
      </Glass>
    </div>
  );
}
