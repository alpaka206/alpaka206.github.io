import { useRef, useState } from 'react';
import type { NoteId } from '@/content/conversation';
import { NOTES } from '@/content/notes';
import { Sidebar, SidebarItem, SidebarSection } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSearch } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowFrame, useWindowTitle } from '@/desktop/kit/window';
import { useMinute } from '@/lib/device';
import { useWindows } from '@/os/windows';
import type { DesktopAppProps } from '../registry';
import { listArrowKeys } from '@/lib/arrowKeys';
import { NoteBody } from './NoteBody';
import { groupByDate, listDate, matchesNote, newestFirst, previewOf } from './noteList';
import styles from './Notes.module.css';

/** 메모: one folder of read-only notes. The open note lives in the window's props (/notes/how-built). */
export default function NotesWindow({ props }: DesktopAppProps<'notes'>) {
  const { active } = useWindowFrame();
  const now = useMinute();
  const [query, setQuery] = useState('');
  const search = useRef<HTMLInputElement>(null);
  const note = NOTES.find((n) => n.id === props.note) ?? newestFirst(NOTES)[0]!;
  const found = NOTES.filter((n) => matchesNote(n, query));
  const order = newestFirst(found).map((n) => n.id);
  const select = (id: NoteId) => useWindows.getState().open('notes', { note: id });

  useWindowTitle(note.title);
  useWindowCommands({ 'edit.find': () => search.current?.select() });

  return (
    <div className={styles.window}>
      <SplitView
        sidebar={
          <Sidebar label="폴더">
            <SidebarSection title="나의 Mac">
              <SidebarItem
                label="포트폴리오"
                icon="folder"
                selected
                onSelect={() => setQuery('')}
                trailing={<span className={styles.count}>{NOTES.length}</span>}
              />
            </SidebarSection>
          </Sidebar>
        }
        toolbar={
          <Toolbar>
            <ToolbarGroup label="메모">
              <ToolbarButton icon="pencil" label="새로운 메모" disabled />
            </ToolbarGroup>
            <ToolbarSearch ref={search} label="메모 검색" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
          </Toolbar>
        }
      >
        <div className={styles.columns}>
          <nav className={styles.list} aria-label="메모 목록" data-key={active || undefined} onKeyDown={listArrowKeys(order, note.id, select)}>
            <p className={styles.empty} role="status">
              {found.length === 0 && '결과 없음'}
            </p>
            {groupByDate(found, now).map((group) => (
              <section key={group.label} aria-label={group.label}>
                <h2 className={styles.group}>{group.label}</h2>
                <ul className={styles.rows}>
                  {group.notes.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={styles.row}
                        data-value={item.id}
                        aria-current={item.id === note.id || undefined}
                        onClick={() => select(item.id)}
                      >
                        <span className={styles.rowTitle}>{item.title}</span>
                        <span className={styles.rowMeta}>
                          <time dateTime={item.updated}>{listDate(item.updated, now)}</time>
                          <span className={styles.rowPreview}>{previewOf(item)}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          <div key={note.id} className={styles.editor}>
            <NoteBody note={note} />
          </div>
        </div>
      </SplitView>
    </div>
  );
}
