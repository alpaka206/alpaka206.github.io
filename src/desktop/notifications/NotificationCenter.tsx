import { useEffect, useRef } from 'react';
import { useMinute } from '@/lib/device';
import { formatTime } from '@/lib/format';
import { useNotifications, type Notice } from '@/os/notifications';
import { useWindows } from '@/os/windows';
import { closePanel, toggleSelector, usePanel } from '../menubar/panels';
import { inkFor } from '../menubar/ink';
import { useWallpaperKey } from '../menubar/wallpaper';
import { useDismiss } from '../menus/useDismiss';
import { useSlideIn } from './Banners';
import { NoticeCard } from './NoticeCard';
import { CalendarWidget, StatsWidget } from './widgets';
import styles from './Notifications.module.css';

const relative = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

/** "지금", "12분 전", then the clock time, as Notification Center labels its list. */
function since(time: Date, now: Date) {
  const minutes = Math.floor((now.getTime() - time.getTime()) / 60_000);
  if (minutes < 1) return relative.format(0, 'second');
  if (minutes < 60) return relative.format(-minutes, 'minute');
  return formatTime(time);
}

function openNotice(notice: Notice) {
  if (notice.open) useWindows.getState().open(notice.open.app, notice.open.props);
  closePanel();
}

function NotificationCenterPanel() {
  const ref = useRef<HTMLElement>(null);
  useDismiss(true, ref, closePanel, { ignore: toggleSelector('notificationCenter') });
  const history = useNotifications((s) => s.history);
  const now = useMinute();
  const ink = inkFor(useWallpaperKey());
  useSlideIn(ref);
  useEffect(() => ref.current?.focus({ preventScroll: true }), []);

  return (
    <aside ref={ref} aria-label="알림 센터" tabIndex={-1} className={styles.center} data-ink={ink}>
      {history.length > 0 && (
        <section aria-labelledby="notification-history" className={styles.history}>
          <div className={styles.historyHead}>
            <h2 id="notification-history" className={styles.historyTitle}>
              알림
            </h2>
            <button type="button" className={styles.clear} onClick={() => useNotifications.getState().clear()}>
              모두 지우기
            </button>
          </div>
          <ol className={styles.list}>
            {history.map((notice) => (
              <li key={notice.id}>
                <NoticeCard notice={notice} time={since(notice.time, now)} onActivate={notice.open ? () => openNotice(notice) : undefined} />
              </li>
            ))}
          </ol>
        </section>
      )}
      <div className={styles.widgets}>
        <CalendarWidget now={now} />
        <StatsWidget
          onOpen={(slug) => {
            useWindows.getState().open('portfolio', { slug });
            closePanel();
          }}
        />
      </div>
    </aside>
  );
}

/** Notification Center: the clock in the menu bar slides it in from the right edge. Notifications first, widgets below, as in macOS. */
export function NotificationCenter() {
  const open = usePanel((s) => s.open === 'notificationCenter');
  return open ? <NotificationCenterPanel /> : null;
}
