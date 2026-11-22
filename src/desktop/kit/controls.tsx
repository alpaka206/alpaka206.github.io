import type { ComponentProps, ComponentPropsWithoutRef } from 'react';
import { Symbol } from '@/ui/Symbol';
import styles from './controls.module.css';

/** macOS 27 controls at their regular size (24 pt), per the AppKit kit. */

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'bordered' | 'prominent';
  size?: 'regular' | 'large';
};

export function Button({ variant = 'bordered', size = 'regular', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={[styles.button, className].filter(Boolean).join(' ')}
      data-variant={variant}
      data-size={size}
      {...rest}
    />
  );
}

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

/** 54 × 24 track, 32 × 20 knob. */
export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.knob} />
    </button>
  );
}

// React 19 passes `ref` as a prop, so spreading `rest` forwards it to the <input>.
export function SearchField({ placeholder = '검색', ...rest }: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <label className={styles.searchField}>
      <Symbol name="magnifyingglass" size={13} weight="medium" />
      <input type="search" placeholder={placeholder} spellCheck={false} autoComplete="off" {...rest} />
    </label>
  );
}

export function Slider(props: Omit<ComponentPropsWithoutRef<'input'>, 'type'>) {
  return <input type="range" className={styles.slider} {...props} />;
}

/** Pop-up button: a native <select> dressed as AppKit's. */
export function PopUp(props: ComponentPropsWithoutRef<'select'>) {
  return <select className={styles.popup} {...props} />;
}
