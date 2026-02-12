import { create } from 'zustand';

export type PageType =
  | 'about'
  | 'blog'
  | 'insta'
  | 'awards'
  | 'comatching'
  | 'share-it'
  | 'alnc';

export interface PageTab {
  id: PageType;
  title: string;
  icon: string;
}

type WindowType = 'pages' | 'folder';

export type FolderContentType = 'projects';

interface WindowBounds {
  position: { x: number; y: number };
  size: { w: number; h: number } | null;
}

interface BaseWindow {
  id: string;
  type: WindowType;
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { w: number; h: number } | null;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  prevBounds?: WindowBounds;
}

export interface PagesWindow extends BaseWindow {
  type: 'pages';
  tabs: PageTab[];
  activeTabId: PageType | null;
}

export interface FolderWindow extends BaseWindow {
  type: 'folder';
  contentType: FolderContentType;
}

export type AnyWindow = PagesWindow | FolderWindow;

const PAGE_WINDOW_ID = 'pages';

interface DesktopState {
  windows: AnyWindow[];
  activeWindowId: string | null;
  zIndexCounter: number;

  // -------- 오픈/포커스 ----------
  openPage: (tab: PageTab) => void;
  openFolder: (opts: {
    id?: string;
    title: string;
    icon: string;
    contentType: FolderContentType;
    initialPos?: { x: number; y: number };
  }) => void;

  // -------- 탭 제어 --------------
  setActiveTab: (tabId: PageType) => void;
  closeTab: (tabId: PageType) => void;
  closeActiveTab: () => void;
  moveTab: (fromIndex: number, toIndex: number) => void;

  // -------- 윈도우 제어 ----------
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleTaskbarItem: (id: string) => void;

  // -------- 위치/크기 -----------
  setWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  setWindowSize: (id: string, size: { w: number; h: number }) => void;

  // -------- 셀렉터 유틸 ----------
  getWindow: (id: string) => AnyWindow | undefined;
  getPagesWindow: () => PagesWindow | undefined;
  getTaskbarItems: () => {
    id: string;
    title: string;
    icon: string;
    isActive: boolean;
  }[];
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  zIndexCounter: 1000,

  // ------------- 유틸 ---------------
  getWindow: (id) => get().windows.find((w) => w.id === id),
  getPagesWindow: () =>
    get().windows.find((w) => w.id === PAGE_WINDOW_ID && w.type === 'pages') as
      | PagesWindow
      | undefined,
  getTaskbarItems: () => {
    const { windows, activeWindowId } = get();
    return windows
      .filter((w) => w.isOpen || w.isMinimized)
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((w) => ({
        id: w.id,
        title: w.title,
        icon: w.icon,
        isActive: !w.isMinimized && w.id === activeWindowId,
      }));
  },

  // ------------- 열기/포커스 -------
  openPage: (tab) => {
    let pages = get().getPagesWindow();

    if (!pages) {
      const nextZ = get().zIndexCounter + 1;
      const newPages: PagesWindow = {
        id: PAGE_WINDOW_ID,
        type: 'pages',
        title: 'Pages',
        icon: '/icons/pages.png',
        position: { x: 80, y: 80 },
        size: null,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: nextZ,
        tabs: [],
        activeTabId: null,
      };
      set((s) => ({
        windows: [...s.windows, newPages],
        zIndexCounter: nextZ,
        activeWindowId: PAGE_WINDOW_ID,
      }));
      pages = get().getPagesWindow();
    }

    set((s) => {
      const updated = s.windows.map((w) => {
        if (w.id !== PAGE_WINDOW_ID) return w;
        const pw = w as PagesWindow;
        const exists = pw.tabs.some((t) => t.id === tab.id);
        const nextTabs = exists ? pw.tabs : [...pw.tabs, tab];
        return {
          ...pw,
          tabs: nextTabs,
          activeTabId: tab.id,
          isOpen: true,
          isMinimized: false,
          zIndex: s.zIndexCounter + 1,
        };
      });
      return {
        windows: updated,
        zIndexCounter: s.zIndexCounter + 1,
        activeWindowId: PAGE_WINDOW_ID,
      };
    });
  },

