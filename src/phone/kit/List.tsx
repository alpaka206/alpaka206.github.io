import type { ReactNode } from 'react';
import { Glyph } from './Glyph';
import styles from './List.module.css';

interface SectionProps {
  title?: ReactNode;
  footer?: ReactNode;
  /** Header action on the right (Regular 15, accent), e.g. "모두 보기". */
  action?: ReactNode;
  children: ReactNode;
}

/** One inset grouped section: header, rounded group of rows, footer. */
export function Section({ title, footer, action, children }: SectionProps) {
  return (
    <section className={styles.section}>
      {(title || action) && (
        <div className={styles.header}>
          {title && <h2 className={styles.headerTitle}>{title}</h2>}
          {action}
        </div>
      )}
      <ul className={styles.group}>{children}</ul>
      {footer && <p className={styles.footer}>{footer}</p>}
    </section>
  );
}

interface RowProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing value in secondary colour ("켬", "2026.10"). */
  detail?: ReactNode;
  /** An icon or picture before the text. */
  leading?: ReactNode;
  /** A control at the trailing edge (a Toggle): a tap anywhere on the row works it, as on its label. */
  control?: ReactNode;
  onClick?: () => void;
  /** A path on this site ("/text") opens in place; anything else in a new tab, with the "leaves the site" arrow. */
  href?: string;
  /** Show the disclosure chevron (default: when the row opens something here). */
  chevron?: boolean;
  /** Title in the accent colour, for action rows ("이메일 주소 복사"). */
  action?: boolean;
  /** Allow the title to wrap (long Korean names) instead of truncating. */
  wrap?: boolean;
}

/** A list row (min 52 pt, 16 pt padding, separator from the text's leading edge). */
export function Row({ title, subtitle, detail, leading, control, onClick, href, chevron = Boolean(onClick || href), action = false, wrap = false }: RowProps) {
  const external = Boolean(href && !href.startsWith('/'));
  const body = (
    <>
      {leading && <span className={styles.leading}>{leading}</span>}
      <span className={styles.main}>
        <span className={styles.texts}>
          <span className={styles.title} data-action={action || undefined} data-wrap={wrap || undefined}>
            {title}
          </span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </span>
        {detail && <span className={styles.detail}>{detail}</span>}
        {control}
        {external ? (
          <Glyph name="arrow.up.right.square" pt={15} className={styles.accessory} />
        ) : (
          chevron && <Glyph name="chevron.right" pt={13} weight="semibold" className={styles.accessory} />
        )}
      </span>
    </>
  );
  return (
    <li className={styles.row}>
      {href ? (
        <a className={styles.cell} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
          {body}
        </a>
      ) : onClick ? (
        <button type="button" className={styles.cell} onClick={onClick}>
          {body}
        </button>
      ) : control ? (
        <label className={styles.cell}>{body}</label>
      ) : (
        <div className={styles.cell}>{body}</div>
      )}
    </li>
  );
}
