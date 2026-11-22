import { useEffect, useEffectEvent, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import { ItemIcon } from '@/apps/finder/ItemIcon';
import { iconLabelLines } from '@/apps/finder/truncate';
import { useLabelMeasure } from '@/apps/finder/viewShared';
import { openContextMenu } from '@/desktop/menus/contextMenu';
import { openQuickLook } from '@/desktop/quicklook/quickLook';
import { springEasing, SPRINGS } from '@/lib/spring';
import { readStorage, writeStorage } from '@/lib/storage';
import { useDrag } from '@/lib/useDrag';
import { canRun, registerCommand, runCommand } from '@/os/commands';
import type { MenuEntry } from '@/os/menus';
import { toRect, useWindows, type Rect } from '@/os/windows';
import { FILES, type FileId } from '../files';
import { arrange, cellOrigin, drop, type Cell, type Grid } from './grid';
import styles from './DesktopIcons.module.css';

/** Top-down from the top-right corner, as Finder lays out a fresh desktop. */
const ORDER: FileId[] = ['readme', 'portfolio-pdf', 'projects', 'awards'];
const STORAGE_KEY = 'desktop-icons';
/**
 * Finder's desktop settings on the measured Mac (macos.md §9): 64 pt icons,
 * 12 pt labels below, grid spacing 54, so items sit icon + spacing = 118 pt
 * apart, as in Finder's icon view. Labels may use the cell less 2 pt a side.
 */
const ICON = 64;
const CELL = ICON + 54;
const LABEL_WIDTH = CELL - 4;
const LABEL_FONT = '400 12px';

type Saved = Partial<Record<FileId, Cell>>;

function readSaved(): Saved {
  try {
    return JSON.parse(readStorage('localStorage', STORAGE_KEY) ?? '{}') as Saved;
  } catch {
    return {};
  }
}

const writeSaved = (cells: Saved | null) => writeStorage('localStorage', STORAGE_KEY, cells && JSON.stringify(cells));

const intersects = (a: DOMRect, b: Rect) =>
  a.left < b.x + b.w && a.right > b.x && a.top < b.y + b.h && a.bottom > b.y;

const snap = springEasing(SPRINGS.snappy);

/**
 * The desktop's files: Finder's icon grid on the right, click / ⌘-click /
 * rubber-band selection, drag to rearrange (snapped to the grid and kept in
 * localStorage), double-click, Return, ⌘O or ⌘↓ to open, Space for Quick Look,
 * arrow keys to move the selection, and the desktop's right-click menus. A
 * press on the empty desktop makes the desktop (Finder) the active app.
 */
export function DesktopIcons() {
  const area = useWindows((s) => s.area);
  const desktopFocused = useWindows((s) => s.desktopFocused);
  const grid = useMemo<Grid>(
    () => ({
      cellW: CELL,
      cellH: CELL,
      // A few points in from the screen edge, so a full-width label never touches it.
      right: area.x + area.w - 6,
      top: area.y + 4,
      rows: Math.max(1, Math.floor((area.h - 4) / CELL)),
      cols: Math.max(1, Math.floor((area.w - 6) / CELL)),
    }),
    [area],
  );
  const [saved, setSaved] = useState<Saved>(readSaved);
  const cells = useMemo(() => arrange(ORDER, saved, grid) as Record<FileId, Cell>, [saved, grid]);
  const [selection, setSelection] = useState<ReadonlySet<FileId>>(new Set());
  const selected = ORDER.filter((id) => selection.has(id));
  const active = selected.at(-1);
  const [marquee, setMarquee] = useState<Rect | null>(null);
  // Finder windows' label rule (two lines, the second middle-truncated), measured in this font.
  const measure = useLabelMeasure(LABEL_FONT);
  const layer = useRef<HTMLDivElement>(null);

  const imageRect = (id: FileId) => layer.current?.querySelector(`[data-id="${id}"] [data-image]`)?.getBoundingClientRect();

  const openFiles = (ids: Iterable<FileId>) => {
    for (const id of ids) {
      const rect = imageRect(id);
      FILES[id].open(rect ? toRect(rect) : undefined);
    }
  };

  const quickLook = (ids: ReadonlySet<FileId>) => {
    const chosen = ORDER.filter((id) => ids.has(id));
    const first = chosen[0];
    if (!first) return;
    openQuickLook(chosen.flatMap((id) => FILES[id].quickLook()), 0, imageRect(first));
  };

  // Finder's 파일 › 열기 (⌘O) and 훑어보기 (⌘Y) act on the desktop's selection while the desktop is active.
  const onDesktopCommand = useEffectEvent((command: 'open' | 'quickLook') => {
    if (!useWindows.getState().desktopFocused || !selection.size) return;
    if (command === 'open') openFiles(selected);
    else quickLook(selection);
  });
  useEffect(() => {
    const disposers = [
      registerCommand('finder.open', () => onDesktopCommand('open')),
      registerCommand('finder.quickLook', () => onDesktopCommand('quickLook')),
    ];
    return () => disposers.forEach((dispose) => dispose());
  }, []);

  const activateDesktop = () => {
    useWindows.getState().blur();
    layer.current?.focus({ preventScroll: true });
  };

  // ---- Dragging icons ----
  const moving = useRef<{ ids: FileId[]; from: Record<string, { x: number; y: number }> } | null>(null);
  const iconElement = (id: FileId) => layer.current?.querySelector<HTMLElement>(`[data-id="${id}"]`);
  const dragIcons = useDrag({
    onStart: () => {
      moving.current = { ids: selected, from: Object.fromEntries(selected.map((id) => [id, cellOrigin(cells[id], grid)])) };
      // The icons follow the pointer directly; the snap transition comes back on drop.
      for (const id of selected) iconElement(id)?.setAttribute('data-dragging', '');
    },
    onMove: ({ dx, dy }) => {
      const drag = moving.current;
      if (!drag) return;
      for (const id of drag.ids) {
        const from = drag.from[id]!;
        iconElement(id)?.style.setProperty('translate', `${from.x + dx}px ${from.y + dy}px`);
      }
    },
    onEnd: ({ dx, dy }) => {
      const drag = moving.current;
      moving.current = null;
      if (!drag) return;
      const dropped = Object.fromEntries(drag.ids.map((id) => [id, { x: drag.from[id]!.x + dx, y: drag.from[id]!.y + dy }]));
      const next = drop(cells, dropped, grid) as Record<FileId, Cell>;
      for (const id of drag.ids) {
        const element = iconElement(id);
        const { x, y } = cellOrigin(next[id], grid);
        element?.removeAttribute('data-dragging');
        // Snap to the cell from where it was let go (the same value React renders next).
        element?.style.setProperty('translate', `${x}px ${y}px`);
      }
      setSaved(next);
      writeSaved(next);
    },
    onTap: (event) => {
      const id = (event.target as Element).closest<HTMLElement>('[data-id]')?.dataset.id as FileId | undefined;
      if (id && !event.metaKey && !event.shiftKey) setSelection(new Set([id]));
    },
  });

  const pressIcon = (id: FileId, event: PointerEvent<HTMLElement>) => {
    event.stopPropagation();
    activateDesktop();
    if (event.button !== 0) return;
    if (event.metaKey || event.shiftKey) {
      const next = new Set(selection);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelection(next);
      return;
    }
    if (!selection.has(id)) setSelection(new Set([id]));
    dragIcons(event);
  };

  // ---- Rubber band ----
  const band = useRef<{ x: number; y: number; base: ReadonlySet<FileId>; boxes: [FileId, DOMRect[]][] } | null>(null);
  const dragBand = useDrag(
    {
      onStart: () => {
        const boxes = ORDER.map((id): [FileId, DOMRect[]] => {
          const icon = layer.current?.querySelector(`[data-id="${id}"]`);
          const parts = [icon?.querySelector('[data-image]'), icon?.querySelector('[data-text]')];
          return [id, parts.filter((part): part is Element => Boolean(part)).map((part) => part.getBoundingClientRect())];
        });
        if (band.current) band.current.boxes = boxes;
      },
      onMove: ({ dx, dy }) => {
        const b = band.current;
        if (!b) return;
        const rect = { x: Math.min(b.x, b.x + dx), y: Math.min(b.y, b.y + dy), w: Math.abs(dx), h: Math.abs(dy) };
        setMarquee(rect);
        const hit = b.boxes.filter(([, boxes]) => boxes.some((box) => intersects(box, rect))).map(([id]) => id);
        setSelection(new Set([...b.base, ...hit]));
      },
      onEnd: () => {
        band.current = null;
        setMarquee(null);
      },
    },
    { threshold: 3 },
  );

  const pressDesktop = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.button !== 0) return;
    activateDesktop();
    const additive = event.metaKey || event.shiftKey;
    if (!additive) setSelection(new Set());
    band.current = { x: event.clientX, y: event.clientY, base: additive ? selection : new Set(), boxes: [] };
    dragBand(event);
  };

  // ---- Menus ----
  const iconMenu = (id: FileId, event: MouseEvent) => {
    event.stopPropagation();
    const ids = selection.has(id) ? selection : new Set([id]);
    if (!selection.has(id)) setSelection(ids);
    const entries: MenuEntry[] = [
      { label: '열기', command: 'open' },
      { label: '훑어보기', command: 'quicklook' },
      'separator',
      // Greyed out unless Finder can show an info window.
      { label: '정보 가져오기', command: canRun('finder.getInfo') ? 'info' : undefined },
    ];
    openContextMenu(event, entries, (command) => {
      if (command === 'open') openFiles(ORDER.filter((file) => ids.has(file)));
      else if (command === 'quicklook') quickLook(ids);
      else runCommand('finder.getInfo');
    });
  };

  const desktopMenu = (event: MouseEvent) => {
    if (event.target !== event.currentTarget) return;
    activateDesktop();
    const entries: MenuEntry[] = [
      { label: '배경화면 변경…', command: 'wallpaper' },
      'separator',
      { label: '정리', command: 'cleanup' },
      'separator',
      { label: '텍스트 버전으로 보기', command: 'system.readerMode' },
      { label: '이 사이트의 소스 코드 보기', command: 'help.source' },
    ];
    openContextMenu(event, entries, (command) => {
      if (command === 'wallpaper') useWindows.getState().open('settings', { pane: 'wallpaper' });
      else if (command === 'cleanup') {
        setSaved({});
        writeSaved(null);
      } else runCommand(command);
    });
  };

  // ---- Keyboard ----
  const step = (key: string): FileId | undefined => {
    if (!active) return ORDER[0];
    const from = cells[active];
    const direction = { ArrowDown: [0, 1], ArrowUp: [0, -1], ArrowLeft: [1, 0], ArrowRight: [-1, 0] }[key];
    if (!direction) return active;
    const [dc, dr] = direction as [number, number];
    // The nearest icon ahead in that direction, preferring the same row or column.
    const ahead = ORDER.filter((id) => {
      const c = cells[id];
      return id !== active && (dc ? Math.sign(c.col - from.col) === dc : Math.sign(c.row - from.row) === dr);
    });
    const distance = (id: FileId) => {
      const c = cells[id];
      return dc ? Math.abs(c.col - from.col) * 10 + Math.abs(c.row - from.row) : Math.abs(c.row - from.row) * 10 + Math.abs(c.col - from.col);
    };
    return ahead.sort((a, b) => distance(a) - distance(b))[0] ?? active;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented) return;
    const command = event.metaKey;
    if (event.key === 'Enter' || (command && (event.key === 'o' || event.key === 'ArrowDown'))) {
      event.preventDefault();
      openFiles(selected);
    } else if (event.key === ' ') {
      event.preventDefault();
      quickLook(selection);
    } else if (command && event.key === 'a') {
      event.preventDefault();
      setSelection(new Set(ORDER));
    } else if (event.key === 'Escape') {
      setSelection(new Set());
    } else if (event.key.startsWith('Arrow') && !command) {
      event.preventDefault();
      const next = step(event.key);
      if (next) setSelection(new Set([next]));
    }
  };

  return (
    <div
      ref={layer}
      className={styles.layer}
      role="listbox"
      aria-label="데스크탑"
      aria-multiselectable="true"
      aria-activedescendant={active ? `desktop-icon-${active}` : undefined}
      tabIndex={0}
      style={{ '--snap': snap.easing, '--snap-duration': `${snap.duration}ms` } as CSSProperties}
      data-focused={desktopFocused || undefined}
      onPointerDown={pressDesktop}
      onContextMenu={desktopMenu}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if (event.target !== event.currentTarget) return;
        // Focus on the desktop makes it the active app, as a click does; tabbing here also selects the first item, as Finder does.
        useWindows.getState().blur();
        if (!selection.size && event.currentTarget.matches(':focus-visible')) setSelection(new Set([ORDER[0]!]));
      }}
    >
      {ORDER.map((id) => {
        const file = FILES[id];
        const { x, y } = cellOrigin(cells[id], grid);
        const selected = selection.has(id);
        const { name } = file.item;
        const lines = iconLabelLines(name, LABEL_WIDTH, measure);
        return (
          <div
            key={id}
            id={`desktop-icon-${id}`}
            role="option"
            aria-selected={selected}
            aria-label={name}
            title={lines.some((line) => line.includes('…')) ? name : undefined}
            className={styles.icon}
            style={{ translate: `${x}px ${y}px` }}
            data-id={id}
            data-selected={selected || undefined}
            onPointerDown={(event) => pressIcon(id, event)}
            onDoubleClick={() => openFiles([id])}
            onContextMenu={(event) => iconMenu(id, event)}
          >
            <span className={styles.image} data-image>
              <ItemIcon item={file.item} size={ICON} />
            </span>
            <span className={styles.label} aria-hidden="true" data-text>
              {lines.map((line, i) => (
                <span key={i} className={styles.line}>
                  {line}
                </span>
              ))}
            </span>
          </div>
        );
      })}
      {marquee && <div className={styles.marquee} style={{ translate: `${marquee.x}px ${marquee.y}px`, width: marquee.w, height: marquee.h }} />}
    </div>
  );
}