  openFolder: ({
    id = 'folder:root',
    title,
    icon,
    contentType,
    initialPos,
  }) => {
    const { windows, zIndexCounter } = get();
    const existing = windows.find((w) => w.id === id) as
      | FolderWindow
      | undefined;

    if (existing) {
      set((s) => ({
        windows: s.windows.map((w) =>
          w.id === id
            ? {
                ...w,
                isOpen: true,
                isMinimized: false,
                zIndex: s.zIndexCounter + 1,
              }
            : w
        ),
        zIndexCounter: s.zIndexCounter + 1,
        activeWindowId: id,
      }));
      return;
    }

    const nextZ = zIndexCounter + 1;
    const folder: FolderWindow = {
      id,
      type: 'folder',
      title,
      icon,
      contentType,
      position: initialPos ?? { x: 120, y: 120 },
      size: null,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
    };

    set({
      windows: [...windows, folder],
      zIndexCounter: nextZ,
      activeWindowId: id,
    });
  },

  // ------------- 탭 제어 ----------
  setActiveTab: (tabId) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== PAGE_WINDOW_ID) return w;
        const pw = w as PagesWindow;
        if (!pw.tabs.some((t) => t.id === tabId)) return pw;
        return { ...pw, activeTabId: tabId, isMinimized: false };
      }),
      activeWindowId: PAGE_WINDOW_ID,
    }));
  },

  closeTab: (tabId) => {
    set((s) => {
      const updated = s.windows.map((w) => {
        if (w.id !== PAGE_WINDOW_ID) return w;
        const pw = w as PagesWindow;
        if (!pw.tabs.some((t) => t.id === tabId)) return pw;

        const nextTabs = pw.tabs.filter((t) => t.id !== tabId);
        const nextActive =
          pw.activeTabId === tabId
            ? nextTabs[nextTabs.length - 1]?.id ?? null
            : pw.activeTabId;

        return {
          ...pw,
          tabs: nextTabs,
          activeTabId: nextActive,
          isOpen: nextTabs.length > 0,
        };
      });

      const stillOpen = (
        updated.find((w) => w.id === PAGE_WINDOW_ID) as
          | PagesWindow
          | undefined
      )?.isOpen;

      return {
        windows: updated,
        activeWindowId: stillOpen
          ? s.activeWindowId
          : s.activeWindowId === PAGE_WINDOW_ID
            ? null
            : s.activeWindowId,
      };
    });
  },

  closeActiveTab: () => {
    const pages = get().getPagesWindow();
    if (!pages || !pages.activeTabId) return;
    get().closeTab(pages.activeTabId);
  },

  moveTab: (from, to) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== PAGE_WINDOW_ID) return w;
        const pw = w as PagesWindow;
        if (
          from < 0 ||
          from >= pw.tabs.length ||
          to < 0 ||
          to >= pw.tabs.length
        )
          return pw;
        const tabs = [...pw.tabs];
        const [moved] = tabs.splice(from, 1);
        tabs.splice(to, 0, moved);
        return { ...pw, tabs };
      }),
    }));
  },

  // ------------- 윈도우 제어 ----------
  focusWindow: (id) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: s.zIndexCounter + 1 }
          : w
      ),
      zIndexCounter: s.zIndexCounter + 1,
      activeWindowId: id,
    }));
  },

  minimizeWindow: (id) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (!w.isMaximized) {
          return {
            ...w,
            isMaximized: true,
            prevBounds: { position: w.position, size: w.size },
          };
        }
        return {
          ...w,
          isMaximized: false,
          position: w.prevBounds?.position ?? w.position,
          size: w.prevBounds?.size ?? w.size,
          prevBounds: undefined,
        };
      }),
    }));
  },

  closeWindow: (id) => {
    set((s) => {
      if (id === PAGE_WINDOW_ID) {
        const updated = s.windows.map((w) => {
          if (w.id !== PAGE_WINDOW_ID) return w;
          const pw = w as PagesWindow;
          return { ...pw, tabs: [], activeTabId: null, isOpen: false };
        });
        return {
          windows: updated,
          activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
        };
      }

      return {
        windows: s.windows.map((w) =>
          w.id === id ? { ...w, isOpen: false } : w
        ),
        activeWindowId: s.activeWindowId === id ? null : s.activeWindowId,
      };
    });
  },

  toggleTaskbarItem: (id) => {
    const w = get().getWindow(id);
    if (!w) return;
    if (w.isMinimized) {
      get().focusWindow(id);
    } else if (get().activeWindowId === id) {
      get().minimizeWindow(id);
    } else {
      get().focusWindow(id);
    }
  },

  // ------------- 위치/크기 ----------
  setWindowPosition: (id, pos) => {
    set((s) => ({
      windows: s.windows.map((w) =>
        w.id === id ? { ...w, position: pos } : w
      ),
    }));
  },
  setWindowSize: (id, size) => {
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, size } : w)),
    }));
  },
}));
