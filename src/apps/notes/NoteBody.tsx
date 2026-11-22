import { useId } from 'react';
import type { Note } from '@/content/notes';
import { formatNoteDate } from '@/lib/format';
import { NoteLine } from './NoteLine';
import styles from './Notes.module.css';

/** The editor column, read-only: date, title, then headings over bulleted lines. */
export function NoteBody({ note }: { note: Note }) {
  const titleId = useId();
  return (
    <article className={styles.note} aria-labelledby={titleId}>
      <p className={styles.noteDate}>{formatNoteDate(note.updated)}</p>
      <h1 id={titleId} className={styles.noteTitle}>
        {note.title}
      </h1>
      {note.sections.map((section, i) => (
        <section key={section.heading ?? i}>
          {section.heading && <h2 className={styles.noteHeading}>{section.heading}</h2>}
          <ul className={styles.noteLines}>
            {section.lines.map((line) => (
              <li key={line}>
                <NoteLine text={line} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
