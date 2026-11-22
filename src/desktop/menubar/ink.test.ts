import { describe, expect, it } from 'vitest';
import { inkFor, luminance } from './ink';

describe('menu bar ink', () => {
  it('measures WCAG relative luminance', () => {
    expect(luminance('#000000')).toBe(0);
    expect(luminance('#ffffff')).toBeCloseTo(1);
    expect(luminance('#6898c8')).toBeCloseTo(0.295, 2);
  });

  it('draws dark glyphs only over the pale wallpaper', () => {
    expect(inkFor('wallpapers/glass-light')).toBe('dark');
    expect(inkFor('wallpapers/glass-dark')).toBe('light');
    expect(inkFor('wallpapers/ridge-dawn')).toBe('light');
  });
});
