import { describe, expect, it } from 'vitest';
import { matches, parseShortcut, shortcutParts } from './shortcuts';

const key = (code: string, mods: Partial<Record<'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey', boolean>> = {}) => ({
  code,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  ...mods,
});

describe('shortcuts', () => {
  it('parses macOS menu notation', () => {
    expect(parseShortcut('⌥⌘H')).toEqual({ ctrl: false, alt: true, shift: false, meta: true, code: 'KeyH' });
    expect(parseShortcut('⇧⌘⌫').code).toBe('Backspace');
    expect(parseShortcut('⌘[').code).toBe('BracketLeft');
    expect(parseShortcut('⌃⌘F')).toMatchObject({ ctrl: true, meta: true, code: 'KeyF' });
  });

  it('matches on the physical key, whatever the input source', () => {
    // ⌘W typed while the Korean input source is active still reports code KeyW.
    expect(matches(key('KeyW', { metaKey: true }), '⌘W')).toBe(true);
    expect(matches(key('KeyW', { metaKey: true, shiftKey: true }), '⌘W')).toBe(false);
    expect(matches(key('ArrowDown', { metaKey: true }), '⌘↓')).toBe(true);
  });

  it('splits glyphs for menu rendering', () => {
    expect(shortcutParts('⌥⌘H')).toEqual(['⌥', '⌘', 'H']);
    expect(shortcutParts('⌘,')).toEqual(['⌘', ',']);
  });
});
