import type { MediaKey } from '@/content/types';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import styles from './NotificationCard.module.css';

interface NotificationCardProps {
  icon: MediaKey;
  title: string;
  body: string;
  /** Relative time on the right ("지금"). */
  time: string;
  onClick?: () => void;
  className?: string;
}

/**
 * An iOS 27 notification (ios.md §5): 22 pt corners, 12/14 pt padding, a
 * 38.33 pt app icon 10 pt before the text, Semibold 15/17 title with the time
 * right-aligned, Regular 15/18 body. A button when it opens something.
 */
export function NotificationCard({ icon, title, body, time, onClick, className }: NotificationCardProps) {
  const content = (
    <>
      <AppIcon icon={icon} size={38.33} className={styles.icon} />
      <span className={styles.text}>
        <span className={styles.head}>
          <span className={styles.title}>{title}</span>
          <span className={styles.time}>{time}</span>
        </span>
        <span className={styles.body}>{body}</span>
      </span>
    </>
  );
  const shared = { variant: 'clear' as const, radius: 22, className: [styles.card, className].filter(Boolean).join(' ') };
  return onClick ? (
    <Glass as="button" type="button" {...shared} onClick={onClick}>
      {content}
    </Glass>
  ) : (
    <Glass {...shared}>{content}</Glass>
  );
}
