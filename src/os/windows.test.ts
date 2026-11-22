import { describe, expect, it } from 'vitest';
import { frameOf, reduce, topWindow, type WindowsState } from './windows';

const area = { x: 0, y: 28, w: 1440, h: 780 };
const empty: WindowsState = { windows: [], area };

describe('window manager', () => {
  it('reuses the single window of a singleton app and brings it to the front', () => {
    let s = reduce.open(empty, 'notes');
    s = reduce.open(s, 'terminal');
    s = reduce.open(s, 'notes', { note: 'skills' });
    expect(s.windows.map((w) => w.id)).toEqual(['terminal', 'notes']);
    expect(s.windows[1]!.props).toEqual({ note: 'skills' });
  });

  it('brings one app\'s windows to the front in their own order', () => {
    let s = reduce.open(empty, 'portfolio', { slug: 'mearri' });
    s = reduce.open(s, 'notes');
    s = reduce.open(s, 'portfolio', { slug: 'alarmtalk' });
    s = reduce.open(s, 'terminal');
    expect(reduce.raiseApp(s, 'portfolio').windows.map((w) => w.id)).toEqual(['notes', 'terminal', 'portfolio:mearri', 'portfolio:alarmtalk']);
  });

  it('opens one window per project document', () => {
    let s = reduce.open(empty, 'portfolio', { slug: 'mearri' });
    s = reduce.open(s, 'portfolio', { slug: 'alarmtalk' });
    s = reduce.open(s, 'portfolio', { slug: 'mearri' });
    expect(s.windows.map((w) => w.id)).toEqual(['portfolio:alarmtalk', 'portfolio:mearri']);
  });

  it('cascades new windows and keeps them inside the desktop', () => {
    let s = empty;
    for (const app of ['notes', 'terminal', 'messages', 'mail'] as const) s = reduce.open(s, app);
    const [a, b] = s.windows;
    expect(b!.rect.x - a!.rect.x).toBeGreaterThan(0);
    for (const w of s.windows) {
      expect(w.rect.x + w.rect.w).toBeLessThanOrEqual(area.x + area.w);
      expect(w.rect.y + w.rect.h).toBeLessThanOrEqual(area.y + area.h);
    }
  });

  it('skips minimized and hidden windows when picking the active one', () => {
    let s = reduce.open(empty, 'notes');
    s = reduce.open(s, 'terminal');
    s = reduce.update(s, 'terminal', { minimized: true });
    expect(topWindow(s.windows)?.id).toBe('notes');
    s = reduce.hideApp(s, 'notes');
    expect(topWindow(s.windows)).toBeUndefined();
    expect(topWindow(reduce.showAll(s).windows)?.id).toBe('notes');
  });

  it('zooms and tiles within the desktop area', () => {
    let s = reduce.open(empty, 'notes');
    s = reduce.toggleZoom(s, 'notes');
    const zoomed = frameOf(s.windows[0]!, area);
    expect(zoomed.w).toBeGreaterThan(1400);
    s = reduce.update(s, 'notes', { placement: 'left' });
    const left = frameOf(s.windows[0]!, area);
    expect(left.x + left.w).toBeLessThan(area.w / 2);
  });

  it('quits every window of an app', () => {
    let s = reduce.open(empty, 'portfolio', { slug: 'mearri' });
    s = reduce.open(s, 'portfolio', { slug: 'harucut' });
    s = reduce.open(s, 'notes');
    expect(reduce.quit(s, 'portfolio').windows.map((w) => w.app)).toEqual(['notes']);
  });
});
