import { useCallback, useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/content/profile';
import { useMinute } from '@/lib/device';
import { formatClock } from '@/lib/format';
import { Picture } from '@/media/Picture';
import { motionReduced } from '@/os/theme';
import { Glass } from '@/ui/Glass';
import { inkFor } from '../menubar/ink';
import { useWallpaperKey } from '../menubar/wallpaper';
import { LoginStatusBar } from './LoginStatusBar';
import { beginSignIn, finishSignIn } from './signIn';
import styles from './LoginWindow.module.css';

/** "11월 22일 (일)": LoginUIKit's "EEE MMM d" with Liquid Glass on (macos.md §19). */
const dateFormat = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });

/** As many dots as a short password; they fill in one by one before the desktop appears. */
const DOTS = 8;
const DOT_MS = 45;
/** Longer than the fade-out, in case its animationend never arrives. */
const LEAVE_FALLBACK_MS = 800;

/** Placeholders as loginwindow ships them; "Touch ID" takes a no-break space. */
const PLACEHOLDER = { login: '암호 입력', lock: 'Touch ID 또는 암호 입력' } as const;

/** Keys that would type into a password field; Tab, arrows, modifiers and Escape keep their jobs. */
const typesIntoField = (event: KeyboardEvent) =>
  event.key === 'Enter' || (event.key.length === 1 && !event.metaKey && !event.ctrlKey);

/**
 * The login window after start-up or log out, and the lock screen after ⌃⌘Q
 * or sleep (macos.md §19): the wallpaper, the date and a large clock at the
 * top, the user and a password field at the bottom. The field is a look-alike
 * that never asks for anything: a click or any typed key fills it and signs in.
 */
export function LoginWindow({ mode }: { mode: 'login' | 'lock' }) {
  const now = useMinute();
  const wallpaper = useWallpaperKey();
  const [signing, setSigning] = useState(false);
  const [dots, setDots] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const first = useRef(false);
  const started = useRef(false);
  const finished = useRef(false);
  const screen = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLButtonElement>(null);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    finishSignIn(first.current);
  }, []);

  // A ref, not state: two quick key presses must not sign in twice.
  const signIn = useCallback(() => {
    if (started.current) return;
    started.current = true;
    first.current = beginSignIn();
    if (motionReduced()) finish();
    else setSigning(true);
  }, [finish]);

  // The dots fill in, then the screen fades away to the desktop.
  useEffect(() => {
    if (!signing) return;
    let count = 0;
    const timer = window.setInterval(() => {
      setDots(++count);
      if (count < DOTS) return;
      window.clearInterval(timer);
      setLeaving(true);
    }, DOT_MS);
    return () => window.clearInterval(timer);
  }, [signing]);

  useEffect(() => {
    if (!leaving) return;
    const fallback = window.setTimeout(finish, LEAVE_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [leaving, finish]);

  useEffect(() => field.current?.focus({ preventScroll: true }), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as Element;
      // Keys aimed at the power menu, or at a link or control outside this screen (the skip link), keep their meaning.
      const elsewhere = !screen.current?.contains(target) && target.closest('a, button, input, select, textarea');
      if (event.repeat || !typesIntoField(event) || target.closest('[data-status]') || elsewhere) return;
      event.preventDefault();
      signIn();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [signIn]);

  return (
    <div
      ref={screen}
      className={styles.screen}
      data-bright={inkFor(wallpaper) === 'dark' || undefined}
      data-leaving={leaving || undefined}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget) finish();
      }}
    >
      <Picture src={wallpaper} alt="" sizes="100vw" priority className={styles.wallpaper} />
      <div className={styles.scrim} />

      <LoginStatusBar power={mode === 'login'} />

      <div className={styles.dateLine}>
        <p className={styles.date}>{dateFormat.format(now)}</p>
      </div>
      <div className={styles.clockLine}>
        <p className={styles.clock}>{formatClock(now)}</p>
      </div>

      <button ref={field} type="button" className={styles.user} aria-label={`${PROFILE.name} 계정으로 로그인`} onClick={signIn}>
        <Glass variant="clear" radius={999} className={styles.tile}>
          <Picture src={PROFILE.portrait} alt="" sizes="56px" className={styles.avatar} />
          <span className={styles.name}>{PROFILE.name}</span>
        </Glass>
        <Glass variant="clear" radius={14} className={styles.password}>
          {signing ? (
            <span className={styles.dots}>
              {Array.from({ length: dots }, (_, i) => (
                <span key={i} className={styles.dot} />
              ))}
            </span>
          ) : (
            <span className={styles.placeholder}>{PLACEHOLDER[mode]}</span>
          )}
        </Glass>
      </button>
    </div>
  );
}
