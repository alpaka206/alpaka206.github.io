import { Picture } from '@/media/Picture';
import { useSettings, WALLPAPERS } from '@/os/settings';
import { useDark } from '@/os/theme';
import styles from './Wallpaper.module.css';

/**
 * The portrait wallpaper for the current theme. The Home Screen variant adds
 * the system's dimming layer (ios.md §2: black 10% light, 8% dark).
 */
export function Wallpaper({ dimmed = false }: { dimmed?: boolean }) {
  const id = useSettings((s) => s.wallpaper);
  const dark = useDark();
  const wallpaper = WALLPAPERS[id] ?? WALLPAPERS.glass;
  return (
    <div className={styles.wallpaper} data-dimmed={dimmed || undefined} aria-hidden="true">
      <Picture src={dark ? wallpaper.portraitDark : wallpaper.portraitLight} alt="" sizes="100vw" priority className={styles.image} />
    </div>
  );
}
