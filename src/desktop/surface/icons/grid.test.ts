import { describe, expect, it } from 'vitest';
import { arrange, cellOrigin, drop, nearestCell, type Grid } from './grid';

const grid: Grid = { cellW: 100, cellH: 100, right: 1436, top: 36, rows: 7, cols: 12 };
const ids = ['readme', 'pdf', 'projects', 'awards'];

describe('desktop icon grid', () => {
  it('fills the rightmost column from the top, like Finder', () => {
    const cells = arrange(ids, {}, grid);
    expect(ids.map((id) => cells[id])).toEqual([
      { col: 0, row: 0 },
      { col: 0, row: 1 },
      { col: 0, row: 2 },
      { col: 0, row: 3 },
    ]);
    expect(cellOrigin({ col: 0, row: 0 }, grid)).toEqual({ x: 1336, y: 36 });
  });

  it('keeps saved cells, and moves a clash or an off-screen cell to the next free one', () => {
    const cells = arrange(ids, { pdf: { col: 3, row: 2 }, projects: { col: 3, row: 2 }, awards: { col: 40, row: 0 } }, grid);
    expect(cells.pdf).toEqual({ col: 3, row: 2 });
    expect(cells.projects).toEqual({ col: 0, row: 1 });
    expect(cells.awards).toEqual({ col: 0, row: 2 });
  });

  it('snaps a dropped icon to the nearest free cell', () => {
    const cells = arrange(ids, {}, grid);
    expect(nearestCell(1336 - 60, 36 + 10, grid)).toEqual({ col: 1, row: 0 });
    // Dropped right on top of "pdf": it takes the closest free cell instead.
    const after = drop(cells, { readme: cellOrigin({ col: 0, row: 1 }, grid) }, grid);
    expect(after.pdf).toEqual({ col: 0, row: 1 });
    expect(after.readme).not.toEqual({ col: 0, row: 1 });
    expect(new Set(Object.values(after).map((c) => `${c.col}:${c.row}`)).size).toBe(ids.length);
  });
});
