/** Locale-aware dates and times, formatted the way Korean macOS and iOS show them. */
const ko = 'ko-KR';

const menuDate = new Intl.DateTimeFormat(ko, { month: 'long', day: 'numeric', weekday: 'short' });
const menuTime = new Intl.DateTimeFormat(ko, { hour: 'numeric', minute: '2-digit' });
const longDate = new Intl.DateTimeFormat(ko, { month: 'long', day: 'numeric', weekday: 'long' });
const shortTime = new Intl.DateTimeFormat(ko, { hour: 'numeric', minute: '2-digit', hour12: true });
const noteDate = new Intl.DateTimeFormat(ko, { dateStyle: 'long', timeStyle: 'short' });

/** "11월 22일 (일) 오전 1:44" for the menu bar. */
export const formatMenuClock = (date: Date) => `${menuDate.format(date)} ${menuTime.format(date)}`;

/** "11월 22일 일요일" above the lock screen clock. */
export const formatLongDate = (date: Date) => longDate.format(date);

/** "1:44" on the lock screen: 12-hour clock without the day period. */
export const formatClock = (date: Date) =>
  shortTime
    .formatToParts(date)
    .filter((part) => part.type === 'hour' || part.type === 'minute' || part.type === 'literal')
    .map((part) => part.value)
    .join('')
    .trim();

/** "오전 1:44" for notifications and message timestamps. */
export const formatTime = (date: Date) => menuTime.format(date);

/** "2026년 11월 22일 오전 1:30" at the top of a note. */
export const formatNoteDate = (iso: string) => noteDate.format(new Date(iso));
