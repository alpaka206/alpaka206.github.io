import { useRef } from 'react';
import { GREETING } from '@/content/conversation';
import { PROFILE } from '@/content/profile';
import { useMinute } from '@/lib/device';
import { formatClock, formatLongDate } from '@/lib/format';
import { Glass } from '@/ui/Glass';
import { inSystemEdge } from '../hooks';
import { Glyph } from '../kit';
import { NotificationCard } from '../NotificationCard';
import { useSwipeAway } from '../useSwipeAway';
import { Wallpaper } from '../Wallpaper';
import styles from './LockScreen.module.css';

interface LockScreenProps {
  /** Called once the Lock Screen has slid away. */
  onUnlock: () => void;
  /** The notification was tapped: unlock, then open Messages. */
  onOpenMessages: () => void;
}

/**
 * The iOS 27 Lock Screen. Unlock by dragging the whole screen up (it follows
 * the finger, rubber-bands downward and hands its velocity to a spring), or
 * by pressing the "swipe up" button, which runs the same animation.
 */
export function LockScreen({ onUnlock, onOpenMessages }: LockScreenProps) {
  const screen = useRef<HTMLDivElement>(null);
  const now = useMinute();
  const { drag, dismiss } = useSwipeAway({
    place: (y) => {
      if (screen.current) screen.current.style.transform = `translate3d(0, ${y}px, 0)`;
    },
    away: () => -window.innerHeight,
    // Where a flick would carry the screen decides, like iOS: past a third of the height unlocks.
    threshold: () => window.innerHeight / 3,
    onAway: onUnlock,
  });

  return (
    <section ref={screen} className={styles.lock} aria-label="잠금 화면" onPointerDown={(event) => !inSystemEdge(event.clientY) && drag(event)}>
      <Wallpaper />
      <div className={styles.time}>
        <p className={styles.date}>{formatLongDate(now)}</p>
        <p className={styles.clock}>
          <time dateTime={now.toISOString()}>{formatClock(now)}</time>
        </p>
      </div>

      <NotificationCard
        className={styles.notification}
        icon="icons/messages"
        title={PROFILE.name}
        time="지금"
        body={GREETING.join(' ')}
        onClick={() => dismiss(0, onOpenMessages)}
      />

      {/* The flashlight and camera positions, doing something useful on a portfolio. */}
      <Glass as="a" href="/text" variant="clear" radius={29} className={styles.quick} data-side="left" aria-label="텍스트 버전으로 보기">
        <Glyph name="doc.text" pt={18} weight="semibold" />
      </Glass>
      <Glass
        as="a"
        href={PROFILE.portfolioPdf}
        target="_blank"
        rel="noreferrer"
        variant="clear"
        radius={29}
        className={styles.quick}
        data-side="right"
        aria-label="포트폴리오 PDF 열기"
      >
        <Glyph name="arrow.down.circle" pt={18} weight="semibold" />
      </Glass>

      <button type="button" className={styles.unlock} aria-label="잠금 해제" onClick={() => dismiss()}>
        <span className={styles.hint}>위로 쓸어올려 열기</span>
        <span className={styles.indicator} aria-hidden="true" />
      </button>
    </section>
  );
}
