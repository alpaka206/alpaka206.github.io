import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessible name; usually the row title. */
  label: string;
}

/** An iOS switch (64 × 28 capsule, 38 × 24 knob, ios.md §7). */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} className={styles.toggle} onClick={() => onChange(!checked)}>
      <span className={styles.knob} />
    </button>
  );
}
