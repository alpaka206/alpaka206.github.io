import { describe, expect, it } from 'vitest';
import { NOTES } from '@/content/notes';
import { groupByDate, groupLabel, listDate, matchesNote, newestFirst, previewOf } from './noteList';

const note = (id: string) => NOTES.find((n) => n.id === id)!;
// Local time, the way a visitor's clock would read it.
const now = new Date(2026, 10, 22, 9, 0);

describe('Notes list', () => {
  it('sorts newest first and keeps the order of notes saved together', () => {
    expect(newestFirst(NOTES).map((n) => n.id)).toEqual(['how-built', 'shortcuts', 'skills', 'education']);
  });

  it('groups by the same buckets as Notes', () => {
    expect(groupLabel(new Date(2026, 10, 22, 1).toISOString(), now)).toBe('오늘');
    expect(groupLabel(new Date(2026, 10, 21, 23).toISOString(), now)).toBe('어제');
    expect(groupLabel(new Date(2026, 10, 15, 18).toISOString(), now)).toBe('이전 7일');
    expect(groupLabel(new Date(2026, 10, 14).toISOString(), now)).toBe('이전 30일');
    expect(groupLabel(new Date(2026, 9, 23).toISOString(), now)).toBe('이전 30일');
    expect(groupLabel(new Date(2026, 3, 1).toISOString(), now)).toBe('4월');
    expect(groupLabel(new Date(2025, 3, 1).toISOString(), now)).toBe('2025년');
  });

  it('builds consecutive groups', () => {
    const groups = groupByDate([note('skills'), note('how-built')], new Date(2026, 10, 30));
    expect(groups.map((g) => [g.label, g.notes.length])).toEqual([['이전 30일', 2]]);
  });

  it('dates rows relative to today', () => {
    expect(listDate(new Date(2026, 10, 22, 1, 30).toISOString(), now)).toBe('오전 1:30');
    expect(listDate(new Date(2026, 10, 21, 1, 30).toISOString(), now)).toBe('어제');
    expect(listDate(new Date(2026, 10, 18).toISOString(), now)).toBe('수요일');
    expect(listDate(new Date(2026, 9, 2).toISOString(), now)).toBe('2026. 10. 2.');
  });

  it('previews the first line and searches titles and bodies, spaces ignored', () => {
    expect(previewOf(note('how-built'))).toMatch(/^React 19, TypeScript, Vite/);
    expect(matchesNote(note('skills'), 'react query')).toBe(true);
    expect(matchesNote(note('skills'), '가톨릭')).toBe(false);
    expect(matchesNote(note('education'), '가톨릭')).toBe(true);
  });
});
