/**
 * The desktop icon grid. macOS arranges desktop items from the top-right
 * corner downwards, then in the next column to the left; columns are counted
 * from the right edge so a saved arrangement survives a narrower window.
 */
export interface Cell {
  /** 0 is the rightmost column. */
  col: number;
  row: number;
}

export interface Grid {
  /** Cell size: a 64 pt icon, a two-line 12 pt label and the space between items. */
  cellW: number;
  cellH: number;
  /** Screen x of the rightmost column's right edge. */
  right: number;
  /** Screen y of the first row's top edge. */
  top: number;
  rows: number;
  cols: number;
}

export const cellOrigin = (cell: Cell, grid: Grid) => ({
  x: grid.right - (cell.col + 1) * grid.cellW,
  y: grid.top + cell.row * grid.cellH,
});

export function nearestCell(x: number, y: number, grid: Grid): Cell {
  const col = Math.round((grid.right - grid.cellW - x) / grid.cellW);
  const row = Math.round((y - grid.top) / grid.cellH);
  return { col: Math.min(Math.max(col, 0), grid.cols - 1), row: Math.min(Math.max(row, 0), grid.rows - 1) };
}

const key = (cell: Cell) => `${cell.col}:${cell.row}`;

/** The free cell closest to `wanted` (by distance between cell centres). */
function freeCell(wanted: Cell, taken: ReadonlySet<string>, grid: Grid): Cell {
  let best: Cell = wanted;
  let bestDistance = Infinity;
  for (let col = 0; col < grid.cols; col++) {
    for (let row = 0; row < grid.rows; row++) {
      if (taken.has(key({ col, row }))) continue;
      const distance = ((col - wanted.col) * grid.cellW) ** 2 + ((row - wanted.row) * grid.cellH) ** 2;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { col, row };
      }
    }
  }
  return best;
}

/**
 * Where each icon goes: its saved cell when that is on screen and not already
 * used, otherwise the next free cell in Finder's order (down, then left).
 */
export function arrange(ids: readonly string[], saved: Partial<Record<string, Cell>>, grid: Grid): Record<string, Cell> {
  const out: Record<string, Cell> = {};
  const taken = new Set<string>();
  for (const id of ids) {
    const cell = saved[id];
    if (cell && cell.col < grid.cols && cell.row < grid.rows && !taken.has(key(cell))) {
      out[id] = cell;
      taken.add(key(cell));
    }
  }
  let next = 0;
  for (const id of ids) {
    if (out[id]) continue;
    while (taken.has(key({ col: Math.floor(next / grid.rows), row: next % grid.rows }))) next++;
    out[id] = { col: Math.floor(next / grid.rows), row: next % grid.rows };
    taken.add(key(out[id]));
  }
  return out;
}

/** Moves `moving` icons to the cells nearest their drop points, keeping every other icon where it is. */
export function drop(
  cells: Readonly<Record<string, Cell>>,
  moving: Readonly<Record<string, { x: number; y: number }>>,
  grid: Grid,
): Record<string, Cell> {
  const out = { ...cells };
  const taken = new Set(Object.entries(cells).filter(([id]) => !(id in moving)).map(([, cell]) => key(cell)));
  for (const [id, point] of Object.entries(moving)) {
    const cell = freeCell(nearestCell(point.x, point.y, grid), taken, grid);
    out[id] = cell;
    taken.add(key(cell));
  }
  return out;
}
