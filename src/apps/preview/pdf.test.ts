import { describe, expect, it } from 'vitest';
import manifest from '@/media/manifest.json';
import { clampPage, MAX_SCALE, MIN_SCALE, PAGE_COUNT, pageKey, pageLabel, zoomed } from './pdf';

describe('Preview pages', () => {
  it('has an image for every page', () => {
    for (let page = 1; page <= PAGE_COUNT; page++) expect(manifest).toHaveProperty([pageKey(page)]);
  });

  it('keeps page numbers inside the document', () => {
    expect(clampPage(0)).toBe(1);
    expect(clampPage(7.4)).toBe(7);
    expect(clampPage(99)).toBe(PAGE_COUNT);
    expect(clampPage(Number.NaN)).toBe(1);
  });

  it('zooms in steps of 2^(1/4) like PDFView, within its limits', () => {
    expect(zoomed(1, 1)).toBeCloseTo(1.1892, 4);
    expect(zoomed(1, 4)).toBeCloseTo(2, 6);
    expect(zoomed(1, -2)).toBeCloseTo(0.7071, 4);
    expect(zoomed(MAX_SCALE, 1)).toBe(MAX_SCALE);
    expect(zoomed(MIN_SCALE, -1)).toBe(MIN_SCALE);
  });

  it('labels the page the way Korean Preview does', () => {
    expect(pageLabel(1)).toBe('1/20페이지');
  });
});
