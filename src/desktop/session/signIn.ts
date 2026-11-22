import { GREETING } from '@/content/conversation';
import { PROFILE } from '@/content/profile';
import { play } from '@/lib/sound';
import { readStorage, writeStorage } from '@/lib/storage';
import { useNotifications } from '@/os/notifications';
import { useSession } from '@/os/session';
import { useSettings } from '@/os/settings';
import { enterFullScreen } from '@/os/systemCommands';

const WELCOMED = 'welcomed';
/** The welcome message lands a moment after the desktop, the way a login item's would. */
const WELCOME_DELAY_MS = 1200;

/**
 * The part of signing in that must run inside the click or key press itself:
 * browsers allow full screen, keyboard lock and audio only in a user gesture.
 * Returns whether this is the first sign-in of the browser session.
 */
export function beginSignIn(): boolean {
  if (useSettings.getState().fullscreenOnLogin && !document.fullscreenElement) void enterFullScreen();
  const first = !readStorage('sessionStorage', WELCOMED);
  if (first) play('startup');
  return first;
}

/** Shows the desktop; the first time, 메시지 says hello. */
export function finishSignIn(first: boolean) {
  useSession.getState().go('desktop');
  if (!first) return;
  writeStorage('sessionStorage', WELCOMED, '1');
  window.setTimeout(() => {
    useNotifications.getState().post({
      app: '메시지',
      icon: 'icons/messages',
      title: PROFILE.name,
      body: GREETING.join(' '),
      open: { app: 'messages' },
    });
  }, WELCOME_DELAY_MS);
}
