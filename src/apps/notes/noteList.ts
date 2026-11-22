import type { Note } from '@/content/notes';
import { formatTime } from '@/lib/format';
import { matchesAny } from '@/os/search';

/**
 * The middle column of Notes: newest first, grouped the way Notes groups them
 * (오늘, 어제, 이전 7일, 이전 30일, then months and years), each row dated
 * relative to now. Pure, so the grouping is tested without a clock.
 */

const DAY = 24 * 60 * 60 * 1000;

/** Calendar days between two dates in local time (0 = same day). */
function daysBefore(date: Date, now: Date) {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((start(now) - start(date)) / DAY);
}

export const newestFirst = (notes: readonly Note[]) =>
  notes.toSorted((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime());

export function groupLabel(iso: string, now: Date): string {
  const date = new Date(iso);
  const days = daysBefore(date, now);
  if (days <= 0) return '오늘';
  if (days === 1) return '어제';
  if (days <= 7) return '이전 7일';
  if (days <= 30) return '이전 30일';
  if (date.getFullYear() === now.getFullYear()) return `${date.getMonth() + 1}월`;
  return `${date.getFullYear()}년`;
}

/** Newest first, the labels only ever get older, so each one is a single run. */
export const groupByDate = (notes: readonly Note[], now: Date) =>
  [...Map.groupBy(newestFirst(notes), (note) => groupLabel(note.updated, now))].map(([label, notes]) => ({ label, notes }));

const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'long' });
const short = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });

/** "오전 1:30" today, "어제", a weekday within the week, otherwise "2026. 11. 15.". */
export function listDate(iso: string, now: Date): string {
  const date = new Date(iso);
  const days = daysBefore(date, now);
  if (days <= 0) return formatTime(date);
  if (days === 1) return '어제';
  if (days < 7) return weekday.format(date);
  return short.format(date);
}

/** The first line of the body, shown after the date. */
export const previewOf = (note: Note) => note.sections.flatMap((section) => section.lines)[0] ?? '';

export const matchesNote = (note: Note, query: string) =>
  matchesAny(query, [note.title, ...note.sections.flatMap((section) => [section.heading ?? '', ...section.lines])]);
