import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react';
import { Symbol, type SymbolName } from '@/ui/Symbol';
import { useWindowFrame } from './window';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  title?: string;
  subtitle?: string;
  /** Leave room for the traffic lights (a window without a sidebar). */
  inset?: boolean;
  /** Items between the title and the trailing edge, in source order. */
  children?: ReactNode;
  /** Items before the title (back/forward). */
  leading?: ReactNode;
}

/**
 * The unified toolbar (52 pt): the window's drag region, its title and up to
 * three glass groups. macOS 27 puts the title left-aligned, Semibold 15, or
 * Bold 13 over a Regular 11 subtitle.
 */
export function Toolbar({ title, subtitle, inset = false, children, leading }: ToolbarProps) {
  const { active } = useWindowFrame();
  return (
    <div className={styles.toolbar} data-window-drag data-inset={inset || undefined} data-active={active || undefined}>
      {leading}
      {title && (
        <div className={styles.titles}>
          <h1 className={subtitle ? styles.titleSmall : styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      <div className={styles.spacer} />
      {children}
    </div>
  );
}

/** One glass capsule holding related buttons (36 pt tall, 4 pt padding, 9 pt between buttons). */
export function ToolbarGroup({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      {children}
    </div>
  );
}

interface ToolbarButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  icon: SymbolName;
  label: string;
  pressed?: boolean;
}

/** Clicking keeps keyboard focus where it was (macOS toolbar buttons never take it); Tab still reaches them. */
export function ToolbarButton({ icon, label, pressed, ...rest }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onMouseDown={(event) => event.preventDefault()}
      {...rest}
    >
      <Symbol name={icon} size={18} weight="medium" />
    </button>
  );
}

interface ToolbarLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'children'> {
  icon: SymbolName;
  label: string;
  href: string;
}

/** A toolbar button that opens a page in a new tab: a real link, so ⌘-click and the browser's link menu work. */
export function ToolbarLink({ icon, label, ...rest }: ToolbarLinkProps) {
  return (
    <a className={styles.button} aria-label={label} title={label} target="_blank" rel="noopener" onMouseDown={(event) => event.preventDefault()} {...rest}>
      <Symbol name={icon} size={18} weight="medium" />
    </a>
  );
}

interface ToolbarSearchProps extends Omit<ComponentProps<'input'>, 'type'> {
  label?: string;
}

export function ToolbarSearch({ label = '검색', placeholder = '검색', ...rest }: ToolbarSearchProps) {
  return (
    <label className={styles.search}>
      <Symbol name="magnifyingglass" size={16} weight="medium" />
      <input type="search" aria-label={label} placeholder={placeholder} spellCheck={false} autoComplete="off" {...rest} />
    </label>
  );
}
