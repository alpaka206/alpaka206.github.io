import { describe, expect, it } from 'vitest';
import { PROJECTS } from '@/content/projects';
import type { AppId, AppProps } from './apps';
import { parseRoute, pathFor } from './routes';

type Window = [AppId, Partial<AppProps[AppId]>];

describe('deep links', () => {
  it('round-trips every window a link can describe', () => {
    const windows: Window[] = [
      ...PROJECTS.map((project): Window => ['portfolio', { slug: project.slug }]),
      ['finder', { location: 'projects' }],
      ['finder', { location: 'awards' }],
      ['finder', { location: 'documents' }],
      ['about', {}],
      ['about', { view: 'profile', section: 'career' }],
      ['notes', {}],
      ['notes', { note: 'how-built' }],
      ['settings', { pane: 'wallpaper' }],
      ['preview', {}],
      ['messages', {}],
      ['terminal', {}],
    ];
    for (const [app, props] of windows) {
      expect(parseRoute(pathFor(app, props)), pathFor(app, props)).toEqual({ kind: 'app', app, props });
    }
  });

  it('sends windows without a link of their own to the desktop', () => {
    expect(pathFor('finder', { location: 'recents' })).toBe('/');
    expect(pathFor('safari')).toBe('/');
  });

  it('ignores paths it does not know', () => {
    expect(parseRoute('/')).toBeNull();
    expect(parseRoute('/projects/unknown')).toBeNull();
    expect(parseRoute('/wp-admin')).toBeNull();
  });
});
