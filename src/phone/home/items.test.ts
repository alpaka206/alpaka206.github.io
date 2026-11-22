import { describe, expect, it } from 'vitest';
import { DOCK_ITEMS, folderOf, HOME_ITEMS, launchKey, moveTo, paginate, rowsThatFit, WIDGETS, type Slot } from './items';

const icons: Slot[] = HOME_ITEMS.map((item) => ({ kind: 'item', item }));

describe('paginate', () => {
  it('fits two medium widgets and eight icons on a six-row page', () => {
    const pages = paginate([...WIDGETS, ...icons], 6);
    expect(pages).toHaveLength(2);
    expect(pages[0]).toHaveLength(2 + 8);
    expect(pages[1]).toHaveLength(HOME_ITEMS.length - 8);
  });

  it('starts a widget on a fresh row and moves it to the next page when it does not fit', () => {
    const pages = paginate([icons[0]!, ...WIDGETS], 4);
    expect(pages.map((page) => page.length)).toEqual([2, 1]);
  });
});

describe('launch keys', () => {
  it('match the tile ids, so a closing app finds its icon', () => {
    const ids = new Set([...HOME_ITEMS, ...DOCK_ITEMS].flatMap((item) => (item.kind === 'folder' ? item.apps.map((a) => a.id) : [item.id])));
    expect(ids.has(launchKey('finder'))).toBe(true);
    expect(ids.has(launchKey('finder', { location: 'awards' }))).toBe(true);
    expect(ids.has(launchKey('portfolio', { slug: 'mearri' }))).toBe(true);
    expect(ids.has(launchKey('about'))).toBe(true);
  });

  it('know which folder holds a project', () => {
    expect(folderOf(launchKey('portfolio', { slug: 'mearri' }))).toBe('folder:estsoft');
    expect(folderOf(launchKey('portfolio', { slug: 'harucut' }))).toBeUndefined();
  });
});

describe('rowsThatFit', () => {
  it('gives the kit six rows on 402 × 874 and 393 × 852', () => {
    // Grid top to search pill: 704 − 90 on 402 pt (64 pt icons), 686 − 87 on 393 pt (60 pt icons).
    expect(rowsThatFit(704 - 90, 100.33, 64 + 19)).toBe(6);
    expect(rowsThatFit(686 - 87, 98, 60 + 19)).toBe(6);
  });

  it('drops rows on a short browser viewport', () => {
    expect(rowsThatFit(400, 98, 79)).toBe(4);
  });
});

describe('moveTo', () => {
  it('moves forward and backward like a drag in jiggle mode', () => {
    expect(moveTo(['a', 'b', 'c', 'd'], 'a', 'c')).toEqual(['b', 'c', 'a', 'd']);
    expect(moveTo(['a', 'b', 'c', 'd'], 'd', 'b')).toEqual(['a', 'd', 'b', 'c']);
  });
});
