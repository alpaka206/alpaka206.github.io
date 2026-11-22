/**
 * Safari's tabs, each with its own back/forward list. Navigating inside a
 * framed page is invisible to the parent (cross-origin), so the list holds
 * the pages opened from the address field and the start page.
 */
export type Page = { kind: 'start' } | { kind: 'web'; url: string };

export interface Tab {
  id: number;
  history: Page[];
  index: number;
  /** Bumped by ⌘R; part of the frame's key so it loads again. */
  reloads: number;
}

export interface Tabs {
  tabs: Tab[];
  active: number;
  nextId: number;
}

export type TabAction =
  | { type: 'new'; page?: Page }
  | { type: 'close'; id: number }
  | { type: 'select'; id: number }
  | { type: 'go'; page: Page }
  | { type: 'back' }
  | { type: 'forward' }
  | { type: 'reload' };

export const START: Page = { kind: 'start' };

const tab = (id: number, page: Page): Tab => ({ id, history: [page], index: 0, reloads: 0 });

export const initialTabs = (page: Page = START): Tabs => ({ tabs: [tab(1, page)], active: 1, nextId: 2 });

export const activeTab = (state: Tabs): Tab => state.tabs.find((t) => t.id === state.active) ?? state.tabs[0]!;

export const currentPage = (t: Tab): Page => t.history[t.index] ?? START;

const updateActive = (state: Tabs, change: (t: Tab) => Tab): Tabs => ({
  ...state,
  tabs: state.tabs.map((t) => (t.id === state.active ? change(t) : t)),
});

export function reduceTabs(state: Tabs, action: TabAction): Tabs {
  switch (action.type) {
    case 'new':
      return { tabs: [...state.tabs, tab(state.nextId, action.page ?? START)], active: state.nextId, nextId: state.nextId + 1 };
    case 'close': {
      const index = state.tabs.findIndex((t) => t.id === action.id);
      if (index < 0) return state;
      const tabs = state.tabs.filter((t) => t.id !== action.id);
      // Closing the last tab leaves a start page, as a window with no tabs cannot exist.
      if (!tabs.length) return { tabs: [tab(state.nextId, START)], active: state.nextId, nextId: state.nextId + 1 };
      const active = state.active === action.id ? (tabs[Math.min(index, tabs.length - 1)]?.id ?? state.active) : state.active;
      return { ...state, tabs, active };
    }
    case 'select':
      return state.tabs.some((t) => t.id === action.id) ? { ...state, active: action.id } : state;
    case 'go':
      return updateActive(state, (t) => ({ ...t, history: [...t.history.slice(0, t.index + 1), action.page], index: t.index + 1 }));
    case 'back':
      return updateActive(state, (t) => ({ ...t, index: Math.max(0, t.index - 1) }));
    case 'forward':
      return updateActive(state, (t) => ({ ...t, index: Math.min(t.history.length - 1, t.index + 1) }));
    case 'reload':
      return updateActive(state, (t) => ({ ...t, reloads: t.reloads + 1 }));
  }
}
