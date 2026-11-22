import { useState } from 'react';
import type { Topic } from '@/content/conversation';
import { Glyph } from '@/phone/kit';
import styles from './messages.phone.module.css';

interface ComposerProps {
  topics: readonly Topic[];
  /** A reply is still arriving: the next question waits, or the bubbles would interleave. */
  busy: boolean;
  onAsk: (topic: Topic) => void;
  onSend: (text: string) => void;
}

/** Suggested questions in a scrolling row, then the text field with its send button. */
export function Composer({ topics, busy, onAsk, onSend }: ComposerProps) {
  const [draft, setDraft] = useState('');
  const text = draft.trim();
  const ready = text.length > 0 && !busy;
  const send = () => {
    if (!ready) return;
    onSend(text);
    setDraft('');
  };
  return (
    <>
      {topics.length > 0 && (
        <div className={styles.chips} role="group" aria-label="추천 질문">
          {topics.map((topic) => (
            <button key={topic.id} type="button" className={styles.chip} disabled={busy} onClick={() => onAsk(topic)}>
              {topic.question}
            </button>
          ))}
        </div>
      )}
      <form
        className={styles.field}
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Enter while a Hangul syllable is still composing only finishes the syllable.
            if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault();
          }}
          placeholder="질문을 고르거나 입력"
          aria-label="메시지"
          enterKeyHint="send"
          autoComplete="off"
        />
        <button type="submit" className={styles.send} aria-label="보내기" disabled={!ready}>
          <Glyph name="arrow.up" pt={15} weight="semibold" />
        </button>
      </form>
    </>
  );
}
