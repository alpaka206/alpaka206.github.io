import { useEffect, useRef } from 'react';
import type { MenuItem } from '@/os/menus';
import { canChoose, chooseItem } from './menuCommands';
import { closeContextMenu, useContextMenu } from './contextMenu';
import { MenuList } from './MenuList';
import { useDismiss } from './useDismiss';
import styles from './ContextMenuHost.module.css';

/** A request that brings its own handler runs whatever it lists; otherwise items need a live command. */
const hasCommand = (item: MenuItem): boolean =>
  item.submenu ? item.submenu.some((entry) => entry !== 'separator' && hasCommand(entry)) : Boolean(item.command);

/** Shows the one open context menu (desktop icons, Dock, Finder) at the pointer, kept on screen. */
export function ContextMenuHost() {
  const request = useContextMenu((s) => s.request);
  const layer = useRef<HTMLDivElement>(null);
  useDismiss(request !== null, layer, closeContextMenu, { scroll: true, escape: false });

  // Keyboard focus goes back to whatever had it before the menu opened.
  useEffect(() => {
    let returnTo: Element | null = null;
    return useContextMenu.subscribe((state, previous) => {
      if (state.request && !previous.request) returnTo = document.activeElement;
      if (!state.request && previous.request && returnTo instanceof HTMLElement) {
        const target = returnTo;
        requestAnimationFrame(() => {
          if (!document.activeElement || document.activeElement === document.body) target.focus({ preventScroll: true });
        });
      }
    });
  }, []);

  if (!request) return null;
  const { x, y, entries, onCommand } = request;

  return (
    <div ref={layer} className={styles.layer}>
      <MenuList
        key={`${x}:${y}`}
        entries={entries}
        label="단축 메뉴"
        placement={{ x, y, flipX: x, flipY: y }}
        isEnabled={onCommand ? hasCommand : canChoose}
        onChoose={(item) => {
          closeContextMenu();
          if (onCommand && item.command) onCommand(item.command);
          else chooseItem(item);
        }}
        onDismiss={closeContextMenu}
      />
    </div>
  );
}
