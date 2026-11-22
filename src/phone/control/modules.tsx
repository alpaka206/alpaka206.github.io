import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { useDrag } from '@/lib/useDrag';
import { Glass } from '@/ui/Glass';
import type { SymbolName } from '@/ui/Symbol';
import { clamp } from '../geometry';
import { Glyph } from '../kit';
import styles from './ControlCenter.module.css';

/** Module glass: Liquid Glass "Clear" (ios.md §6). Every module is a 34 pt-radius shape. */
const RADIUS = 34;

interface SliderProps {
  label: string;
  icon: SymbolName;
  /** 0..1 */
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
  /** Spoken value, e.g. "72%". */
  valueText: string;
}

/**
 * A 1 × 2 slider module (70 × 155): the fill rises from the bottom. Drag
 * anywhere on it (relative, like iOS), or use the arrow keys.
 */
export function SliderModule({ label, icon, value, onChange, onCommit, valueText }: SliderProps) {
  const start = useRef({ value: 0, height: 1 });
  const drag = useDrag(
    {
      onStart: () => {
        start.current.value = value;
      },
      onMove: ({ dy }) => onChange(clamp(start.current.value - dy / start.current.height, 0, 1)),
      onEnd: () => onCommit?.(),
    },
    { axis: 'y', threshold: 2 },
  );
  const onKeyDown = (event: KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowUp: 0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowLeft: -0.1, PageUp: 0.25, PageDown: -0.25 };
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : steps[event.key] !== undefined ? value + steps[event.key]! : null;
    if (next === null) return;
    event.preventDefault();
    onChange(clamp(next, 0, 1));
    onCommit?.();
  };
  return (
    <Glass
      variant="clear"
      radius={RADIUS}
      className={`${styles.module} ${styles.slider}`}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={valueText}
      style={{ '--level': value } as CSSProperties}
      onPointerDown={(event: PointerEvent<HTMLElement>) => {
        event.stopPropagation();
        start.current.height = event.currentTarget.offsetHeight;
        drag(event);
      }}
      onKeyDown={onKeyDown}
    >
      <span className={styles.fill} />
      <Glyph name={icon} pt={21} weight="semibold" className={styles.sliderGlyph} />
    </Glass>
  );
}

interface RoundProps {
  label: string;
  icon: SymbolName;
  /** Set for a toggle (white when on); omit for an action. */
  on?: boolean;
  onClick: (from: HTMLElement) => void;
}

/** A 1 × 1 round module (68 pt circle, symbol 21 pt Bold): a toggle or an action. */
export function RoundButton({ label, icon, on, onClick }: RoundProps) {
  return (
    <Glass as="button" type="button" variant="clear" radius={RADIUS} className={`${styles.module} ${styles.round}`} aria-label={label} aria-pressed={on} data-on={on || undefined} onClick={(event) => onClick(event.currentTarget)}>
      <Glyph name={icon} pt={21} weight="semibold" />
    </Glass>
  );
}

interface WideProps {
  title: string;
  detail: string;
  /** The 41 pt circle on the left: a symbol, or any picture. */
  icon: ReactNode;
  /** Set for a toggle (white icon when on); omit for an action. */
  on?: boolean;
  onClick: () => void;
}

/** A 2 × 1 module (155 × 69): 41 pt icon circle, title Semibold 14 and detail Medium 14 at 40%. */
export function WideModule({ title, detail, icon, on, onClick }: WideProps) {
  return (
    <Glass as="button" type="button" variant="clear" radius={RADIUS} className={`${styles.module} ${styles.wide}`} aria-pressed={on} data-on={on || undefined} onClick={onClick}>
      <span className={styles.wideIcon}>{icon}</span>
      <span className={styles.wideText}>
        <span className={styles.wideTitle}>{title}</span>
        <span className={styles.wideDetail}>{detail}</span>
      </span>
    </Glass>
  );
}

interface Action {
  label: string;
  icon: SymbolName;
  run: () => void;
}

/** A 2 × 2 module (155 × 155) holding a title and two actions. */
export function ActionsModule({ title, actions }: { title: string; actions: readonly Action[] }) {
  return (
    <Glass variant="clear" radius={RADIUS} className={`${styles.module} ${styles.actions}`} role="group" aria-label={title}>
      <span className={styles.actionsTitle} aria-hidden="true">
        {title}
      </span>
      {actions.map((action) => (
        <button key={action.label} type="button" className={styles.action} onClick={action.run}>
          <span className={styles.actionIcon}>
            <Glyph name={action.icon} pt={15} weight="semibold" />
          </span>
          <span className={styles.actionLabel}>{action.label}</span>
        </button>
      ))}
    </Glass>
  );
}
