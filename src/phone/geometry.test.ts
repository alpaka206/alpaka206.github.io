import { describe, expect, it } from 'vitest';
import { frameFor, isOnScreen, lerpRect } from './geometry';

const W = 402;
const H = 874;

describe('frameFor', () => {
  it('leaves a full-screen rect untouched', () => {
    const frame = frameFor({ x: 0, y: 0, w: W, h: H, r: 62 }, W, H);
    expect(frame.scale).toBe(1);
    expect(frame.top).toBe(0);
    expect(frame.height).toBe(H);
    expect(frame.transform).toBe('translate3d(0px, 0px, 0) scale(1)');
  });

  it('shows the middle square of the layer inside an app icon', () => {
    // The first Home Screen icon on a 402 pt iPhone (iOS 27 kit): 64 pt at (30, 90).
    const frame = frameFor({ x: 30, y: 90, w: 64, h: 64, r: 16 }, W, H);
    expect(frame.scale).toBeCloseTo(64 / W);
    expect(frame.height).toBeCloseTo(W);
    expect(frame.top).toBeCloseTo((H - W) / 2);
    // Translated so that the visible band's top edge lands on the icon's top edge.
    expect(frame.transform).toBe(`translate3d(30px, ${90 - frame.top * frame.scale}px, 0) scale(${frame.scale})`);
    // Corner radius is given in screen pixels, so it is divided by the scale.
    expect(frame.clipPath).toContain(`round ${16 / frame.scale}px`);
  });
});

describe('lerpRect', () => {
  it('interpolates every edge and the radius', () => {
    const a = { x: 0, y: 0, w: 10, h: 10, r: 2 };
    const b = { x: 10, y: 20, w: 30, h: 50, r: 6 };
    expect(lerpRect(a, b, 0.5)).toEqual({ x: 5, y: 10, w: 20, h: 30, r: 4 });
  });
});

describe('isOnScreen', () => {
  it('rejects icons on another Home Screen page', () => {
    expect(isOnScreen({ x: 30 + W, y: 90, w: 64, h: 64, r: 16 }, W, H)).toBe(false);
    expect(isOnScreen({ x: 30, y: 90, w: 64, h: 64, r: 16 }, W, H)).toBe(true);
  });
});
