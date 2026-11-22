import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { Topic } from '@/content/conversation';
import { useWindowFrame } from '@/desktop/kit/window';
import { Symbol } from '@/ui/Symbol';
import styles from './Messages.module.css';

interface ComposerProps {
  suggestions: readonly Topic[];
  /** While a reply is still typing, the next question waits. */
  busy: boolean;
  onAsk: (topic: Topic) => void;
  onSend: (text: string) => void;
}

/** Suggested questions above an iMessage-style field. Return sends, except mid-composition in Korean. */
export function Composer({ suggestions, busy, onAsk, onSend }: ComposerProps) {
  const { active } = useWindowFrame();
  const [text, setText] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const ready = text.trim().length > 0 && !busy;

  // As in Messages, the field takes the keyboard whenever the window does.
  useEffect(() => {
    if (active) field.current?.focus({ preventScroll: true });
  }, [active]);

  const send = () => {
    if (!ready) return;
    onSend(text.trim());
    setText('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter' || event.nativeEvent.isComposing) return;
    event.preventDefault();
    send();
  };

  return (
    <div className={styles.composer}>
      {suggestions.length > 0 && (
        <div className={styles.chips} role="group" aria-label="추천 질문">
          {suggestions.map((topic) => (
            <button key={topic.id} type="button" className={styles.chip} disabled={busy} onClick={() => onAsk(topic)}>
              {topic.question}
            </button>
          ))}
        </div>
      )}
      <div className={styles.field}>
        <input
          ref={field}
          value={text}
          placeholder="질문을 고르거나 입력하세요"
          aria-label="메시지"
          enterKeyHint="send"
          autoComplete="off"
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
        {text.trim() && (
          <button type="button" className={styles.send} aria-label="보내기" disabled={busy} onClick={send}>
            <Symbol name="arrow.up" size={14} weight="semibold" />
          </button>
        )}
      </div>
    </div>
  );
}
