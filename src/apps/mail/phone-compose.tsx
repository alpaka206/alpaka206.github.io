import { useId } from 'react';
import { PROFILE } from '@/content/profile';
import { useKeyboardInset } from '@/phone/hooks';
import { GlassButton, Sheet, useDismissSheet } from '@/phone/kit';
import { mailtoHref, useDraft } from './draft';
import styles from './mail.phone.module.css';

/**
 * The compose sheet, after iOS Mail: the fixed recipient, 제목 and 본문 rows,
 * the body above the keyboard. 보내기 opens the device's mail app; the draft
 * stays for next time.
 */
export function Compose({ onClose }: { onClose: () => void }) {
  const { subject, body } = useDraft();
  const keyboard = useKeyboardInset();
  const subjectId = useId();
  return (
    <Sheet title="새로운 메시지" onClose={onClose} trailing={<SendButton disabled={!subject.trim() && !body.trim()} />}>
      <div className={styles.compose} style={{ paddingBottom: keyboard }}>
        <div className={styles.field}>
          <span className={styles.label}>받는 사람:</span>
          <span className="truncate">{PROFILE.email}</span>
        </div>
        <div className={styles.field}>
          <label htmlFor={subjectId} className={styles.label}>
            제목:
          </label>
          <input
            id={subjectId}
            name="subject"
            className={styles.input}
            value={subject}
            onChange={(event) => useDraft.setState({ subject: event.target.value })}
            autoComplete="off"
          />
        </div>
        <textarea
          name="body"
          className={styles.body}
          value={body}
          onChange={(event) => useDraft.setState({ body: event.target.value })}
          aria-label="본문"
          placeholder="본문"
          autoComplete="off"
        />
      </div>
    </Sheet>
  );
}

/** Hands the draft to the mail app, then closes the sheet with its own animation (it must render inside the sheet). */
function SendButton({ disabled }: { disabled: boolean }) {
  const dismiss = useDismissSheet();
  return (
    <GlassButton
      icon="arrow.up"
      label="보내기"
      prominent
      disabled={disabled}
      onClick={() => {
        window.location.href = mailtoHref(PROFILE.email, useDraft.getState());
        dismiss();
      }}
    />
  );
}
