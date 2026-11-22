import type { ReactNode } from 'react';
import styles from './Form.module.css';

/** System Settings style: titled groups of 40 pt rows on a 3% fill, radius 12. */
export function FormSection({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.group}>{children}</div>
      {footer && <p className={styles.footer}>{footer}</p>}
    </section>
  );
}

interface FormRowProps {
  label: ReactNode;
  description?: ReactNode;
  /** The control on the trailing side. */
  children?: ReactNode;
  /** Associates the label with a control id for screen readers. */
  htmlFor?: string;
}

export function FormRow({ label, description, children, htmlFor }: FormRowProps) {
  return (
    <div className={styles.row}>
      <div className={styles.text}>
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span>{label}</span>}
        {description && <p className={styles.description}>{description}</p>}
      </div>
      {children && <div className={styles.control}>{children}</div>}
    </div>
  );
}
