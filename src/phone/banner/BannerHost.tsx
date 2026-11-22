import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNotifications, type Notice } from '@/os/notifications';
import { usePhoneNav } from '../nav';
import { NotificationCard } from '../NotificationCard';
import { useSwipeAway } from '../useSwipeAway';
import styles from './BannerHost.module.css';

/** Banners stay this long after the last touch or focus, unless swiped away or tapped. */
const SHOW_MS = 4000;

/**
 * The current notification banner, if any (one at a time, like iOS). Screen
 * readers hear it through a live region that is always there: one inserted
 * together with its text is often not announced.
 */
export function BannerHost() {
  const banner = useNotifications((s) => s.banner);
  return (
    <>
      {banner && <Banner key={banner.id} notice={banner} />}
      <p className="visually-hidden" role="status">
        {banner && `${banner.app}, ${banner.title}, ${banner.body}`}
      </p>
    </>
  );
}

/** Slides down from the top and leaves when flicked up, tapped, or left alone for 4 s. */
function Banner({ notice }: { notice: Notice }) {
  const element = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const { drag, enter, dismiss } = useSwipeAway({
    place: (y) => {
      if (element.current) element.current.style.transform = `translate3d(0, ${y}px, 0)`;
    },
    // Fully above the screen edge.
    away: () => -((element.current?.offsetTop ?? 0) + (element.current?.offsetHeight ?? 0) + 8),
    threshold: () => 40,
    onAway: () => useNotifications.getState().dismissBanner(),
  });

  useLayoutEffect(enter, [enter]);
  useEffect(() => {
    if (touched || focused) return;
    const timer = window.setTimeout(() => dismiss(), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [touched, focused, dismiss]);

  const { open } = notice;
  return (
    <div
      ref={element}
      className={styles.banner}
      onPointerDown={(event) => {
        setTouched(true);
        drag(event);
      }}
      // Touch pointers stay captured by the banner, so the finger lifting is always seen here.
      onPointerUp={() => setTouched(false)}
      onPointerCancel={() => setTouched(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <NotificationCard
        icon={notice.icon}
        title={notice.title}
        body={notice.body}
        time="지금"
        onClick={
          open &&
          (() => {
            usePhoneNav.getState().open(open.app, open.props ?? {});
            dismiss();
          })
        }
      />
    </div>
  );
}
