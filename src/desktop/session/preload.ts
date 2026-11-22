import { AWARDS } from '@/content/profile';
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

/** The pictures in the Dock's right end: the stacks' front files and the full Trash. */
const DOCK_FILES: MediaKey[] = ['pdf/portfolio-01', 'system/document', ...AWARDS.slice(0, 3).flatMap((award) => award.images.slice(0, 1))];

/**
 * What the boot screen waits for: the brand mark, the wallpaper the desktop
 * will show and every picture in the Dock, so it is whole the moment the
 * desktop appears. Calls `onProgress` with the share done.
 */
export function preloadDesktop(onProgress: (fraction: number) => void): Promise<void> {
  const { wallpaper, dockSize } = useSettings.getState();
  const dark = document.documentElement.dataset.theme === 'dark';
  const mark = new Image();
  mark.src = mediaUrl('brand/alpaca', 256);
  const icons = DOCK_APPS.filter((app) => app !== null).map((app) => preload(APPS[app].icon, `${dockSize}px`));
  const files = DOCK_FILES.map((key) => preload(key, `${dockSize}px`));
  // The Trash is drawn at the magnified size, so magnification never shows a blurry can.
  const trash = preload('system/trash-full', `${dockSize * 2}px`);
  const tasks = [decode(mark), preload(WALLPAPERS[wallpaper][dark ? 'dark' : 'light'], '100vw'), ...icons, ...files, trash];
  let done = 0;
  return Promise.all(tasks.map((task) => task.then(() => onProgress(++done / tasks.length)))).then(() => undefined);
}
