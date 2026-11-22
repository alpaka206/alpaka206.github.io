import { PROFILE } from '@/content/profile';
import { play } from '@/lib/sound';
import { useNotifications } from './notifications';
import { useSettings, WALLPAPER_IDS } from './settings';

/**
 * Copies the email address and confirms it with a banner from `app`. Where the
 * clipboard is unavailable or refused, the banner shows the address to copy by hand.
 */
export async function copyEmail(app: string) {
  const notices = useNotifications.getState();
  try {
    await navigator.clipboard.writeText(PROFILE.email);
  } catch {
    notices.post({ app, icon: 'icons/mail', title: '복사하지 못했어요', body: PROFILE.email });
    return;
  }
  play('pop');
  notices.post({ app, icon: 'icons/mail', title: '이메일 주소를 복사했어요', body: PROFILE.email });
}

/** Flips the effective appearance (자동 becomes the opposite of what is showing). */
export function toggleDarkMode() {
  const dark = document.documentElement.dataset.theme === 'dark';
  useSettings.getState().set('appearance', dark ? 'light' : 'dark');
}

/** The next wallpaper in the list, the first again after the last. */
export function nextWallpaper() {
  const { wallpaper, set } = useSettings.getState();
  set('wallpaper', WALLPAPER_IDS[(WALLPAPER_IDS.indexOf(wallpaper) + 1) % WALLPAPER_IDS.length]!);
}

export const openTextVersion = () => window.location.assign('/text');
