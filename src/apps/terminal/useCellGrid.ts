import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Columns × rows that fit in `screen`'s content box, measured with `cell` (a
 * probe holding ten monospace characters). Terminal titles its window with
 * this size and `ls` wraps to the column count.
 */
export function useCellGrid(screen: RefObject<HTMLElement | null>, cell: RefObject<HTMLElement | null>) {
  const [grid, setGrid] = useState({ cols: 80, rows: 24 });

  useLayoutEffect(() => {
    const element = screen.current;
    const probe = cell.current;
    if (!element || !probe) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const box = probe.getBoundingClientRect();
      const cols = Math.max(1, Math.floor(width / (box.width / 10)));
      const rows = Math.max(1, Math.floor(height / box.height));
      setGrid((old) => (old.cols === cols && old.rows === rows ? old : { cols, rows }));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [screen, cell]);

  return grid;
}
