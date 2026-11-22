import { useEffect, useId, useRef, useState } from 'react';
import { PROFILE } from '@/content/profile';
import { Toolbar, ToolbarButton, ToolbarGroup } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowTitle } from '@/desktop/kit/window';
import { runCommand } from '@/os/commands';
import { Symbol } from '@/ui/Symbol';
import type { DesktopAppProps } from '../registry';
import { prefillSubject, useDraft } from './draft';
import { mailtoHref } from './mailto';
import styles from './Mail.module.css';

/**
 * Mail's new-message window, addressed to the owner. 보내기 (⇧⌘D) hands the
 * draft to the visitor's own mail app through a mailto: link. The draft
 * outlives the window (draft.ts), so closing it loses nothing.
 */
export default function MailWindow({ props }: DesktopAppProps<'mail'>) {
  const { subject, body } = useDraft();
  const [state, setState] = useState<'editing' | 'empty' | 'sent'>('editing');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectId = useId();
  const errorId = useId();

  useEffect(() => prefillSubject(props.subject), [props.subject]);

  const title = subject.trim() || '새로운 메시지';
  useWindowTitle(title);

  const send = () => {
    if (!body.trim()) {
      setState('empty');
      bodyRef.current?.focus();
      return;
    }
    window.location.assign(mailtoHref(PROFILE.email, { subject, body }));
    setState('sent');
  };

  useWindowCommands({ 'mail.send': send });

  return (
    <div className={styles.mail}>
      <Toolbar
        inset
        title={title}
        leading={
          <ToolbarGroup label="메시지">
            <ToolbarButton icon="paperplane" label="보내기" aria-keyshortcuts="Shift+Meta+D" onClick={send} />
          </ToolbarGroup>
        }
      >
        <ToolbarGroup label="주소">
          <ToolbarButton icon="doc.on.doc" label="주소 복사" onClick={() => runCommand('system.copyEmail')} />
        </ToolbarGroup>
      </Toolbar>

      <div className={styles.header}>
        <span className={styles.label}>받는 사람:</span>
        <span className={styles.token}>{PROFILE.email}</span>
      </div>
      <div className={styles.header}>
        <label className={styles.label} htmlFor={subjectId}>
          제목:
        </label>
        <input
          id={subjectId}
          name="subject"
          autoComplete="off"
          className={styles.subject}
          value={subject}
          // Like a new message in Mail: the caret waits in the first empty field.
          autoFocus={!props.subject}
          onChange={(event) => useDraft.setState({ subject: event.currentTarget.value })}
        />
      </div>

      {state !== 'editing' && (
        <p className={styles.notice} data-tone={state} role={state === 'empty' ? 'alert' : 'status'} id={errorId}>
          <Symbol name={state === 'empty' ? 'info.circle' : 'checkmark'} size={13} />
          {state === 'empty' ? '본문을 입력해 주세요.' : '메일 앱으로 넘겼어요. 열리지 않으면 주소를 복사해 보내 주세요.'}
        </p>
      )}

      <textarea
        ref={bodyRef}
        name="body"
        autoComplete="off"
        className={styles.body}
        value={body}
        aria-label="본문"
        autoFocus={Boolean(props.subject)}
        aria-invalid={state === 'empty' || undefined}
        aria-describedby={state === 'empty' ? errorId : undefined}
        placeholder={`${PROFILE.name} 님에게 남길 내용을 적어 주세요.`}
        onChange={(event) => {
          useDraft.setState({ body: event.currentTarget.value });
          if (state !== 'editing') setState('editing');
        }}
      />
    </div>
  );
}
