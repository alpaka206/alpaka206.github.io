import { describe, expect, it } from 'vitest';
import { centred, clampToScreen, resizeRect, restoreUnderPointer, tileZone } from './geometry';

const area = { x: 0, y: 30, w: 1440, h: 782 };

describe('window dragging', () => {
  it('keeps the title bar below the menu bar and part of the window on screen', () => {
    expect(clampToScreen({ x: 100, y: -40, w: 800, h: 500 }, area, 1440).y).toBe(30);
    expect(clampToScreen({ x: -2000, y: 100, w: 800, h: 500 }, area, 1440).x).toBe(96 - 800);
    expect(clampToScreen({ x: 3000, y: 100, w: 800, h: 500 }, area, 1440).x).toBe(1440 - 96);
    expect(clampToScreen({ x: 10, y: 2000, w: 800, h: 500 }, area, 1440).y).toBe(30 + 782 - 32);
  });

  it('tiles at the screen edges', () => {
    expect(tileZone({ x: 600, y: 20 }, area, 1440)).toBe('zoomed');
    expect(tileZone({ x: 0, y: 400 }, area, 1440)).toBe('left');
    expect(tileZone({ x: 1439, y: 400 }, area, 1440)).toBe('right');
    expect(tileZone({ x: 600, y: 400 }, area, 1440)).toBeNull();
  });

  it('restores a zoomed window under the pointer at the same share of its width', () => {
    const frame = { x: 6, y: 36, w: 1428, h: 770 };
    const out = restoreUnderPointer(frame, { x: 300, y: 200, w: 714, h: 500 }, { x: 720, y: 50 });
    expect(out.w).toBe(714);
    expect((720 - out.x) / out.w).toBeCloseTo((720 - frame.x) / frame.w, 2);
    expect(out.y).toBe(frame.y);
  });
});

describe('window resizing', () => {
  const start = { x: 200, y: 100, w: 800, h: 500 };
  const min = { w: 560, h: 320 };

  it('moves only the dragged edges', () => {
    expect(resizeRect(start, { right: true, bottom: true }, 40, 30, min, area)).toEqual({ x: 200, y: 100, w: 840, h: 530 });
    expect(resizeRect(start, { left: true }, 50, 0, min, area)).toEqual({ x: 250, y: 100, w: 750, h: 500 });
  });

  it('respects the app’s minimum size and keeps the opposite edge fixed', () => {
    const out = resizeRect(start, { left: true, top: true }, 600, 400, min, area);
    expect(out).toEqual({ x: 200 + 800 - 560, y: 100 + 500 - 320, w: 560, h: 320 });
  });

  it('never pulls the top edge under the menu bar', () => {
    const out = resizeRect(start, { top: true }, 0, -500, min, area);
    expect(out.y).toBe(30);
    expect(out.y + out.h).toBe(600);
  });

  it('centres a window a third of the way down', () => {
    expect(centred({ x: 0, y: 0, w: 840, h: 482 }, area)).toEqual({ x: 300, y: 130, w: 840, h: 482 });
  });
});
