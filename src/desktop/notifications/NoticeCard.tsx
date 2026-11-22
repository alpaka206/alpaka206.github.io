import type { Notice } from '@/os/notifications';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import { Symbol } from '@/ui/Symbol';
import styles from './Notifications.module.css';

interface NoticeCardProps {
  notice: Notice;
  /** "지금", "3분 전", "오전 1:44". */
  time: string;
  onActivate?: () => void;
  onClose?: () => void;
}

/**
 * One notification as macOS 27 lays it out (macos.md §10, K27
 * "Notifications/Single"): 344 pt wide, radius 20, a 32 pt app icon centred
 * in a 40 pt column, Bold 13 title over Regular 13 body, the time top right.
 * The whole card opens what it is about; a close button appears on hover.
 */
export function NoticeCard({ notice, time, onActivate, onClose }: NoticeCardProps) {
  const content = (
    <>
      <span className={styles.icon}>
        <AppIcon icon={notice.icon} size={32} />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{notice.title}</span>
        <span className={styles.body}>{notice.body}</span>
      </span>
      <span className={styles.time}>{time}</span>
    </>
  );
  return (
    <Glass variant="regular" radius={20} className={styles.card}>
      {onActivate ? (
        <button type="button" className={styles.cardBody} aria-label={`${notice.app}, ${notice.title}, ${notice.body}`} onClick={onActivate}>
          {content}
        </button>
      ) : (
        <div className={styles.cardBody}>{content}</div>
      )}
      {onClose && (
        <button type="button" className={styles.close} aria-label="알림 닫기" onClick={onClose}>
          <Symbol name="xmark" size={10} weight="semibold" />
        </button>
      )}
    </Glass>
  );
}
