import type { CSSProperties, ReactNode } from 'react';
import { Symbol, type SymbolName } from '@/ui/Symbol';
import styles from './ControlCenter.module.css';

interface ModuleProps {
  cols: number;
  rows: number;
  /** Names the group when its controls need the context. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/** A platter on the Control Center grid, `cols` × `rows` cells of 63 pt. */
export function Module({ cols, rows, label, className, children }: ModuleProps) {
  return (
    <div
      role={label ? 'group' : undefined}
      aria-label={label}
      className={[styles.module, className].filter(Boolean).join(' ')}
      style={{ gridColumn: `span ${cols}`, gridRow: `span ${rows}` }}
    >
      {children}
    </div>
  );
}

interface ToggleRowProps {
  icon: SymbolName;
  label: string;
  on: boolean;
  onChange: (on: boolean) => void;
}

/** A switch drawn as Control Center draws one: a round glyph that turns accent-blue when on, its name beside it. */
export function ToggleRow({ icon, label, on, onChange }: ToggleRowProps) {
  return (
    <button type="button" role="switch" aria-checked={on} className={styles.toggle} onClick={() => onChange(!on)}>
      <span className={styles.circle}>
        <Symbol name={icon} size={16} weight="medium" />
      </span>
      <span className={styles.toggleLabel}>{label}</span>
    </button>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Released: the moment macOS plays its feedback sound. */
  onCommit?: () => void;
  /** The glyph in the slider; a button when it does something (the speaker mutes). */
  icon: ReactNode;
}

const percent = new Intl.NumberFormat('ko-KR', { style: 'percent' });

/** A Control Center slider: a capsule that fills from the left, on a real range input. */
export function Slider({ label, value, min, max, onChange, onCommit, icon }: SliderProps) {
  const fraction = (value - min) / (max - min);
  return (
    <div className={styles.slider} style={{ '--value': fraction } as CSSProperties}>
      <span className={styles.fill} />
      <input
        type="range"
        aria-label={label}
        // The setting as a percentage (brightness bottoms out at 30%), not the slider's position.
        aria-valuetext={percent.format(value)}
        min={min}
        max={max}
        step={0.01}
        value={value}
        className={styles.range}
        onChange={(event) => onChange(Number(event.target.value))}
        onPointerUp={onCommit}
        onKeyUp={onCommit}
      />
      <span className={styles.sliderIcon}>{icon}</span>
    </div>
  );
}

interface ChoiceProps {
  /** Lets the group's arrow keys find it (lib/arrowKeys.ts). */
  value: string;
  icon: SymbolName;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

/** One option of a radio group shown as a glyph circle with its name below; only the chosen one is a tab stop. */
export function Choice({ value, icon, label, selected, onSelect }: ChoiceProps) {
  return (
    <button type="button" role="radio" aria-checked={selected} tabIndex={selected ? 0 : -1} data-value={value} className={styles.choice} onClick={onSelect}>
      <span className={styles.circle}>
        <Symbol name={icon} size={16} weight="medium" />
      </span>
      {label}
    </button>
  );
}

/** A labelled action tile: glyph circle and name. */
export function ActionTile({ icon, label, onClick }: { icon: SymbolName; label: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.action} onClick={onClick}>
      <span className={styles.circle}>
        <Symbol name={icon} size={16} weight="medium" />
      </span>
      <span className={styles.toggleLabel}>{label}</span>
    </button>
  );
}
