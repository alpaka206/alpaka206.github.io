import type { MediaKey } from '@/content/types';
import { media } from '@/media/Picture';

/** WCAG relative luminance of "#rrggbb". */
export function luminance(hex: string): number {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

/**
 * macOS picks dark or white menu bar glyphs from the wallpaper's brightness
 * (K27 "On Lighter / On Darker Background", macos.md §6). The wallpaper's
 * dominant colour in the media manifest decides: above 0.45 the pale glass
 * gets dark ink; the dawn sky (#6898c8, 0.30) and the night glass get white.
 */
export const inkFor = (key: MediaKey): 'dark' | 'light' => (luminance(media(key).color) > 0.45 ? 'dark' : 'light');
