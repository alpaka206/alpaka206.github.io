import { create } from 'zustand';
import { APPS, windowIdFor, type AppId, type AppProps } from './apps';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** An element's box on screen, as a window origin or animation target. */
export const toRect = ({ x, y, width, height }: DOMRectReadOnly): Rect => ({ x, y, w: width, h: height });

/** normal | zoomed (green button fills the screen) | tiled to one half. */
export type Placement = 'normal' | 'zoomed' | 'left' | 'right';

export interface WindowModel<A extends AppId = AppId> {
  id: string;
  app: A;
  props: Partial<AppProps[A]>;
  /** Where the window sits when it is not zoomed or tiled. */
  rect: Rect;
  placement: Placement;
  minimized: boolean;
  /** Hidden with ⌘H; comes back with the app. */
  hidden: boolean;
  /** Screen rect the window grows out of when it opens (a Dock or desktop icon). */
  origin?: Rect;
}

export interface WindowsState {
  /** Back to front: the last window is on top. */
  windows: WindowModel[];
  /** Usable desktop area (below the menu bar, above the Dock). */
  area: Rect;
}

const CASCADE = 22;

/** Pure transitions, exported for tests; the store below only wires them up. */
export const reduce = {
  open<A extends AppId>(state: WindowsState, app: A, props: Partial<AppProps[A]> = {}, origin?: Rect): WindowsState {
    const id = windowIdFor(app, props);
    const existing = state.windows.find((w) => w.id === id);
    if (existing) return reduce.focus(reduce.update(state, id, { props: { ...existing.props, ...props } }), id);
    const { defaultSize } = APPS[app];
    const w = Math.min(defaultSize.w, state.area.w - 40);
    const h = Math.min(defaultSize.h, state.area.h - 20);
    // Centre the first window; cascade later ones down and to the right, wrapping before the edge.
    const visible = state.windows.filter((win) => !win.minimized && !win.hidden).length;
    const centre = { x: state.area.x + (state.area.w - w) / 2, y: state.area.y + Math.max(0, (state.area.h - h) / 3) };
    const step = visible % 6;
    const rect = {
      x: Math.round(Math.min(centre.x + step * CASCADE, state.area.x + state.area.w - w)),
      y: Math.round(Math.min(centre.y + step * CASCADE, state.area.y + state.area.h - h)),
      w,
      h,
    };
    const window: WindowModel = { id, app, props, rect, placement: 'normal', minimized: false, hidden: false, origin };
    return { ...state, windows: [...state.windows, window] };
  },

  focus(state: WindowsState, id: string): WindowsState {
    const target = state.windows.find((w) => w.id === id);
    if (!target) return state;
    const updated = { ...target, minimized: false, hidden: false };
    return { ...state, windows: [...state.windows.filter((w) => w.id !== id), updated] };
  },

  /** 윈도우 › 모두 앞으로 가져오기: the app's visible windows move above every other app's, in their own order. */
  raiseApp(state: WindowsState, app: AppId): WindowsState {
    const raised = state.windows.filter((w) => w.app === app && !w.minimized && !w.hidden);
    return { ...state, windows: [...state.windows.filter((w) => !raised.includes(w)), ...raised] };
  },

  update(state: WindowsState, id: string, patch: Partial<WindowModel>): WindowsState {
    return { ...state, windows: state.windows.map((w) => (w.id === id ? { ...w, ...patch } : w)) };
  },

  close(state: WindowsState, id: string): WindowsState {
    return { ...state, windows: state.windows.filter((w) => w.id !== id) };
  },

  quit(state: WindowsState, app: AppId): WindowsState {
    return { ...state, windows: state.windows.filter((w) => w.app !== app) };
  },

  /** Green button / double-click on the title bar: fill the area, or go back. */
  toggleZoom(state: WindowsState, id: string): WindowsState {
    const target = state.windows.find((w) => w.id === id);
    if (!target) return state;
    return reduce.update(state, id, { placement: target.placement === 'normal' ? 'zoomed' : 'normal' });
  },

  hideApp(state: WindowsState, app: AppId, others = false): WindowsState {
    return {
      ...state,
      windows: state.windows.map((w) => ((others ? w.app !== app : w.app === app) ? { ...w, hidden: true } : w)),
    };
  },

  showAll(state: WindowsState): WindowsState {
    return { ...state, windows: state.windows.map((w) => ({ ...w, hidden: false })) };
  },
};

