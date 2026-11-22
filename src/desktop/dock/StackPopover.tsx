import { useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { ItemIcon } from '@/apps/finder/ItemIcon';
import { iconLabelLines } from '@/apps/finder/truncate';
import { useLabelMeasure } from '@/apps/finder/viewShared';
import { useDismiss } from '@/desktop/menus/useDismiss';
import { springEasing, SPRINGS } from '@/lib/spring';
import { motionReduced } from '@/os/theme';
import { useWindows } from '@/os/windows';
import { Glass } from '@/ui/Glass';
import { Symbol } from '@/ui/Symbol';
import type { StackId } from './items';
import { STACKS, type StackEntry } from './stacks';
import styles from './StackPopover.module.css';

interface StackPopoverProps {
  stack: StackId;
  view: 'fan' | 'grid';
  /** Screen rect of the stack's icon. */
  anchor: DOMRect;
  /** Screen y of the Dock shelf's top edge. */
  dockTop: number;
  /** `refocus`: give keyboard focus back to the stack tile (Escape). */
  onClose: (refocus: boolean) => void;
}

/** Keeps the grid this far from the screen edges. */
const MARGIN = 8;

/**
 * An open Dock stack: a fan of items rising from the icon, or a glass grid
 * above it (다음으로 내용 보기: 부채 모양 / 격자 모양). Either ends with
 * "Finder에서 열기", as on macOS. Arrow keys move between items.
 */
export function StackPopover({ stack, view, anchor, dockTop, onClose }: StackPopoverProps) {
  const { name, location, entries } = STACKS[stack];
  const root = useRef<HTMLDivElement>(null);
  const measure = useLabelMeasure(CELL_LABEL_FONT);
  // A press on the stack's own tile toggles it; the tile handles that one.
  useDismiss(true, root, () => onClose(false), { ignore: `[data-stack="${stack}"]`, escape: false });

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    // Keyboard focus starts on the item nearest the stack: the fan's bottom row, the grid's first cell.
    const focusable = [...element.querySelectorAll<HTMLElement>('[data-entry]')];
    (view === 'fan' ? focusable.at(-1) : focusable[0])?.focus({ preventScroll: true });
    if (motionReduced()) return;
    const { easing, duration } = springEasing(SPRINGS.snappy);
    if (view === 'grid') {
      element.animate({ transform: ['scale(0.2)', 'none'], opacity: [0, 1] }, { duration, easing });
    } else {
      focusable.forEach((entry, i) => {
        const rise = focusable.length - i;
        entry.animate(
          { transform: [`translateY(${rise * 24}px) scale(0.6)`, 'none'], opacity: [0, 1] },
          { duration, easing, delay: rise * 18, fill: 'backwards' },
        );
      });
    }
  }, [view]);

  const openInFinder = () => {
    onClose(false);
    useWindows.getState().open('finder', { location });
  };

  const choose = (entry: StackEntry, element: HTMLElement) => {
    onClose(false);
    entry.activate(element.getBoundingClientRect());
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const all = [...(root.current?.querySelectorAll<HTMLElement>('[data-entry]') ?? [])];
    const index = all.indexOf(document.activeElement as HTMLElement);
    const columns = view === 'grid' ? gridColumns(entries.length) : 1;
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: columns, ArrowUp: -columns }[event.key];
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose(true);
    } else if (step !== undefined) {
      event.preventDefault();
      all[Math.min(Math.max(index + step, 0), all.length - 1)]?.focus();
    }
  };

  const centre = anchor.left + anchor.width / 2;
  const bottom = window.innerHeight - dockTop + 10;

  if (view === 'fan') {
    // Rendered top to bottom: "Finder에서 열기" crowns the fan, the newest item sits nearest the Dock.
    const rows = [...entries].reverse();
    return (
      <div ref={root} className={styles.fan} role="dialog" aria-label={`${name} 스택`} style={{ left: centre, bottom }} onKeyDown={onKeyDown}>
        <ul className={styles.fanList} role="list">
          <li style={fanOffset(entries.length)}>
            <button type="button" className={styles.fanItem} data-entry onClick={openInFinder}>
              <span className={styles.fanLabel}>Finder에서 열기</span>
              <span className={styles.fanFinder} aria-hidden="true">
                <Symbol name="arrow.up.right.square" size={22} weight="medium" />
              </span>
            </button>
          </li>
          {rows.map((entry, i) => (
            <li key={entry.item.id} style={fanOffset(rows.length - 1 - i)}>
              <button type="button" className={styles.fanItem} data-entry onClick={(e) => choose(entry, e.currentTarget)}>
                <span className={styles.fanLabel}>{entry.item.name}</span>
                <ItemIcon item={entry.item} size={56} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const columns = gridColumns(entries.length);
  const width = columns * CELL + 32;
  const left = Math.min(Math.max(centre - width / 2, MARGIN), window.innerWidth - width - MARGIN);
  return (
    <div
      ref={root}
      className={styles.gridAnchor}
      role="dialog"
      aria-label={`${name} 스택`}
      style={{ left, bottom, width, transformOrigin: `${centre - left}px 100%` }}
      onKeyDown={onKeyDown}
    >
      <Glass variant="panel" radius={20} className={styles.grid} style={{ '--columns': columns } as CSSProperties}>
        <h2 className={styles.title}>{name}</h2>
        <ul className={styles.cells} role="list">
          {entries.map((entry) => (
            <li key={entry.item.id}>
              <button type="button" className={styles.cell} data-entry onClick={(e) => choose(entry, e.currentTarget)}>
                <ItemIcon item={entry.item} size={64} />
                <span className={styles.cellLabel} title={entry.item.name}>
                  {iconLabelLines(entry.item.name, CELL_LABEL_WIDTH, measure).map((line, i) => (
                    <span key={i}>{line}</span>
                  ))}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.finder} data-entry onClick={openInFinder}>
          Finder에서 열기
          <Symbol name="chevron.right" size={11} weight="semibold" />
        </button>
      </Glass>
    </div>
  );
}

/** Grid cell width (icon plus a two-line label) and its label, cut the way Finder cuts names. */
const CELL = 104;
const CELL_LABEL_WIDTH = 92;
const CELL_LABEL_FONT = '500 11px';
/** Wider than tall, like macOS lays out a grid stack: 2 items → 2 columns, 7 → 4, 12 → 5. */
const gridColumns = (count: number) => Math.min(5, Math.max(2, Math.ceil(Math.sqrt(count * 1.6))));

/** Fan items rise in an arc: each step up bends a little further right and turns a little. */
const fanOffset = (step: number): CSSProperties => ({
  translate: `${step * step * 2.2}px 0`,
  rotate: `${step * 1.6}deg`,
});
