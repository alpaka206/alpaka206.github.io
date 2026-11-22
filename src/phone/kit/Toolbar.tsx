import type { ReactNode } from 'react';
import styles from './Toolbar.module.css';

/**
 * A floating bottom toolbar (K27 "Toolbars/iPhone/Bottom"): 48 pt glass
 * buttons 28 pt from the sides, 12 pt apart. Pass it as NavScreen's `bottom`.
 * A `spacer` child (flex: 1) pushes the following buttons to the trailing edge.
 */
export function Toolbar({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label={label}>
      {children}
    </div>
  );
}

export const ToolbarSpacer = () => <span className={styles.spacer} />;
