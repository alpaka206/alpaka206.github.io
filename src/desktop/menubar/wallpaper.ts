import type { MediaKey } from '@/content/types';
import { useSettings, WALLPAPERS } from '@/os/settings';
import { useDark } from '@/os/theme';

/** Media key of the wallpaper on screen ("유리 물결" swaps between its day and night pictures). */
export function useWallpaperKey(): MediaKey {
  const wallpaper = useSettings((s) => s.wallpaper);
  return WALLPAPERS[wallpaper][useDark() ? 'dark' : 'light'];
}
