import { describe, expect, it } from 'vitest';
import { initialsOf, search } from './search';

describe('Spotlight search', () => {
  it('extracts Korean initial consonants', () => {
    expect(initialsOf('메아리 자막')).toBe('ㅁㅇㄹㅈㅁ');
    expect(initialsOf('React 19')).toBe('react19');
  });

  it('finds a project by name, by tag and by 초성', () => {
    expect(search('mearri')[0]?.id).toBe('project:mearri');
    expect(search('하루컷')[0]?.id).toBe('project:harucut');
    expect(search('ㅎㄹㅋ').map((r) => r.id)).toContain('project:harucut');
    // Latin titles are found by their Korean names too.
    expect(search('ㅁㅇㄹ')[0]?.id).toBe('project:mearri');
    expect(search('puppeteer').map((r) => r.id)).toContain('project:global-web-qa');
  });

  it('puts projects before single skill lines', () => {
    expect(search('자동화')[0]?.kind).toBe('project');
  });

  it('ignores spaces so 세일즈자동화 matches the spaced title', () => {
    expect(search('세일즈자동화').map((r) => r.id)).toContain('project:sales-automation');
  });

  it('surfaces actions like writing an email', () => {
    expect(search('메일')[0]?.kind).toMatch(/app|action/);
    expect(search('연락').map((r) => r.id)).toContain('action:mail');
  });

  it('returns nothing for an empty query', () => {
    expect(search('   ')).toEqual([]);
  });
});
