import type { CSSProperties } from 'react';
import { radioArrowKeys } from '@/lib/arrowKeys';
import styles from './Segmented.module.css';

interface SegmentedProps<T extends string> {
  /** Each value with its label, in display order. */
  options: Readonly<Record<T, string>>;
  value: T;
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
}

/** A segmented control (32 pt, ios.md §7) acting as a radio group; arrow keys move the choice. */
export function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  const values = Object.keys(options) as T[];
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={styles.segmented}
      style={{ '--count': values.length, '--index': Math.max(0, values.indexOf(value)) } as CSSProperties}
      onKeyDown={radioArrowKeys(values, value, onChange)}
    >
      <span className={styles.thumb} aria-hidden="true" />
      {values.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === value}
          tabIndex={option === value ? 0 : -1}
          data-value={option}
          className={styles.option}
          onClick={() => onChange(option)}
        >
          {options[option]}
        </button>
      ))}
    </div>
  );
}
