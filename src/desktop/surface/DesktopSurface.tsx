import { useWallpaperKey } from '@/desktop/menubar/wallpaper';
import { Picture } from '@/media/Picture';
import { DesktopIcons } from './icons/DesktopIcons';
import { Widgets } from './widgets/Widgets';
import styles from './DesktopSurface.module.css';

/**
 * The desktop under every window: the wallpaper (the one image loaded with
 * high priority), the desktop's files on the right and widgets on the left.
 */
export default function DesktopSurface() {
  const wallpaper = useWallpaperKey();
  return (
    <div className={styles.surface}>
      <Picture key={wallpaper} src={wallpaper} alt="" sizes="100vw" priority className={styles.wallpaper} />
      <DesktopIcons />
      <Widgets />
    </div>
  );
}
