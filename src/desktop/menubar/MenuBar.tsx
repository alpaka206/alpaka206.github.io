import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useMenuFlash } from '@/os/keyboard';
import { menusFor, SYSTEM_MENU, type Menu } from '@/os/menus';
import { useWindows } from '@/os/windows';
import { canChoose, chooseItem } from '../menus/menuCommands';
import { MenuList, type MenuPlacement } from '../menus/MenuList';
import { useDismiss } from '../menus/useDismiss';
import { BrandMark } from './BrandMark';
import { closePanel } from './panels';
import { StatusItems } from './StatusItems';
import { inkFor } from './ink';
import { useWallpaperKey } from './wallpaper';
import styles from './MenuBar.module.css';

/** The menu that is down: a title (`title:2`) or a status item (`battery`), and where it drops. */
export interface OpenMenu {
  key: string;
  keyboard: boolean;
  placement: MenuPlacement;
}

/** Props that make a button open its menu on mouse-down, like every menu bar item on a Mac. */
export type MenuButtonProps = ReturnType<ReturnType<typeof useMenuButtons>>;

/**
 * Kit render (Menu Bar Examples): a menu's text lines up with its title's
 * text, 16 pt in from the menu edge, and the menu starts 8.5 pt below the
 * 24 pt title. The first child of a title is its text (or glyph).
 */
function dropBelow(item: HTMLElement): MenuPlacement {
  const anchor = item.firstElementChild ?? item;
  const { bottom, right } = item.getBoundingClientRect();
  return { x: anchor.getBoundingClientRect().left - 16, y: bottom + 8.5, flipX: right + 4 };
}

function useMenuButtons(open: OpenMenu | null, show: (key: string, item: HTMLElement, keyboard: boolean) => void, hide: () => void) {
  const pointerType = useRef('mouse');
  const toggle = (key: string, item: HTMLElement, keyboard: boolean) => (open?.key === key ? hide() : show(key, item, keyboard));
  return (key: string) => ({
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open?.key === key,
    'data-menu': key,
    'data-selected': open?.key === key || undefined,
    // Focus stays in the open menu, not on the title.
    onMouseDown: (event: ReactMouseEvent) => event.preventDefault(),
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => {
      pointerType.current = event.pointerType;
      if (event.pointerType === 'mouse' && event.button === 0) toggle(key, event.currentTarget, false);
    },
    // While one menu is down, sliding along the bar opens the others.
    onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => {
      if (open && open.key !== key) show(key, event.currentTarget, false);
    },
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      if (event.detail === 0) toggle(key, event.currentTarget, true);
      else if (pointerType.current !== 'mouse') toggle(key, event.currentTarget, false);
    },
  });
}

/**
 * The macOS 27 menu bar (macos.md §6): transparent over the wallpaper, the
 * alpaca where the Apple logo goes, the active app's name in Heavy and its
 * menus in Semibold, status items and the clock on the right.
 */
export function MenuBar() {
  const app = useWindows((s) => s.focusedApp());
  const menus = useMemo<Menu[]>(() => [{ title: '', items: SYSTEM_MENU }, ...menusFor(app)], [app]);
  const [current, setOpen] = useState<OpenMenu | null>(null);
  const flash = useMenuFlash((s) => s.title);
  const ink = inkFor(useWallpaperKey());
  const bar = useRef<HTMLDivElement>(null);
  /** What had focus before the menus came down. */
  const returnTo = useRef<HTMLElement | null>(null);

  const hide = () => setOpen(null);
  useDismiss(current !== null, bar, hide, { escape: false });

  // The menus belong to the active app: when another app comes forward, whatever was down closes.
  useEffect(() => {
    let last = useWindows.getState().focusedApp();
    return useWindows.subscribe((state) => {
      const next = state.focusedApp();
      if (next === last) return;
      last = next;
      setOpen(null);
    });
  }, []);

  const show = (key: string, item: HTMLElement, keyboard: boolean) => {
    closePanel();
    if (!current) returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setOpen({ key, keyboard, placement: dropBelow(item) });
  };
  const bind = useMenuButtons(current, show, hide);

  /** The title or status item that opens menu `key`. */
  const opener = (key: string) => bar.current?.querySelector<HTMLElement>(`[data-menu="${key}"]`) ?? null;

  /** Escape: close and hand focus back to the title or status item, so the keyboard can carry on. */
  const dismiss = () => {
    const item = current && opener(current.key);
    setOpen(null);
    item?.focus({ preventScroll: true });
  };

  const step = (from: number, direction: -1 | 1) => {
    const next = (from + direction + menus.length) % menus.length;
    const title = opener(`title:${next}`);
    if (title) show(`title:${next}`, title, true);
  };

  const onTitlesKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const titles = [...event.currentTarget.querySelectorAll<HTMLElement>('[data-title]')];
    const index = titles.indexOf(event.target as HTMLElement);
    if (index < 0) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      titles[(index + (event.key === 'ArrowRight' ? 1 : -1) + titles.length) % titles.length]?.focus();
    } else if (event.key === 'ArrowDown') {
      show(`title:${index}`, titles[index]!, true);
    } else return;
    event.preventDefault();
  };

  const openTitle = current?.key.startsWith('title:') ? Number(current.key.slice(6)) : -1;
  const openMenu = menus[openTitle];

  return (
    <div ref={bar} className={styles.bar} data-ink={ink}>
      <div role="menubar" aria-label="메뉴 막대" className={styles.titles} onKeyDown={onTitlesKeyDown}>
        {menus.map((menu, index) => (
          <button
            key={index}
            type="button"
            role="menuitem"
            tabIndex={index === 0 ? 0 : -1}
            aria-label={index === 0 ? '알파카 메뉴' : undefined}
            data-title={index}
            className={[styles.item, index === 0 ? styles.logo : index === 1 ? styles.appName : ''].join(' ')}
            {...bind(`title:${index}`)}
            data-selected={current?.key === `title:${index}` || (index > 0 && flash === menu.title) || undefined}
          >
            {index === 0 ? <BrandMark height={18} /> : <span>{menu.title}</span>}
          </button>
        ))}
      </div>

      <StatusItems open={current} bind={bind} onHide={hide} onDismiss={dismiss} />

      {current && openMenu && (
        <MenuList
          key={current.key}
          entries={openMenu.items}
          label={openTitle === 0 ? '알파카 메뉴' : openMenu.title}
          placement={current.placement}
          isEnabled={canChoose}
          onChoose={(item) => {
            setOpen(null);
            // Focus goes back first: an Edit command then acts on that field, and a panel the item opens returns focus there.
            returnTo.current?.focus({ preventScroll: true });
            chooseItem(item);
          }}
          onDismiss={dismiss}
          onStep={(direction) => step(openTitle, direction)}
          highlightFirst={current.keyboard}
        />
      )}
    </div>
  );
}
