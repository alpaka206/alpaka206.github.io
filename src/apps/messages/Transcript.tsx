import { Fragment, useLayoutEffect, useRef } from 'react';
import { PROFILE } from '@/content/profile';
import { formatTime } from '@/lib/format';
import { motionReduced } from '@/os/theme';
import { AttachmentCard } from './AttachmentCard';
import type { ChatMessage } from './conversation';
import styles from './Messages.module.css';

interface TranscriptProps {
  messages: readonly ChatMessage[];
  typing: boolean;
}

/**
 * Bubbles grouped by sender: 2 pt apart inside a group, a tail on the group's
 * last text bubble, "읽음" under the visitor's latest message.
 */
export function Transcript({ messages, typing }: TranscriptProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const lastMine = messages.findLastIndex((message) => message.from === 'me');
  const first = messages[0];

  useLayoutEffect(() => {
    const element = scroller.current;
    element?.scrollTo({ top: element.scrollHeight, behavior: motionReduced() ? 'auto' : 'smooth' });
  }, [messages.length, typing]);

  return (
    <>
      <div ref={scroller} className={styles.transcript} role="log" aria-label={`${PROFILE.name} 님과의 대화`}>
        {first && (
          <p className={styles.stamp}>
            <span className={styles.service}>iMessage</span>
            오늘 {formatTime(first.time)}
          </p>
        )}
        {messages.map((message, i) => {
          const previous = messages[i - 1];
          const next = messages[i + 1];
          return (
            <Fragment key={message.id}>
              <div className={styles.message} data-from={message.from} data-first={previous?.from !== message.from || undefined}>
                <span className="visually-hidden">{message.from === 'me' ? '나' : PROFILE.name}: </span>
                {message.attachment ? (
                  <AttachmentCard attachment={message.attachment} />
                ) : (
                  <p className={styles.bubble} data-tail={next?.from !== message.from || !next?.text || undefined}>
                    {message.text}
                  </p>
                )}
              </div>
              {i === lastMine && <p className={styles.receipt}>읽음</p>}
            </Fragment>
          );
        })}
        {typing && (
          <div className={styles.message} data-from="them" data-first={messages.at(-1)?.from !== 'them' || undefined}>
            <span className={styles.typing}>
              <i />
              <i />
              <i />
            </span>
          </div>
        )}
      </div>
      {/* Outside the log, which would read the change a second time; always there, so it is announced. */}
      <p className="visually-hidden" role="status">
        {typing && `${PROFILE.name} 님이 입력 중…`}
      </p>
    </>
  );
}
