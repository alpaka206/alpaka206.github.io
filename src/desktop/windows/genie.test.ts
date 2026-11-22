import { describe, expect, it } from 'vitest';
import { genieKeyframes } from './genie';

const win = { x: 300, y: 120, w: 900, h: 560 };
const icon = { x: 700, y: 830, w: 52, h: 52 };

const parse = (transform: string) => transform.match(/-?\d+(\.\d+)?/g)!.map(Number);

describe('genie minimise', () => {
  const frames = genieKeyframes(win, icon);

  it('starts as the window itself', () => {
    const [tx, ty, sx, sy] = parse(frames[0]!.transform as string);
    expect([tx, ty, sx, sy]).toEqual([0, 0, 1, 1]);
    expect(frames[0]!.clipPath).toMatch(/^polygon\(0px 0px, /);
    expect(frames[0]!.opacity).toBe(1);
  });

  it('ends exactly on the Dock icon, faded out', () => {
    const last = frames.at(-1)!;
    const [tx, ty, sx, sy] = parse(last.transform as string);
    expect(win.x + tx!).toBeCloseTo(icon.x, 0);
    expect(win.y + ty!).toBeCloseTo(icon.y, 0);
    expect(win.w * sx!).toBeCloseTo(icon.w, 0);
    expect(win.h * sy!).toBeCloseTo(icon.h, 0);
    expect(last.opacity).toBe(0);
  });

  it('keeps the same polygon shape in every frame, so the browser can interpolate it', () => {
    const points = frames.map((f) => (f.clipPath as string).split(',').length);
    expect(new Set(points).size).toBe(1);
  });
});