/** The rect a window actually occupies given its placement (`rect` only matters while it is 'normal'). */
export function frameOf(window: Pick<WindowModel, 'placement' | 'rect'>, area: Rect): Rect {
  const gap = 6;
  switch (window.placement) {
    case 'zoomed':
      return { x: area.x + gap, y: area.y + gap, w: area.w - gap * 2, h: area.h - gap * 2 };
    case 'left':
      return { x: area.x + gap, y: area.y + gap, w: area.w / 2 - gap * 1.5, h: area.h - gap * 2 };
    case 'right':
      return { x: area.x + area.w / 2 + gap / 2, y: area.y + gap, w: area.w / 2 - gap * 1.5, h: area.h - gap * 2 };
    default:
      return window.rect;
  }
}

/** The frontmost visible window. */
export const topWindow = (windows: readonly WindowModel[]) =>
  windows.findLast((w) => !w.minimized && !w.hidden);

interface WindowActions {
  setArea: (area: Rect) => void;
  open: <A extends AppId>(app: A, props?: Partial<AppProps[A]>, origin?: Rect) => void;
  focus: (id: string) => void;
  close: (id: string) => void;
  quit: (app: AppId) => void;
  minimize: (id: string) => void;
  toggleZoom: (id: string) => void;
  place: (id: string, placement: Placement) => void;
  setRect: (id: string, rect: Rect) => void;
  /** A window now shows something else (Finder went to another folder): keeps the address bar and reloads honest. */
  setProps: <A extends AppId>(id: string, props: Partial<AppProps[A]>) => void;
  hideApp: (app: AppId, others?: boolean) => void;
  showAll: () => void;
  raiseApp: (app: AppId) => void;
  /** Focus nothing: the desktop (Finder) becomes the active app. */
  blur: () => void;
  focusedApp: () => AppId;
}

export const useWindows = create<WindowsState & { desktopFocused: boolean } & WindowActions>((set, get) => {
  const apply = (next: (s: WindowsState) => WindowsState, desktopFocused = false) =>
    set((s) => ({ ...next(s), desktopFocused }));

  return {
    windows: [],
    area: { x: 0, y: 0, w: 1440, h: 900 },
    desktopFocused: true,
    setArea: (area) => set({ area }),
    open: (app, props, origin) => apply((s) => reduce.open(s, app, props, origin)),
    focus: (id) => apply((s) => reduce.focus(s, id)),
    close: (id) => apply((s) => reduce.close(s, id)),
    quit: (app) => apply((s) => reduce.quit(s, app)),
    minimize: (id) => apply((s) => reduce.update(s, id, { minimized: true }), true),
    toggleZoom: (id) => apply((s) => reduce.toggleZoom(s, id)),
    place: (id, placement) => apply((s) => reduce.update(s, id, { placement })),
    setRect: (id, rect) => apply((s) => reduce.update(s, id, { rect, placement: 'normal' })),
    setProps: (id, props) =>
      set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, props: { ...w.props, ...props } } : w)) })),
    hideApp: (app, others) => apply((s) => reduce.hideApp(s, app, others), !others),
    showAll: () => apply(reduce.showAll),
    raiseApp: (app) => apply((s) => reduce.raiseApp(s, app)),
    blur: () => set({ desktopFocused: true }),
    focusedApp: () => {
      const { windows, desktopFocused } = get();
      return desktopFocused ? 'finder' : (topWindow(windows)?.app ?? 'finder');
    },
  };
});

/**
 * The window menu commands and shortcuts act on. None while the desktop is
 * active: there ⌘O opens the desktop's selection, not the Finder window in front.
 */
export function focusedWindowId() {
  const { windows, desktopFocused } = useWindows.getState();
  return desktopFocused ? undefined : topWindow(windows)?.id;
}
