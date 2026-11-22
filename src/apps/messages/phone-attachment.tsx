import type { Attachment } from '@/content/conversation';
import { Picture } from '@/media/Picture';
import { usePhoneApp } from '@/phone/nav';
import { AppIcon } from '@/ui/AppIcon';
import { describeAttachment } from './conversation';
import styles from './messages.phone.module.css';

/**
 * The link card a reply ends with; it opens the app that holds the thing.
 * Projects are large previews (their screenshot, or the icon on a tint),
 * everything else a compact row.
 */
export function AttachmentCard({ attachment }: { attachment: Attachment }) {
  const { open } = usePhoneApp();
  const card = describeAttachment(attachment);
  if (!card) return null;
  const preview = attachment.kind === 'project';
  const media = preview ? (
    card.cover ? (
      <Picture src={card.cover} alt="" sizes="260px" className={styles.cardCover} />
    ) : (
      <span className={styles.cardBanner}>{card.icon && <AppIcon icon={card.icon} size={56} />}</span>
    )
  ) : card.photo ? (
    <Picture src={card.photo} alt="" sizes="40px" className={styles.cardPortrait} />
  ) : (
    card.icon && <AppIcon icon={card.icon} size={40} />
  );
  return (
    <button type="button" className={preview ? styles.card : `${styles.card} ${styles.cardRow}`} onClick={() => open(card.open.app, card.open.props)}>
      {media}
      <span className={styles.cardText}>
        <span className={styles.cardTitle}>{card.title}</span>
        <span className={styles.cardDetail}>{card.action}</span>
      </span>
    </button>
  );
}
