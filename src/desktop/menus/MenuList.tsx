import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { MenuEntry, MenuItem } from '@/os/menus';
import { shortcutParts } from '@/os/shortcuts';
import { Glass } from '@/ui/Glass';
import { Symbol } from '@/ui/Symbol';
import styles from './MenuList.module.css';

/** A caption row that is not an action, like "배터리  87%" at the top of the battery menu. */
export interface MenuHeading {
  heading: string;
  detail?: string;
}

export type MenuRow = MenuEntry | MenuHeading;

/**
 * Where a menu opens, in viewport px. A menu that would cross the right or
 * bottom edge moves to the far side of `flipX` / `flipY` (a context menu then
 * opens to the left of or above the pointer), otherwise it slides back in.
 */
export interface MenuPlacement {
  x: number;
  y: number;
  flipX?: number;
  flipY?: number;
}

interface MenuListProps {
  entries: readonly MenuRow[];
  /** Accessible name of the menu. */
  label: string;
  placement: MenuPlacement;
  isEnabled: (item: MenuItem) => boolean;
  onChoose: (item: MenuItem) => void;
  /** Escape or Tab: close the whole menu. */
  onDismiss: () => void;
  /** ← / → past this menu: the menu bar opens the neighbouring menu. */
  onStep?: (direction: -1 | 1) => void;
  /** Opened from the keyboard: start on the first item, as macOS does. */
  highlightFirst?: boolean;
  /** Take keyboard focus when it opens (submenus opened by hovering do not). */
  focusOnOpen?: boolean;
  onPointerEnter?: () => void;
}

/** Keeps menus this far from the screen edges. */
const SCREEN_MARGIN = 4;
/** Menu padding: a submenu sits this much higher so its first row is level with its parent row. */
const MENU_PAD = 5;
/** Kit render: a submenu starts 5 pt inside its parent's right edge. */
const SUBMENU_OVERLAP = 5;
/** Moving diagonally into an open submenu crosses other rows; they wait this long (ms) before taking over. */
const SWITCH_DELAY = 160;

const isItem = (row: MenuRow): row is MenuItem => row !== 'separator' && 'label' in row;

const ARIA_KEYS: Record<string, string> = {
  '⌃': 'Control',
  '⌥': 'Alt',
  '⇧': 'Shift',
  '⌘': 'Meta',
  '↑': 'ArrowUp',
  '↓': 'ArrowDown',
  '←': 'ArrowLeft',
  '→': 'ArrowRight',
  '⌫': 'Backspace',
  '⌦': 'Delete',
  '⎋': 'Escape',
  '⇥': 'Tab',
  '↩': 'Enter',
};

/** "⌥⌘H" → ["⌥", "⌘", "H"], with the globe (fn) key first, the way macOS prints "fn ⌃F". */
function glyphsOf(shortcut: string): string[] {
  const parts = shortcutParts(shortcut).flatMap((part) => (part.startsWith('🌐') && part.length > 2 ? ['🌐', part.slice(2)] : [part]));
  return parts.includes('🌐') ? ['🌐', ...parts.filter((part) => part !== '🌐')] : parts;
}

function Shortcut({ glyphs }: { glyphs: string[] }) {
  return (
    <span className={styles.shortcut} aria-hidden="true">
      {glyphs.map((glyph, i) => (
        <span key={i} className={styles.glyph}>
          {glyph === '🌐' ? <Symbol name="globe" size={13} weight="medium" /> : glyph}
        </span>
      ))}
    </span>
  );
}

/**
 * One macOS menu: pull-down, context or Dock menu, with nested submenus.
 * Items are real buttons; the highlighted one holds keyboard focus, so the
 * pointer and the arrow keys move the same highlight, as on a Mac. A press on
 * a menu-bar title can be dragged onto an item and released to choose it.
 */
