import type { MediaKey } from '@/content/types';
import { media, mediaUrl, srcSet } from '@/media/Picture';
import { APPS, DOCK_APPS } from '@/os/apps';
import { useSettings, WALLPAPERS } from '@/os/settings';

/** Resolves when the image is decoded, or fails: a missing icon must not hold up the boot. */
function decode(image: HTMLImageElement): Promise<void> {
  return image.decode().catch(() => undefined);
}

/** Fetches the same file a full-width <Picture> or an <AppIcon> of `sizes` would pick. */
function preload(key: MediaKey, sizes: string) {
  const image = new Image();
  image.sizes = sizes;
  image.srcset = srcSet(key, media(key).formats.includes('avif') ? 'avif' : 'webp');
  return decode(image);
}

/**
 * What the boot screen waits for: the brand mark, the wallpaper the desktop
 * will show and the Dock's icons. Calls `onProgress` with the share done.
 */
export function preloadDesktop(onProgress: (fraction: number) => void): Promise<void> {
  const { wallpaper, dockSize } = useSettings.getState();
  const dark = document.documentElement.dataset.theme === 'dark';
  const mark = new Image();
  mark.src = mediaUrl('brand/alpaca', 256);
  const icons = DOCK_APPS.filter((app) => app !== null).map((app) => preload(APPS[app].icon, `${dockSize}px`));
  const tasks = [decode(mark), preload(WALLPAPERS[wallpaper][dark ? 'dark' : 'light'], '100vw'), ...icons];
  let done = 0;
  return Promise.all(tasks.map((task) => task.then(() => onProgress(++done / tasks.length)))).then(() => undefined);
}
