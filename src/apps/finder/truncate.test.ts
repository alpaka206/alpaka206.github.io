import { describe, expect, it } from 'vitest';
import { extensionOf, iconLabelLines, middleTruncate } from './truncate';

// Every character is 6 units wide, the ellipsis too: easy to reason about.
const measure = (text: string) => Array.from(text).length * 6;

describe('extensionOf', () => {
  it('finds short extensions only', () => {
    expect(extensionOf('김규원_포트폴리오.pdf')).toBe('.pdf');
    expect(extensionOf('README.md')).toBe('.md');
    expect(extensionOf('Next.js 프로젝트')).toBe('');
    expect(extensionOf('.gitignore')).toBe('');
    expect(extensionOf('AlarmTalk / 알람톡')).toBe('');
  });
});

describe('middleTruncate', () => {
  it('leaves text that fits alone', () => {
    expect(middleTruncate('Mearri', 60, measure)).toBe('Mearri');
  });

  it('cuts the middle and keeps both ends', () => {
    const out = middleTruncate('abcdefghijklmnop', 60, measure);
    expect(out).toBe('abcde…mnop');
    expect(measure(out)).toBeLessThanOrEqual(60);
  });

  it('always keeps the whole extension', () => {
    const out = middleTruncate('수상_증명서_스캔본_최종본.webp', 48, measure, '.webp');
    expect(out.endsWith('.webp')).toBe(true);
    expect(measure(out)).toBeLessThanOrEqual(48);
  });
});

describe('iconLabelLines', () => {
  it('uses one line when the name fits', () => {
    expect(iconLabelLines('README.md', 114, measure)).toEqual(['README.md']);
  });

  it('wraps at a word boundary', () => {
    expect(iconLabelLines('Premiere Pro Plugin', 72, measure)).toEqual(['Premiere Pro', 'Plugin']);
  });

  it('middle-truncates the second line and keeps the extension', () => {
    const lines = iconLabelLines('하나 소셜벤처 유니버시티 이수 및 우수팀 선정.webp', 84, measure);
    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe('하나 소셜벤처 유니버시티');
    expect(lines[1]).toContain('…');
    expect(lines[1]!.endsWith('.webp')).toBe(true);
    expect(lines.every((line) => measure(line) <= 84)).toBe(true);
  });

  it('never starts a line with the extension', () => {
    expect(iconLabelLines('창업경진대회 장려상.webp', 72, measure)).toEqual(['창업경진대회', '장려상.webp']);
  });

  it('breaks inside a word that has no boundary', () => {
    const lines = iconLabelLines('가나다라마바사아자차카타파하', 48, measure);
    expect(lines[0]).toBe('가나다라마바사아');
    expect(lines[1]).toBe('자차카타파하');
  });
});
