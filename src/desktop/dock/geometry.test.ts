import { describe, expect, it } from 'vitest';
import { dockMetrics, falloff, fitTile, layoutSlots, magnify, shelfWidth } from './geometry';

const m = dockMetrics(64);
const slots = layoutSlots(['tile', 'tile', 'tile', 'tile', 'tile', 'divider', 'tile', 'tile'], m);
const centre = (i: number) => slots[i]!.start + slots[i]!.size / 2;

describe('Dock metrics', () => {
  it('reproduces the measured 64 pt Dock', () => {
    expect(m.icon).toBeCloseTo(51.5, 1);
    expect(m.tile + m.gap).toBeCloseTo(67.6, 1);
    expect(m.padTop + (m.tile - m.icon) / 2).toBeCloseTo(15.75, 1);
    expect(m.padX + (m.tile - m.icon) / 2).toBeCloseTo(16, 0);
    expect(m.height).toBeCloseTo(82.5, 1);
    expect(m.magnified).toBe(128);
  });

  it('shrinks the tiles until the shelf fits the screen', () => {
    expect(fitTile(64, 16, 2, 1440)).toBe(64);
    const tile = fitTile(128, 16, 2, 1440);
    expect(tile).toBeLessThan(128);
    const fitted = layoutSlots([...Array(16).fill('tile'), 'divider', 'divider'], dockMetrics(tile));
    expect(shelfWidth(fitted, dockMetrics(tile))).toBeLessThanOrEqual(1440 - 16);
  });
});

describe('magnification', () => {
  it('falls off smoothly to nothing three tiles away', () => {
    expect(falloff(0, 100)).toBe(1);
    expect(falloff(50, 100)).toBeCloseTo(0.5);
    expect(falloff(100, 100)).toBe(0);
    expect(falloff(-30, 100)).toBe(falloff(30, 100));
  });

  it('changes nothing while the pointer is away', () => {
    const out = magnify(slots, centre(2), 0, m);
    expect(out.offsets.every((o) => Math.abs(o) < 1e-9)).toBe(true);
    expect(out.left).toBeCloseTo(0);
    expect(out.right).toBeCloseTo(shelfWidth(slots, m));
  });

  it('grows the icon under the pointer to the full size and keeps it under the pointer', () => {
    const out = magnify(slots, centre(2), 1, m);
    expect(out.sizes[2]).toBeCloseTo(128);
    expect(out.offsets[2]).toBeCloseTo(0);
    expect(out.sizes[1]).toBeCloseTo(out.sizes[3]!);
    expect(out.sizes[1]!).toBeLessThan(128);
    expect(out.sizes[5]).toBe(m.divider);
  });

  it('keeps the point under the pointer fixed anywhere inside an icon', () => {
    const p = slots[1]!.start + 10;
    const out = magnify(slots, p, 1, m);
    const start = centre(1) + out.offsets[1]! - out.sizes[1]! / 2;
    expect(start + (10 / m.tile) * out.sizes[1]!).toBeCloseTo(p);
  });

  it('never lets items overlap and widens the shelf by the extra size', () => {
    for (const p of [-40, 5, centre(0), centre(4) + 20, centre(5), centre(7), 900]) {
      const out = magnify(slots, p, 1, m);
      for (let i = 1; i < slots.length; i++) {
        const prevEnd = centre(i - 1) + out.offsets[i - 1]! + out.sizes[i - 1]! / 2;
        const start = centre(i) + out.offsets[i]! - out.sizes[i]! / 2;
        expect(start - prevEnd).toBeCloseTo(m.gap);
      }
      const extra = out.sizes.reduce((sum, size, i) => sum + size - slots[i]!.size, 0);
      expect(out.right - out.left).toBeCloseTo(shelfWidth(slots, m) + extra);
    }
  });
});
