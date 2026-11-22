import { describe, expect, it } from 'vitest';
import { FAVORITES, hostOf, siteFor, titleFor, toAddress } from './sites';
import { activeTab, currentPage, initialTabs, reduceTabs, type TabAction, type Tabs } from './tabs';

describe('address field', () => {
  it('opens anything that looks like a web address', () => {
    expect(toAddress('alarm-talk.com')).toBe('https://alarm-talk.com/');
    expect(toAddress('  https://mearri.com/pricing ')).toBe('https://mearri.com/pricing');
    expect(toAddress('alpaka206.vercel.app/posts')).toBe('https://alpaka206.vercel.app/posts');
  });

  it('searches Google for everything else, in a frame-friendly form', () => {
    expect(toAddress('김규원 포트폴리오')).toBe('https://www.google.com/search?igu=1&q=%EA%B9%80%EA%B7%9C%EC%9B%90%20%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4');
    expect(toAddress('google.com')).toBe('https://google.com/?igu=1');
    expect(toAddress('   ')).toBeNull();
  });

  it('names tabs after favourites, searches and hosts', () => {
    expect(titleFor('https://www.harucut.com/')).toBe('하루컷');
    expect(titleFor(toAddress('react 19')!)).toBe('react 19 - Google 검색');
    expect(titleFor('https://example.com/a')).toBe('example.com');
  });
});

describe('favourites', () => {
  it('link the live services listed in content', () => {
    expect(FAVORITES.map((site) => hostOf(site.href))).toEqual([
      'alpaka206.vercel.app',
      'github.com',
      'alarm-talk.com',
      'mearri.com',
      'harucut.com',
      'comatching.site',
    ]);
  });

  it('frames only the sites that allow it, and screenshot the rest', () => {
    expect(siteFor('https://alarm-talk.com/')?.frameable).toBe(true);
    expect(siteFor('https://harucut.com/')).toMatchObject({ frameable: false, screenshot: 'screens/harucut' });
    expect(siteFor('https://github.com/alpaka206')?.frameable).toBe(false);
    expect(siteFor('https://example.com/')).toBeUndefined();
  });
});

describe('tabs', () => {
  const run = (...actions: TabAction[]) => actions.reduce<Tabs>(reduceTabs, initialTabs());
  const web = (url: string) => ({ kind: 'web' as const, url });

  it('keeps a back and forward list per tab, dropping forward history on a new visit', () => {
    const state = run({ type: 'go', page: web('https://a.com/') }, { type: 'go', page: web('https://b.com/') }, { type: 'back' });
    expect(currentPage(activeTab(state))).toEqual(web('https://a.com/'));
    const branched = reduceTabs(state, { type: 'go', page: web('https://c.com/') });
    expect(activeTab(branched).history.map((p) => (p.kind === 'web' ? p.url : 'start'))).toEqual(['start', 'https://a.com/', 'https://c.com/']);
    expect(reduceTabs(branched, { type: 'forward' })).toEqual(branched);
  });

  it('opens new tabs at the end and selects the neighbour when one closes', () => {
    const state = run({ type: 'new' }, { type: 'new' }, { type: 'select', id: 2 }, { type: 'close', id: 2 });
    expect(state.tabs.map((t) => t.id)).toEqual([1, 3]);
    expect(state.active).toBe(3);
  });

  it('replaces the last tab with a start page instead of closing the window', () => {
    const state = run({ type: 'go', page: web('https://a.com/') }, { type: 'close', id: 1 });
    expect(state.tabs).toHaveLength(1);
    expect(currentPage(activeTab(state))).toEqual({ kind: 'start' });
  });
});
