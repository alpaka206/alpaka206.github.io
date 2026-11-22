import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { NoteId } from '@/content/conversation';
import { getNote, NOTES } from '@/content/notes';
import { useMinute } from '@/lib/device';
import { GlassButton, NavScreen, Row, Section } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import type { PhoneAppProps } from '../registry';
import { groupByDate, previewOf } from './noteList';
import { NoteDetail } from './phone-note';
import styles from './notes.phone.module.css';

type Screen = { note: NoteId };

const listDate = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric' });

/**
 * Notes on the phone: the list, and a note pushed over it (/notes/<id>, so
 * the browser's back returns to the list, scrolled where it was). A deep link
 * opens its note over the list, with a button down to it.
 */
export default function View({ props }: PhoneAppProps<'notes'>) {
  const { screens, push } = usePhoneApp<Screen>();
  const [linked, setLinked] = useState(props.note);
  const list = useRef<HTMLDivElement>(null);
  const now = useMinute();
  const pushed = screens.at(-1);
  const note = pushed ? getNote(pushed.note) : linked && getNote(linked);

  const showList = () => {
    flushSync(() => setLinked(undefined));
    list.current?.querySelector<HTMLElement>('[data-screen-title]')?.focus({ preventScroll: true });
  };

  return (
    <>
      <div ref={list} className={styles.layer} inert={Boolean(note)}>
        <NavScreen title="메모">
          {groupByDate(NOTES, now).map((group, index, groups) => (
            <Section key={group.label} title={group.label} footer={index === groups.length - 1 ? `메모 ${NOTES.length}개` : undefined}>
              {group.notes.map((item) => (
                <Row
                  key={item.id}
                  title={<span className={styles.listTitle}>{item.title}</span>}
                  subtitle={
                    <span className={styles.listPreview}>
                      {listDate.format(new Date(item.updated))} <span className={styles.listFirstLine}>{previewOf(item)}</span>
                    </span>
                  }
                  onClick={() => push({ note: item.id }, `/notes/${item.id}`)}
                />
              ))}
            </Section>
          ))}
        </NavScreen>
      </div>
      {note && (
        <div key={screens.length} className={styles.top} data-pushed={pushed ? '' : undefined}>
          <NoteDetail note={note} leading={pushed ? undefined : <GlassButton icon="chevron.left" label="메모 목록" onClick={showList} />} />
        </div>
      )}
    </>
  );
}