export function MenuList({
  entries,
  label,
  placement,
  isEnabled,
  onChoose,
  onDismiss,
  onStep,
  highlightFirst = false,
  focusOnOpen = true,
  onPointerEnter,
}: MenuListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = entries.map((row) => isItem(row) && isEnabled(row));
  const [active, setActive] = useState(() => (highlightFirst ? enabled.indexOf(true) : -1));
  const [submenu, setSubmenu] = useState<{ index: number; keyboard: boolean; placement: MenuPlacement } | null>(null);
  const switchTimer = useRef(0);
  const pressedIndex = useRef(-1);

  const { x, y, flipX, flipY } = placement;
  useLayoutEffect(() => {
    const menu = ref.current;
    if (!menu) return;
    const { width, height } = menu.getBoundingClientRect();
    const maxX = window.innerWidth - SCREEN_MARGIN - width;
    const maxY = window.innerHeight - SCREEN_MARGIN - height;
    const left = x <= maxX ? x : flipX !== undefined && flipX - width >= SCREEN_MARGIN ? flipX - width : maxX;
    const top = y <= maxY ? y : flipY !== undefined && flipY - height >= SCREEN_MARGIN ? flipY - height : maxY;
    menu.style.left = `${Math.max(SCREEN_MARGIN, left)}px`;
    menu.style.top = `${Math.max(SCREEN_MARGIN, top)}px`;
  }, [x, y, flipX, flipY, entries]);

  useEffect(() => {
    if (!focusOnOpen) return;
    const menu = ref.current;
    const highlighted = menu?.firstElementChild?.querySelector<HTMLElement>(':scope > [data-active]');
    (highlighted ?? menu)?.focus({ preventScroll: true });
  }, [focusOnOpen]);

  useEffect(() => () => window.clearTimeout(switchTimer.current), []);

  const itemAt = (index: number) =>
    index < 0 ? null : (ref.current?.firstElementChild?.querySelector<HTMLElement>(`:scope > [data-index="${index}"]`) ?? null);

  const highlight = (index: number) => {
    setActive(index);
    (itemAt(index) ?? ref.current)?.focus({ preventScroll: true });
  };

  const openSubmenu = (index: number, keyboard: boolean) => {
    const surface = ref.current?.firstElementChild;
    const row = itemAt(index);
    if (!surface || !row) return;
    const menuBox = surface.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();
    highlight(index);
    setSubmenu({
      index,
      keyboard,
      placement: { x: menuBox.right - SUBMENU_OVERLAP, y: rowBox.top - MENU_PAD, flipX: menuBox.left + SUBMENU_OVERLAP },
    });
  };

  const closeSubmenu = () => {
    setSubmenu(null);
    itemAt(active)?.focus({ preventScroll: true });
  };

  const choose = (index: number, keyboard: boolean) => {
    const row = entries[index];
    if (!row || !isItem(row) || !enabled[index]) return;
    if (row.submenu) openSubmenu(index, keyboard);
    else onChoose(row);
  };

  const hover = (index: number) => {
    window.clearTimeout(switchTimer.current);
    const enter = () => {
      const row = entries[index];
      if (!row || !isItem(row) || !enabled[index]) {
        setSubmenu(null);
        highlight(-1);
      } else if (row.submenu) {
        openSubmenu(index, false);
      } else {
        setSubmenu(null);
        highlight(index);
      }
    };
    if (submenu && submenu.index !== index) switchTimer.current = window.setTimeout(enter, SWITCH_DELAY);
    else enter();
  };

  const move = (delta: 1 | -1) => {
    const count = entries.length;
    const start = active < 0 ? (delta > 0 ? -1 : count) : active;
    for (let step = 1; step <= count; step++) {
      const next = (start + delta * step + 2 * count) % count;
      if (enabled[next]) {
        setSubmenu(null);
        highlight(next);
        return;
      }
    }
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const row = active >= 0 ? entries[active] : undefined;
    const item = row && isItem(row) ? row : undefined;
    switch (event.key) {
      case 'ArrowDown':
        move(1);
        break;
      case 'ArrowUp':
        move(-1);
        break;
      case 'ArrowRight':
        if (item?.submenu) openSubmenu(active, true);
        else if (onStep) onStep(1);
        else return;
        break;
      case 'ArrowLeft':
        if (!onStep) return;
        onStep(-1);
        break;
      case 'Enter':
      case ' ':
        if (item) choose(active, true);
        break;
      case 'Escape':
        onDismiss();
        break;
      case 'Tab':
        onDismiss();
        return;
      default:
        return;
    }
    event.preventDefault();
    event.stopPropagation();
  };

  const open = submenu ? entries[submenu.index] : undefined;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={label}
      tabIndex={-1}
      className={styles.root}
      onKeyDown={onKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={() => {
        window.clearTimeout(switchTimer.current);
        if (!submenu) setActive(-1);
      }}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Glass variant="menu" radius={12} className={styles.surface}>
        {entries.map((row, index) => {
          if (row === 'separator') return <div key={index} role="separator" className={styles.separator} />;
          if (!isItem(row))
            return (
              <div key={index} className={styles.heading}>
                <span className={styles.label}>{row.heading}</span>
                {row.detail && <span className={styles.detail}>{row.detail}</span>}
              </div>
            );
          const glyphs = row.shortcut ? glyphsOf(row.shortcut) : [];
          return (
            <button
              key={index}
              type="button"
              role="menuitem"
              tabIndex={-1}
              data-index={index}
              data-active={index === active || undefined}
              aria-disabled={!enabled[index] || undefined}
              aria-haspopup={row.submenu ? 'menu' : undefined}
              aria-expanded={row.submenu ? submenu?.index === index : undefined}
              aria-keyshortcuts={glyphs.length && !glyphs.includes('🌐') ? glyphs.map((g) => ARIA_KEYS[g] ?? g).join('+') : undefined}
              className={styles.item}
              onPointerEnter={() => hover(index)}
              onPointerDown={() => {
                pressedIndex.current = index;
              }}
              onPointerUp={() => {
                // Released here after pressing elsewhere (a menu-bar title, another row): that is a choice.
                if (pressedIndex.current !== index) choose(index, false);
                pressedIndex.current = -1;
              }}
              onClick={(event) => choose(index, event.detail === 0)}
            >
              <span className={styles.label}>{row.label}</span>
              {glyphs.length > 0 && <Shortcut glyphs={glyphs} />}
              {row.submenu && <Symbol name="chevron.right" size={15} weight="semibold" className={styles.chevron} />}
            </button>
          );
        })}
      </Glass>
      {/* → into a submenu that hovering opened mounts it afresh as a keyboard menu, on its first item. */}
      {submenu && open && isItem(open) && open.submenu && (
        <MenuList
          key={`${submenu.index}:${submenu.keyboard}`}
          entries={open.submenu}
          label={open.label}
          placement={submenu.placement}
          isEnabled={isEnabled}
          onChoose={onChoose}
          onDismiss={onDismiss}
          onStep={(direction) => (direction < 0 ? closeSubmenu() : onStep?.(1))}
          highlightFirst={submenu.keyboard}
          focusOnOpen={submenu.keyboard}
          onPointerEnter={() => window.clearTimeout(switchTimer.current)}
        />
      )}
    </div>
  );
}
