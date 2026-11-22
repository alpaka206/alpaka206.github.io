import { useCallback, useEffect, useLayoutEffect, useState, type CSSProperties } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import type { Route } from '@/os/routes';
import { useSession } from '@/os/session';
import { useSettings } from '@/os/settings';
import { AppLayer } from './app/AppLayer';
import { BannerHost } from './banner/BannerHost';
import { registerPhoneCommands } from './commands';
import { HomeScreen } from './home/HomeScreen';
import { LockScreen } from './lock/LockScreen';
import { listenToHistory, startHistory, usePhoneNav } from './nav';
import styles from './PhoneShell.module.css';

const smooth = springEasing(SPRINGS.smooth);
const snappy = springEasing(SPRINGS.snappy);

/** lib/spring curves as CSS variables: every CSS transition in the phone uses one of these. */
const SPRING_VARIABLES = {
  '--spring-smooth': smooth.easing,
  '--spring-smooth-ms': `${smooth.duration}ms`,
  '--spring-snappy': snappy.easing,
  '--spring-snappy-ms': `${snappy.duration}ms`,
} as CSSProperties;

/** Brightness 0.3 leaves the screen at 44%: the veil goes up to 0.8 × (1 − brightness). */
const VEIL = 0.8;

/**
 * The phone: Lock Screen on the first visit of a browser session, the Home
 * Screen after that, and a deep link opens its app directly (no lock).
 */
export default function PhoneShell({ route }: { route: Route | null }) {
  const phase = useSession((s) => s.phase);
  const brightness = useSettings((s) => s.brightness);
  const [covered, setCovered] = useState(false);
  const appOpen = usePhoneNav((s) => s.shown !== null);

  useLayoutEffect(() => {
    useSession.getState().start(route?.kind === 'app');
    startHistory(route);
  }, [route]);
  useEffect(listenToHistory, []);
  useEffect(registerPhoneCommands, []);

  const unlock = useCallback(() => useSession.getState().go('desktop'), []);
  const unlockToMessages = useCallback(() => {
    unlock();
    usePhoneNav.getState().open('messages');
  }, [unlock]);

  if (phase === 'off') return null;
  const locked = phase !== 'desktop';
  return (
    <div className={styles.shell} style={SPRING_VARIABLES}>
      <HomeScreen covered={covered} inert={locked || appOpen} />
      <AppLayer onCover={setCovered} />
      {locked && <LockScreen onUnlock={unlock} onOpenMessages={unlockToMessages} />}
      <BannerHost />
      <div className={styles.dim} style={{ opacity: (1 - brightness) * VEIL }} aria-hidden="true" />
    </div>
  );
}
