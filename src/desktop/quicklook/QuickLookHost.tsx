import { useEffect, useEffectEvent, useLayoutEffect, useRef } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import { motionReduced } from '@/os/theme';
import { toRect, useWindows, type Rect } from '@/os/windows';
import { Symbol } from '@/ui/Symbol';
import { previewOf, type Preview } from './QuickLookContent';
import { closeQuickLook, stepQuickLook, useQuickLook } from './quickLook';
import styles from './QuickLook.module.css';

const FOCUSABLE = 'button, a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

/**
 * Quick Look (훑어보기): a floating glass panel over the desktop with the item's title,
 * a close button, an open button and a light preview. It grows out of the
 * item it was opened from and shrinks back into it. Escape closes, and Space
 * unless one of the panel's buttons has focus (then Space presses it); ← and →
 * step through the items. It is modal, so focus stays inside until it closes
 * and then returns to where it was.
 */
export default function QuickLookHost() {
  const { items, index, origin } = useQuickLook();
  const item = items[index];
  const preview = item ? previewOf(item) : null;
  if (!preview) return null;
  return <QuickLookPanel preview={preview} index={index} count={items.length} origin={origin} itemKey={JSON.stringify(item)} />;
}

interface PanelProps {
  preview: Preview;
  index: number;
  count: number;
  origin?: DOMRect;
  /** Changes when the shown item does, to cross-fade the content. */
  itemKey: string;
}

/** The panel fitted to the desktop area, centred. */
function placement(size: Preview['size'], area: Rect): Rect {
  const w = Math.min(size.w, area.w - 80);
  const h = Math.min(size.h, area.h - 40);
  return { x: Math.round(area.x + (area.w - w) / 2), y: Math.round(area.y + (area.h - h) / 2), w, h };
}

/** Transform (origin top-left) that draws `rect` as the item it came from. */
function fromOrigin(origin: DOMRect, rect: Rect) {
  const scale = Math.max(origin.width / rect.w, origin.height / rect.h, 0.04);
  const x = origin.left + origin.width / 2 - (rect.w * scale) / 2 - rect.x;
  const y = origin.top + origin.height / 2 - (rect.h * scale) / 2 - rect.y;
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

function QuickLookPanel({ preview, index, count, origin, itemKey }: PanelProps) {
  const area = useWindows((s) => s.area);
  const rect = placement(preview.size, area);
  const panel = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const away = origin ? fromOrigin(origin, rect) : 'scale(0.96)';
  const corner = origin ? '0 0' : '50% 50%';

  // Grow out of the item, take focus, and give it back on the way out.
  const appear = useEffectEvent(() => {
    const element = panel.current!;
    const previous = document.activeElement as HTMLElement | null;
    element.focus({ preventScroll: true });
    if (!motionReduced()) {
      const { easing, duration } = springEasing(SPRINGS.snappy);
      element.animate({ transform: [away, 'none'], transformOrigin: [corner, corner] }, { duration, easing });
      element.animate({ opacity: [0, 1] }, { duration: 160, easing: 'ease-out' });
    }
    return () => {
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  });
  // Mount only: stepping through items keeps the panel where it is.
  useLayoutEffect(() => appear(), []);

  const dismiss = () => {
    const element = panel.current;
    if (!element || leaving.current) return;
    leaving.current = true;
    if (motionReduced()) return closeQuickLook();
    element.animate(
      { transform: ['none', away], transformOrigin: [corner, corner], opacity: [1, 0] },
      { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    ).onfinish = closeQuickLook;
  };

  const openFull = () => {
    const { app, props } = preview.open;
    const from = toRect(panel.current!.getBoundingClientRect());
    closeQuickLook();
    useWindows.getState().open(app, props, from);
  };

  // Escape and the arrows win over whatever is focused inside.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    const element = panel.current;
    if (!element) return;
    const onButton = element !== document.activeElement && element.contains(document.activeElement);
    if (event.key === 'Escape' || (event.key === ' ' && !onButton)) {
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    } else if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && count > 1) {
      event.preventDefault();
      event.stopPropagation();
      stepQuickLook(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (event.key === 'Tab') {
      // Modal: Tab cycles through the panel's own controls.
      const focusable = [...element.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.matches(':disabled'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return event.preventDefault();
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === element)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !element.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  useEffect(() => {
    const listener = (event: KeyboardEvent) => onKey(event);
    window.addEventListener('keydown', listener, true);
    return () => window.removeEventListener('keydown', listener, true);
  }, []);

  return (
    <div className={styles.layer} onPointerDown={(event) => event.target === event.currentTarget && dismiss()}>
      <div
        ref={panel}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={`${preview.title} 훑어보기`}
        tabIndex={-1}
        style={{ translate: `${rect.x}px ${rect.y}px`, width: rect.w, height: rect.h }}
      >
        <header className={styles.bar}>
          <button type="button" className={styles.round} aria-label="닫기" onClick={dismiss}>
            <Symbol name="xmark" size={12} weight="semibold" />
          </button>
          {count > 1 && (
            <div className={styles.stepper}>
              <button type="button" className={styles.round} aria-label="이전 항목" disabled={index === 0} onClick={() => stepQuickLook(-1)}>
                <Symbol name="chevron.left" size={12} weight="semibold" />
              </button>
              <span className={`${styles.count} tabular`}>
                {index + 1} / {count}
              </span>
              <button type="button" className={styles.round} aria-label="다음 항목" disabled={index === count - 1} onClick={() => stepQuickLook(1)}>
                <Symbol name="chevron.right" size={12} weight="semibold" />
              </button>
            </div>
          )}
          <h2 className={`${styles.title} truncate`}>{preview.title}</h2>
          <button type="button" className={styles.open} onClick={openFull}>
            {preview.open.label}
          </button>
        </header>
        <div key={itemKey} className={styles.content}>
          {preview.body}
        </div>
      </div>
    </div>
  );
}
