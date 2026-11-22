import type { ReactNode } from 'react';
import styles from './SplitView.module.css';

interface SplitViewProps {
  /** A <Sidebar>; omit for windows without one. */
  sidebar?: ReactNode;
  sidebarHidden?: boolean;
  /** A <Toolbar>; content scrolls underneath it. */
  toolbar: ReactNode;
  children: ReactNode;
}

/** The standard window layout: optional sidebar, a toolbar, and a scrolling content area. */
export function SplitView({ sidebar, sidebarHidden = false, toolbar, children }: SplitViewProps) {
  return (
    <div className={styles.split} data-sidebar={sidebar && !sidebarHidden ? '' : undefined}>
      {sidebar && !sidebarHidden && sidebar}
      <div className={styles.main}>
        {toolbar}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
