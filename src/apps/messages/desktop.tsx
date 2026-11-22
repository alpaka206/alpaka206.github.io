import { useEffect, useRef, useState } from 'react';
import { PROFILE } from '@/content/profile';
import { SearchField } from '@/desktop/kit/controls';
import { Sidebar } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowFrame, useWindowTitle } from '@/desktop/kit/window';
import { formatTime } from '@/lib/format';
import { Picture } from '@/media/Picture';
import { matchesAny } from '@/os/search';
import { motionReduced } from '@/os/theme';
import { useWindows } from '@/os/windows';
import { Composer } from './Composer';
import { describeAttachment, remainingTopics, useConversation, type ChatMessage } from './conversation';
import { Transcript } from './Transcript';
import styles from './Messages.module.css';

/** The sidebar's one-line summary of the latest message, as Messages writes it. */
function preview(message: ChatMessage | undefined) {
  if (!message) return '';
  if (message.text) return message.text;
  const card = message.attachment && describeAttachment(message.attachment);
  return card ? `첨부 파일: ${card.title}` : '';
}

const restartConversation = () => {
  const conversation = useConversation.getState();
  conversation.restart();
  conversation.start(motionReduced());
};

/** 메시지: one conversation with the portfolio's owner, answered from src/content (see conversation.ts). */
export default function MessagesWindow() {
  const { active } = useWindowFrame();
  const messages = useConversation((s) => s.messages);
  const typing = useConversation((s) => s.typing);
  const asked = useConversation((s) => s.asked);
  const replying = useConversation((s) => s.replying);
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const last = messages.at(-1);
  const found = matchesAny(query, [PROFILE.name, ...messages.map((m) => m.text ?? '')]);
  const openContact = () => useWindows.getState().open('about', { view: 'profile', section: 'contact' });

  useWindowTitle(PROFILE.name);
  useEffect(() => {
    useConversation.getState().start(motionReduced());
  }, []);
  useWindowCommands({
    'messages.restart': restartConversation,
    'edit.find': () => search.current?.select(),
  });

  return (
    <div className={styles.window}>
      <SplitView
        sidebar={
          <Sidebar label="대화">
            <SearchField ref={search} aria-label="대화 검색" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
            {found && (
              // The only conversation is always the selected one; there is nothing to pick.
              <div className={styles.conversation} aria-current="true" data-key={active || undefined}>
                <Picture src={PROFILE.avatar} alt="" sizes="40px" className={styles.avatar} />
                <span className={styles.summary}>
                  <span className={styles.summaryTop}>
                    <span className={styles.contact}>{PROFILE.name}</span>
                    {last && <time className={styles.time}>{formatTime(last.time)}</time>}
                  </span>
                  <span className={styles.preview}>{preview(last)}</span>
                </span>
              </div>
            )}
            <p className={styles.empty} role="status">
              {!found && '결과 없음'}
            </p>
          </Sidebar>
        }
        toolbar={
          <Toolbar>
            <button type="button" className={styles.recipient} onClick={openContact} aria-label={`${PROFILE.name} 연락처 보기`}>
              <Picture src={PROFILE.avatar} alt="" sizes="28px" className={styles.recipientPhoto} />
              <span>{PROFILE.name}</span>
            </button>
            <ToolbarGroup label="대화">
              <ToolbarButton icon="arrow.clockwise" label="대화 처음부터" onClick={restartConversation} />
            </ToolbarGroup>
          </Toolbar>
        }
      >
        <div className={styles.chat}>
          <Transcript messages={messages} typing={typing} />
          <Composer
            suggestions={remainingTopics(asked)}
            busy={replying}
            onAsk={(topic) => useConversation.getState().ask(topic, motionReduced())}
            onSend={(text) => useConversation.getState().askText(text, motionReduced())}
          />
        </div>
      </SplitView>
    </div>
  );
}
