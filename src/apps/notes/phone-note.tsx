import type { ReactNode } from 'react';
import type { Note } from '@/content/notes';
import { formatNoteDate } from '@/lib/format';
import { NavScreen } from '@/phone/kit';
import { linkOf } from './noteList';
import styles from './notes.phone.module.css';

/**
 * One note: its date and title (the bar shows the title only once this has
 * scrolled away, as in iOS Notes), then each section's heading and lines.
 */
export function NoteDetail({ note, leading }: { note: Note; leading?: ReactNode }) {
  return (
    <NavScreen
      title={note.title}
      large={false}
      background="plain"
      leading={leading}
      hero={
        <header className={styles.head}>
          <p className={styles.date}>{formatNoteDate(note.updated)}</p>
          <p className={styles.title} aria-hidden="true">
            {note.title}
          </p>
        </header>
      }
    >
      <article className={styles.note}>
        {note.sections.map((section, index) => (
          <section key={section.heading ?? index} className={styles.section}>
            {section.heading && <h2 className={styles.heading}>{section.heading}</h2>}
            {section.lines.map((line) => {
              const href = linkOf(line);
              return (
                <p key={line} className={styles.line}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer">
                      {line}
                    </a>
                  ) : (
                    line
                  )}
                </p>
              );
            })}
          </section>
        ))}
      </article>
    </NavScreen>
  );
}
