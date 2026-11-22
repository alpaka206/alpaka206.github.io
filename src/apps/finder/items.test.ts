import { describe, expect, it } from 'vitest';
import { PROJECTS } from '@/content/projects';
import { back, forward, go, start } from './history';
import { columnRoots, listing, periodStart, placeItems, sortItems, statusText, TAGS, tagsOf } from './items';

describe('Finder places', () => {
  it('lists every case study except the current company, grouped by company', () => {
    const list = listing('projects');
    expect(list.items).toHaveLength(PROJECTS.length - 1);
    expect(list.items.some((item) => item.id === 'project:eastaid')).toBe(false);
    expect(list.groups?.map((g) => g.title)).toEqual([
      '이스트소프트',
      '운영 중인 서비스',
      '펑타이그레이터차이나',
      '팀, 외주, 개인 프로젝트',
    ]);
    expect(list.groups?.flatMap((g) => g.items)).toEqual(list.items);
  });

  it('shows the desktop icons, the documents and one item in the trash', () => {
    expect(placeItems('desktop').map((i) => i.name)).toEqual(['README.md', '김규원_포트폴리오.pdf', '프로젝트', '수상']);
    expect(placeItems('documents')[0]?.name).toBe('김규원_포트폴리오.pdf');
    expect(placeItems('documents').every((i) => i.type === 'pdf' || i.type === 'note')).toBe(true);
    expect(placeItems('trash').map((i) => i.name)).toEqual(['이전 포트폴리오 (Windows)']);
  });

  it('lists every app but the portfolio viewer', () => {
    const apps = placeItems('applications');
    expect(apps.some((i) => i.type === 'app' && i.app === 'portfolio')).toBe(false);
    expect(apps.some((i) => i.type === 'app' && i.app === 'finder')).toBe(true);
  });

  it('falls back to the featured projects until something is opened', () => {
    expect(placeItems('recents').length).toBeGreaterThan(0);
    expect(placeItems('recents', [{ type: 'pdf' }, { type: 'project', slug: 'mearri' }]).map((i) => i.id)).toEqual([
      'pdf',
      'project:mearri',
    ]);
  });

  it('gives every tag at least one project and filters by it', () => {
    for (const tag of TAGS) {
      const items = placeItems(`tag:${tag.id}`);
      expect(items.length, tag.label).toBeGreaterThan(0);
      expect(items.every((i) => i.type === 'project' && tagsOf(i.project).includes(tag))).toBe(true);
    }
  });

  it('searches names, tags and keywords and drops empty groups', () => {
    const list = listing('projects', 'puppeteer');
    expect(list.items.map((i) => i.id)).toEqual(['project:global-web-qa']);
    expect(list.groups).toHaveLength(1);
    expect(listing('projects', '하루 컷').items.map((i) => i.id)).toEqual(['project:harucut']);
  });

  it('turns companies into folders for the column view', () => {
    const roots = columnRoots(listing('projects'));
    expect(roots.every((r) => r.type === 'folder' && r.children.length > 0)).toBe(true);
  });
});

describe('sorting', () => {
  it('reads the start of a period', () => {
    expect(periodStart('2024.07 - 현재')).toBe(20240700);
    expect(periodStart('2019.10.05')).toBe(20191005);
    expect(periodStart(undefined)).toBe(Number.POSITIVE_INFINITY);
  });

  it('sorts by period with missing values last, both ways', () => {
    const items = listing('projects').items;
    const up = sortItems(items, { key: 'period', ascending: true }).map((i) => i.period);
    expect(periodStart(up[0])).toBeLessThanOrEqual(periodStart(up[1]));
    const down = sortItems(items, { key: 'name', ascending: false });
    expect(down[0]!.name.localeCompare(down.at(-1)!.name, 'ko')).toBeGreaterThan(0);
  });
});

describe('history and status', () => {
  it('goes back and forward like Finder', () => {
    let h = go(go(start('recents'), 'projects'), 'awards');
    h = back(h);
    expect(h.current).toBe('projects');
    h = forward(h);
    expect(h.current).toBe('awards');
    h = go(back(h), 'documents');
    expect(h.forward).toEqual([]);
    expect(go(h, 'documents')).toBe(h);
  });

  it('uses Finder status bar wording', () => {
    expect(statusText(11, 0)).toBe('11개의 항목');
    expect(statusText(11, 2)).toBe('2/11 선택됨');
  });
});
