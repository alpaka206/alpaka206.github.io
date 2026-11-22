import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { springEasing, SPRINGS } from '@/lib/spring';
import { useNotifications, type Notice } from '@/os/notifications';
import { motionReduced } from '@/os/theme';
import { useWindows } from '@/os/windows';
import { usePanel } from '../menubar/panels';
import { NoticeCard } from './NoticeCard';
import styles from './Notifications.module.css';

/** How long a banner stays, unless the pointer or keyboard focus rests on it. */
const DWELL_MS = 5000;
const OFFSTAGE = 'translateX(calc(100% + 16px))';

/** Banners and Notification Center slide in from the right edge on a spring. */
export function useSlideIn(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    if (motionReduced()) return;
    const { easing, duration } = springEasing(SPRINGS.snappy);
    ref.current?.animate([{ transform: OFFSTAGE }, { transform: 'none' }], { duration, easing });
  }, [ref]);
}

function Banner({ notice }: { notice: Notice }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const leave = useCallback(() => {
    const dismiss = () => {
      // A newer notice may have replaced this one meanwhile.
      if (useNotifications.getState().banner?.id === notice.id) useNotifications.getState().dismissBanner();
    };
    const element = ref.current;
    if (!element || motionReduced()) return dismiss();
    const { easing, duration } = springEasing(SPRINGS.smooth);
    element.animate([{ transform: 'none', opacity: 1 }, { transform: OFFSTAGE, opacity: 0 }], { duration, easing, fill: 'forwards' }).finished.then(dismiss, dismiss);
  }, [notice.id]);
  useSlideIn(ref);

  // Pointer or focus on the banner: it stays; once both are gone, the full dwell starts again.
  useEffect(() => {
    if (hovered || focused) return;
    const timer = window.setTimeout(leave, DWELL_MS);
    return () => window.clearTimeout(timer);
  }, [hovered, focused, leave]);

  const target = notice.open;
  return (
    <div
      ref={ref}
      className={styles.banner}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => setFocused(event.currentTarget.contains(event.relatedTarget))}
    >
      <NoticeCard
        notice={notice}
        time="지금"
        onActivate={
          target
            ? () => {
                useWindows.getState().open(target.app, target.props);
                leave();
              }
            : undefined
        }
        onClose={leave}
      />
    </div>
  );
}

/**
 * The banner in the top-right corner (16 pt from the edge, 4 pt under the
 * menu bar), and a live region that reads each notification aloud. While
 * Notification Center is open, notices go straight into its list.
 */
export function Banners() {
  const banner = useNotifications((s) => s.banner);
  const centerOpen = usePanel((s) => s.open === 'notificationCenter');

  // Notification Center has listed whatever was pending when it opened or arrived while it was open:
  // closing it drops that banner instead of replaying it as "지금".
  useEffect(() => {
    if (!centerOpen) return;
    return () => useNotifications.getState().dismissBanner();
  }, [centerOpen]);

  return (
    <>
      <div className="visually-hidden" aria-live="polite">
        {banner ? `${banner.app}, ${banner.title}, ${banner.body}` : ''}
      </div>
      {banner && !centerOpen && <Banner key={banner.id} notice={banner} />}
    </>
  );
}
