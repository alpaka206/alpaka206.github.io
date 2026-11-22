import { SiteIcon } from './phone-sites';
import { FAVORITES } from './sites';
import styles from './safari.phone.module.css';

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
