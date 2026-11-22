import { describe, expect, it } from 'vitest';
import type { Rect } from '@/os/windows';
import { overviewLayout } from './overview';

const bounds: Rect = { x: 0, y: 30, w: 1440, h: 780 };
const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('Mission Control layout', () => {
  const frames = [
    { id: 'a', rect: { x: 100, y: 80, w: 920, h: 560 } },
    { id: 'b', rect: { x: 140, y: 120, w: 1040, h: 720 } },
    { id: 'c', rect: { x: 600, y: 100, w: 760, h: 480 } },
    { id: 'd', rect: { x: 300, y: 300, w: 640, h: 560 } },
    { id: 'e', rect: { x: 0, y: 40, w: 1120, h: 740 } },
  ];

  it('places every window inside the screen without overlap', () => {
    const out = overviewLayout(frames, bounds);
    const rects = frames.map((f) => out[f.id]!);
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(bounds.x);
      expect(r.y).toBeGreaterThanOrEqual(bounds.y);
      expect(r.x + r.w).toBeLessThanOrEqual(bounds.x + bounds.w + 1e-6);
      expect(r.y + r.h).toBeLessThanOrEqual(bounds.y + bounds.h + 1e-6);
    }
    for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) expect(overlaps(rects[i]!, rects[j]!)).toBe(false);
  });

  it('keeps each window’s proportions with one shared scale', () => {
    const out = overviewLayout(frames, bounds);
    const scales = frames.map((f) => out[f.id]!.w / f.rect.w);
    for (const f of frames) expect(out[f.id]!.h / f.rect.h).toBeCloseTo(out[f.id]!.w / f.rect.w);
    for (const s of scales) expect(s).toBeCloseTo(scales[0]!);
  });

  it('centres a lone window and still shrinks it a little', () => {
    const out = overviewLayout([{ id: 'a', rect: { x: 0, y: 30, w: 800, h: 600 } }], bounds);
    const r = out.a!;
    expect(r.w).toBeLessThan(800);
    expect(r.x + r.w / 2).toBeCloseTo(bounds.x + bounds.w / 2);
  });
});
