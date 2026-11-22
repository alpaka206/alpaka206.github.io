import { useId } from 'react';
import type { Note } from '@/content/notes';
import { formatNoteDate } from '@/lib/format';
import { linkOf } from './noteList';
import styles from './Notes.module.css';

/** A line, or a link when it is nothing but a web address. */
function Line({ text }: { text: string }) {
  const href = linkOf(text);
  return href ? (
    <a href={href} target="_blank" rel="noreferrer">
      {text}
    </a>
  ) : (
    text
  );
}

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
                <Line text={line} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
