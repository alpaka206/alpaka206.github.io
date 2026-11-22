import type { ReactNode } from 'react';
import { Symbol } from '@/ui/Symbol';
import styles from './PaneLayout.module.css';

/** The scrolling body of a settings pane. Key it by pane so each one opens at the top. */
export function PaneBody({ children }: { children: ReactNode }) {
  return (
    <div className={styles.body}>
      <div className={styles.column}>{children}</div>
    </div>
  );
}

/** General › About style header: the subject centred above its name. */
export function Hero({ media, title, lines }: { media: ReactNode; title: string; lines: readonly string[] }) {
  return (
    <header className={styles.hero}>
      {media}
      <h2 className={styles.title}>{title}</h2>
      {lines.map((line, i) => (
        <p key={line} className={i ? styles.line : styles.subtitle}>
          {line}
        </p>
      ))}
    </header>
  );
}

/** A row's read-only value: secondary label colour on the trailing edge. */
export const Value = ({ children }: { children: ReactNode }) => <span className={styles.value}>{children}</span>;

/** A link that leaves the site, marked the way macOS marks external links. */
export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={styles.link} href={href} target="_blank" rel="noreferrer">
      {children}
      <Symbol name="arrow.up.right.square" size={12} />
    </a>
  );
}
