import { PROFILE } from '@/content/profile';
import { APPS, type AppId } from '@/os/apps';
import { useNotifications } from '@/os/notifications';

/** The public address of a deep link: what a recruiter can paste and land on. */
export const shareUrl = (path: string) => new URL(path, PROFILE.site).href;

/**
 * Copies a link and confirms it with a banner from the app that copied it
 * (the clipboard is silent otherwise); where the clipboard is refused, the
 * banner shows the address to copy by hand.
 */
export async function copyLink(url: string, from: AppId) {
  const { name, icon } = APPS[from];
  const { post } = useNotifications.getState();
  try {
    await navigator.clipboard.writeText(url);
    post({ app: name, icon, title: '링크를 복사했어요', body: url });
  } catch {
    post({ app: name, icon, title: '링크를 복사하지 못했어요', body: url });
  }
}

/** The system share sheet where there is one (phones), otherwise the link is copied. A dismissed sheet does nothing. */
export async function share(title: string, url: string, from: AppId) {
  try {
    if (navigator.share) return await navigator.share({ title, url });
  } catch (error) {
    if ((error as DOMException).name === 'AbortError') return;
  }
  await copyLink(url, from);
}
