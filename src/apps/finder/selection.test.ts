import { describe, expect, it } from 'vitest';
import type { Rect } from '@/os/windows';
import { click, moveTo, neighbor, NONE, only, selectAll } from './selection';

const order = ['a', 'b', 'c', 'd', 'e'];

describe('selection', () => {
  it('selects one item on a plain click', () => {
    expect(click(NONE, order, 'c', {})).toEqual(only('c'));
  });

  it('toggles with ⌘ and keeps the rest', () => {
    let s = click(NONE, order, 'a', {});
    s = click(s, order, 'c', { meta: true });
    expect(s.ids).toEqual(['a', 'c']);
    s = click(s, order, 'a', { meta: true });
    expect(s.ids).toEqual(['c']);
  });

  it('extends a range from the anchor with ⇧, in either direction', () => {
    let s = click(NONE, order, 'b', {});
    s = click(s, order, 'd', { shift: true });
    expect(s.ids).toEqual(['b', 'c', 'd']);
    s = click(s, order, 'a', { shift: true });
    expect(s.ids).toEqual(['a', 'b']);
    expect(s.anchor).toBe('b');
  });

  it('moves and extends with the keyboard', () => {
    const s = moveTo(only('b'), order, 'c', true);
    expect(s.ids).toEqual(['b', 'c']);
    expect(moveTo(s, order, 'e', false)).toEqual(only('e'));
  });

  it('selects everything', () => {
    expect(selectAll(order).ids).toEqual(order);
  });
});

describe('neighbor', () => {
  // Two rows of three 100-wide cells, then a group header, then one more row of two.
  const cell = (x: number, y: number): Rect => ({ x, y, w: 100, h: 90 });
  const boxes = [cell(0, 0), cell(118, 0), cell(236, 0), cell(0, 110), cell(118, 110), cell(0, 260), cell(118, 260)];

  it('steps left and right through the order', () => {
    expect(neighbor(boxes, 2, 'right')).toBe(3);
    expect(neighbor(boxes, 0, 'left')).toBeNull();
  });

  it('goes to the nearest item in the next row', () => {
    expect(neighbor(boxes, 1, 'down')).toBe(4);
    expect(neighbor(boxes, 2, 'down')).toBe(4);
    expect(neighbor(boxes, 4, 'down')).toBe(6);
    expect(neighbor(boxes, 3, 'up')).toBe(0);
    expect(neighbor(boxes, 1, 'up')).toBeNull();
  });
});
