import { canRun, runCommand } from '@/os/commands';
import type { MenuItem } from '@/os/menus';
import { focusedWindowId } from '@/os/windows';

/**
 * macOS greys out an item with no target: no command, nobody handling it,
 * or a window command while no window is key. A submenu is live when any
 * of its items is.
 */
export function canChoose(item: MenuItem): boolean {
  if (item.submenu) return item.submenu.some((entry) => entry !== 'separator' && canChoose(entry));
  if (!item.command) return false;
  const focused = focusedWindowId();
  if (item.command.startsWith('window.') && !focused) return false;
  return canRun(item.command, focused);
}

export function chooseItem(item: MenuItem) {
  if (item.command) runCommand(item.command, focusedWindowId());
}
