import type { Attachment } from '@/content/conversation';
import { Picture } from '@/media/Picture';
import { useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Symbol } from '@/ui/Symbol';
import { describeAttachment } from './conversation';
import styles from './Messages.module.css';

/** A rich link in the transcript, like iMessage's link previews: it opens the window it points to. */
export function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const card = describeAttachment(attachment);
  if (!card) return null;
  return (
    <button type="button" className={styles.card} onClick={() => useWindows.getState().open(card.open.app, card.open.props)}>
      {card.photo ? (
        <Picture src={card.photo} alt="" sizes="40px" className={styles.cardPhoto} />
      ) : (
        card.icon && <AppIcon icon={card.icon} size={40} />
      )}
      <span className={styles.cardText}>
        <span className={styles.cardTitle}>{card.title}</span>
        <span className={styles.cardAction}>{card.action}</span>
      </span>
      <Symbol name="chevron.right" size={12} weight="semibold" className={styles.cardChevron} />
    </button>
  );
}
