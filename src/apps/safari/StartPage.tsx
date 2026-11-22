import { useId } from 'react';
import { AppIcon } from '@/ui/AppIcon';
import { FAVORITES } from './sites';
import styles from './Safari.module.css';

/** The start page of a new tab: 즐겨찾기 as icon tiles. */
export function StartPage({ onOpen }: { onOpen: (url: string) => void }) {
  const headingId = useId();
  return (
    <div className={styles.start}>
      <section className={styles.startSection} aria-labelledby={headingId}>
        <h2 id={headingId} className={styles.startHeading}>
          즐겨찾기
        </h2>
        <ul className={styles.favorites}>
          {FAVORITES.map((site) => (
            <li key={site.href}>
              <button type="button" className={styles.favorite} onClick={() => onOpen(site.href)}>
                <AppIcon icon={site.icon} size={64} className={styles.favoriteIcon} />
                <span className={styles.favoriteTitle}>{site.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
