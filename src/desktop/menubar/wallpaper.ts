import { useSyncExternalStore } from 'react';
import type { MediaKey } from '@/content/types';
import { useSettings, WALLPAPERS } from '@/os/settings';

const subscribeTheme = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
};

/** The appearance os/theme.ts applied to <html>, read back so every surface agrees with it. */
export const useDarkAppearance = () =>
  useSyncExternalStore(subscribeTheme, () => document.documentElement.dataset.theme === 'dark', () => false);

/** Media key of the wallpaper on screen ("유리 물결" swaps between its day and night pictures). */
export function useWallpaperKey(): MediaKey {
  const wallpaper = useSettings((s) => s.wallpaper);
  const dark = useDarkAppearance();
  return WALLPAPERS[wallpaper][dark ? 'dark' : 'light'];
}
