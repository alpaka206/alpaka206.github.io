import { useEffect, useRef, type CSSProperties } from 'react';
import { PROFILE } from '@/content/profile';
import { formatTime } from '@/lib/format';
import { Picture } from '@/media/Picture';
import { motionReduced } from '@/os/theme';
import { useKeyboardInset } from '@/phone/hooks';
import { BackButton, Glyph } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import { remainingTopics, useConversation, type ChatMessage } from './conversation';
import { AttachmentCard } from './phone-attachment';
import { Composer } from './phone-composer';
import styles from './messages.phone.module.css';

/**
 * Messages on the phone: an iMessage thread with 김규원. Replies come from the
 * shared conversation engine (scripted from the portfolio's facts); the chips
 * suggest what has not been asked yet, and typed questions are matched to the
 * closest topic.
 */
export default function View() {
  const messages = useConversation((s) => s.messages);
  const typing = useConversation((s) => s.typing);
  const asked = useConversation((s) => s.asked);
  const replying = useConversation((s) => s.replying);
  const keyboard = useKeyboardInset();
  const { open } = usePhoneApp();
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useConversation.getState().start(motionReduced());
  }, []);

  // Keep the newest bubble in view as replies arrive and when the keyboard opens.
  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end', behavior: motionReduced() ? 'auto' : 'smooth' });
  }, [messages.length, typing, keyboard]);

  const first = messages[0];
  return (
    <div className={styles.screen} style={{ '--keyboard': `${keyboard}px` } as CSSProperties}>
      <header className={styles.header}>
        <div className={styles.back}>
          <BackButton />
        </div>
        <button type="button" className={styles.contact} onClick={() => open('about')}>
          <Picture src={PROFILE.avatar} alt="" sizes="50px" className={styles.avatar} />
          <span className={styles.nameTag}>
            {PROFILE.name}
            <Glyph name="chevron.right" pt={8} weight="semibold" />
          </span>
        </button>
      </header>

      <div className={styles.thread} role="log" aria-label={`${PROFILE.name} 님과의 대화`}>
        {first && <p className={styles.stamp}>오늘 {formatTime(first.time)}</p>}
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            startsRun={messages[index - 1]?.from !== message.from}
            endsRun={(messages[index + 1]?.from ?? (typing ? 'them' : undefined)) !== message.from}
          />
        ))}
        {typing && (
          <div className={styles.item} data-from="them" data-run-start={messages.at(-1)?.from !== 'them' || undefined}>
            <span className={styles.typing}>
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
        <div ref={end} className={styles.end} />
      </div>
      <p className="visually-hidden" role="status">
        {typing && '입력 중…'}
      </p>

      <footer className={styles.composer}>
        <Composer
          topics={remainingTopics(asked)}
          busy={replying}
          onAsk={(topic) => useConversation.getState().ask(topic, motionReduced())}
          onSend={(text) => useConversation.getState().askText(text, motionReduced())}
        />
      </footer>
    </div>
  );
}

interface MessageProps {
  message: ChatMessage;
  /** First bubble from this sender in a row: more space above, sender named for screen readers. */
  startsRun: boolean;
  /** Last bubble of the run: gets the tail corner. */
  endsRun: boolean;
}

function Message({ message, startsRun, endsRun }: MessageProps) {
  return (
    <div className={styles.item} data-from={message.from} data-run-start={startsRun || undefined}>
      {startsRun && <span className="visually-hidden">{message.from === 'me' ? '나' : PROFILE.name}:</span>}
      {message.text && (
        <p className={styles.bubble} data-tail={endsRun || undefined}>
          {message.text}
        </p>
      )}
      {message.attachment && <AttachmentCard attachment={message.attachment} />}
    </div>
  );
}
