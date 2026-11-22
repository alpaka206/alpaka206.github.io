/**
 * Menu items and keyboard shortcuts both resolve to command ids, so a shortcut
 * is just a menu item's key equivalent (as on macOS). Global commands live
 * here; app windows register their own handlers while they are focused.
 */
type Handler = () => void;

const global = new Map<string, Handler>();
const scoped = new Map<string, Map<string, Handler>>();

export function registerCommand(id: string, handler: Handler) {
  global.set(id, handler);
  return () => {
    if (global.get(id) === handler) global.delete(id);
  };
}

/** Registers several global commands; returns one disposer for all of them. */
export function registerCommands(commands: Record<string, Handler>) {
  const disposers = Object.entries(commands).map(([id, run]) => registerCommand(id, run));
  return () => disposers.forEach((dispose) => dispose());
}

/** Handlers that only run while `windowId` is the focused window. */
export function registerWindowCommand(windowId: string, id: string, handler: Handler) {
  const map = scoped.get(windowId) ?? new Map<string, Handler>();
  map.set(id, handler);
  scoped.set(windowId, map);
  return () => {
    if (map.get(id) === handler) map.delete(id);
    if (!map.size) scoped.delete(windowId);
  };
}

/** Runs the focused window's handler first, then the global one. Returns false when nobody handles it. */
export function runCommand(id: string, focusedWindowId?: string): boolean {
  const handler = (focusedWindowId && scoped.get(focusedWindowId)?.get(id)) || global.get(id);
  if (!handler) return false;
  handler();
  return true;
}

export function canRun(id: string, focusedWindowId?: string) {
  return Boolean((focusedWindowId && scoped.get(focusedWindowId)?.has(id)) || global.has(id));
}
