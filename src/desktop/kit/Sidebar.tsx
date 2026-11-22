import type { ReactNode } from 'react';
import { Symbol, type SymbolName } from '@/ui/Symbol';
import styles from './Sidebar.module.css';

/**
 * macOS 27 source list: edge to edge, full window height, glass behind,
 * 32 pt rows (the default "medium" sidebar icon size), coloured icons and a
 * semibold selected row. The top 52 pt belong to the traffic lights.
 */
export function Sidebar({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav className={styles.sidebar} aria-label={label} data-window-drag>
      {children}
    </nav>
  );
}

export function SidebarSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className={styles.section} role="group" aria-label={title}>
      {title && <p className={styles.header}>{title}</p>}
      <ul className={styles.list}>{children}</ul>
    </div>
  );
}

interface SidebarItemProps {
  label: string;
  icon?: SymbolName;
  /** A coloured dot instead of an icon (Finder tags). */
  dot?: string;
  selected?: boolean;
  onSelect: () => void;
  trailing?: ReactNode;
}

export function SidebarItem({ label, icon, dot, selected = false, onSelect, trailing }: SidebarItemProps) {
  return (
    <li>
      <button type="button" className={styles.item} aria-current={selected ? 'page' : undefined} onClick={onSelect}>
        <span className={styles.icon} aria-hidden="true">
          {icon && <Symbol name={icon} size={16} weight="medium" />}
          {dot && <span className={styles.dot} style={{ background: dot }} />}
        </span>
        <span className={styles.label}>{label}</span>
        {trailing}
      </button>
    </li>
  );
}
