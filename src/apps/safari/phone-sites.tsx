import { AppIcon } from '@/ui/AppIcon';
import type { Site } from './sites';
import styles from './safari.phone.module.css';

/** A site's icon as Safari shows it on the start page: a rounded tile with a soft shadow. */
export function SiteIcon({ site, size }: { site: Site; size: number }) {
  return (
    <span className={styles.siteIcon}>
      <AppIcon icon={site.icon} size={size} className={styles.siteIconImage} />
    </span>
  );
}
