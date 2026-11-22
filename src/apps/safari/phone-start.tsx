import { AppIcon } from '@/ui/AppIcon';
import { FAVORITES, type Site } from './sites';
import styles from './safari.phone.module.css';

/** A site's icon as Safari shows it on the start page: a rounded tile with a soft shadow. */
export function SiteIcon({ site, size }: { site: Site; size: number }) {
  return (
    <span className={styles.siteIcon}>
      <AppIcon icon={site.icon} size={size} className={styles.siteIconImage} />
    </span>
  );
}

/** Start page Favorites: 60 pt tiles, four to a row, names under them. */
export function Favorites({ onOpen }: { onOpen: (url: string) => void }) {
  return (
    <ul className={styles.favorites}>
      {FAVORITES.map((site) => (
        <li key={site.href}>
          <button type="button" className={styles.favorite} onClick={() => onOpen(site.href)}>
            <SiteIcon site={site} size={60} />
            <span className={styles.favoriteLabel}>{site.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
