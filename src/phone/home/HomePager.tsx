import { useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type UIEvent } from 'react';
import { animateSpring, project, SPRINGS } from '@/lib/spring';
import { useDrag } from '@/lib/useDrag';
import { motionReduced } from '@/os/theme';
import { Glass } from '@/ui/Glass';
import { inSystemEdge } from '../hooks';
import { Glyph } from '../kit';
import { LABEL_HEIGHT, moveTo, paginate, rowsThatFit, WIDGETS, type HomeItem, type Slot } from './items';
import { Tile } from './Tile';
import { useFlip } from './useFlip';
import { useReorder } from './useReorder';
import { AboutWidget, StatsWidget } from './Widgets';
import styles from './HomeScreen.module.css';

/** Pulling the Home Screen down this far opens Search. */
const PULL = 80;

interface HomePagerProps {
  items: readonly HomeItem[];
  order: readonly string[];
  onReorder: (order: string[]) => void;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  onOpen: (item: HomeItem, icon: HTMLElement) => void;
  onSearch: () => void;
}

/**
 * The Home Screen pages: widgets and icons on the kit's 4-column grid, paged
 * horizontally with native scroll snapping. Below them the "검색" pill (it
 * turns into the page control while the pages move); pulling down from the
 * middle of the screen also opens Search.
 */
export function HomePager({ items, order, onReorder, editing, onEditingChange, onOpen, onSearch }: HomePagerProps) {
  const pager = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState(6);
  const [page, setPage] = useState(0);
  const [moving, setMoving] = useState(false);
  const idle = useRef(0);
  const pull = useRef({ y: 0, stop: undefined as undefined | (() => void) });
  const reorder = useReorder(order, onReorder);
  const [keyMoved, setKeyMoved] = useState<string | null>(null);
  useFlip(pager, order, reorder.dragging);

  // An icon moved with the keyboard keeps the focus in its new place.
  useLayoutEffect(() => {
    if (keyMoved) document.querySelector<HTMLElement>(`[data-flip="${CSS.escape(keyMoved)}"] button`)?.focus({ preventScroll: true });
  }, [keyMoved, order]);

  const moveByKey = (id: string, peers: readonly string[], step: number) => {
    const target = peers[peers.indexOf(id) + step];
    if (!target) return;
    setKeyMoved(id);
    onReorder(moveTo(order, id, target));
  };

  useLayoutEffect(() => {
    const element = pager.current;
    if (!element) return;
    const observer = new ResizeObserver(() => {
      const css = getComputedStyle(element);
      const pitch = parseFloat(css.getPropertyValue('--ios-row-pitch'));
      const icon = parseFloat(css.getPropertyValue('--ios-icon'));
      setRows(rowsThatFit(element.clientHeight, pitch, icon + LABEL_HEIGHT));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const pages = useMemo(() => {
    const icons = items.map((item): Slot => ({ kind: 'item', item }));
    const [about, stats] = WIDGETS as [Slot, Slot];
    // Six rows hold both widgets and two icon rows. On a short screen (Safari with its
    // toolbars) the numbers widget moves after the apps, so page one still shows icons.
    return paginate(rows >= 5 ? [about, stats, ...icons] : [about, ...icons, stats], rows);
  }, [items, rows]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollLeft, clientWidth } = event.currentTarget;
    setPage(Math.round(scrollLeft / clientWidth));
    setMoving(true);
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setMoving(false), 700);
  };

  const showPage = (index: number) => {
    const element = pager.current;
    element?.scrollTo({ left: index * element.clientWidth, behavior: motionReduced() ? 'auto' : 'smooth' });
  };

  const setPull = (y: number) => {
    pull.current.y = y;
    pager.current?.style.setProperty('--pull', String(y));
  };
  const pullDown = useDrag(
    {
      onStart: () => pull.current.stop?.(),
      onMove: ({ dy }) => setPull(Math.max(0, dy)),
      onEnd: ({ dy, vy }) => {
        if (project(dy, vy) > PULL * 1.5 || dy > PULL) onSearch();
        pull.current.stop = animateSpring({ from: pull.current.y, to: 0, velocity: vy, spring: SPRINGS.snappy, onUpdate: setPull });
      },
    },
    { axis: 'y' },
  );
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!editing && !inSystemEdge(event.clientY)) pullDown(event);
  };

  const exitOnEmpty = (event: { target: EventTarget; currentTarget: EventTarget }) => {
    if (editing && event.target === event.currentTarget) onEditingChange(false);
  };

  return (
    <>
      <div ref={pager} className={styles.pager} onScroll={onScroll} onPointerDown={onPointerDown}>
        {pages.map((slots, index) => {
          const peers = slots.flatMap((slot) => (slot.kind === 'item' ? [slot.item.id] : []));
          return (
            <div key={index} className={styles.page} role="group" aria-label={`홈 화면 ${index + 1}쪽`} onClick={exitOnEmpty}>
              {slots.map((slot, cell) =>
                slot.kind === 'widget' ? (
                  slot.id === 'about' ? (
                    <AboutWidget key="about" editing={editing} />
                  ) : (
                    <StatsWidget key="stats" editing={editing} />
                  )
                ) : (
                  <div key={slot.item.id} className={styles.slot} data-flip={slot.item.id} data-dragging={reorder.dragging === slot.item.id || undefined}>
                    <Tile
                      item={slot.item}
                      editing={editing}
                      offset={cell % 2 === 1}
                      onOpen={onOpen}
                      onLongPress={() => onEditingChange(true)}
                      onDragStart={(event) => reorder.start(slot.item.id, peers, event)}
                      onKeyMove={(step) => moveByKey(slot.item.id, peers, step)}
                    />
                  </div>
                ),
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.searchArea}>
        {moving || editing ? (
          // UIPageControl: one control, as the dots are too close for a 44 pt target each. A tap on its
          // left half goes back a page; anything else (right half, keyboard, screen reader) goes forward,
          // round to the first page after the last.
          <button
            type="button"
            className={styles.dots}
            aria-label={`${pages.length}쪽 중 ${page + 1}쪽, 다음 쪽 보기`}
            onClick={(event) => {
              const { left, width } = event.currentTarget.getBoundingClientRect();
              const back = event.detail > 0 && event.clientX < left + width / 2;
              showPage(back ? Math.max(0, page - 1) : (page + 1) % pages.length);
            }}
          >
            {pages.map((_, index) => (
              <span key={index} className={styles.dot} data-current={index === page || undefined} />
            ))}
          </button>
        ) : (
          <Glass as="button" type="button" radius={15} className={styles.searchPill} aria-haspopup="dialog" onClick={onSearch}>
            <Glyph name="magnifyingglass" pt={12} weight="semibold" />
            검색
          </Glass>
        )}
      </div>
    </>
  );
}
