import { create } from 'zustand';
import {
  BROWSER_APPS,
  CODE_WORKSPACES,
  STICKY_NOTE_ICON,
} from '@/features/desktop/config/shell';
import type {
  AnyWindow,
  BrowserAppId,
  BrowserWindow,
  CodeWindow,
  CodeWorkspaceId,
  FolderContentType,
  FolderWindow,
  NoteWindow,
  PageTab,
  PageType,
  PagesWindow,
} from './desktopModels';

export type {
  AnyWindow,
  BrowserAppId,
  BrowserWindow,
  CodeWorkspaceId,
  CodeWindow,
  FolderContentType,
  FolderWindow,
  NoteWindow,
  PageTab,
  PageType,
  PagesWindow,
} from './desktopModels';

const PAGE_WINDOW_ID = 'pages';
const WINDOW_CASCADE = [
  { x: 80, y: 80 },
  { x: 118, y: 110 },
  { x: 156, y: 142 },
  { x: 194, y: 174 },
] as const;

function getNextWindowPosition(windowCount: number) {
  return WINDOW_CASCADE[windowCount % WINDOW_CASCADE.length];
}

interface DesktopState {
  windows: AnyWindow[];
  activeWindowId: string | null;
  zIndexCounter: number;

  openPage: (tab: PageTab) => void;
  openFolder: (opts: {
    id?: string;
    title: string;
    icon: string;
    contentType: FolderContentType;
    folderId?: string;
    initialPos?: { x: number; y: number };
  }) => void;
  openBrowser: (browserAppId: BrowserAppId) => void;
  openCodeWorkspace: (workspaceId: CodeWorkspaceId) => void;
  openNoteWindow: (noteId: string) => void;

  setActiveTab: (tabId: PageType) => void;
  closeTab: (tabId: PageType) => void;
  closeActiveTab: () => void;
  moveTab: (fromIndex: number, toIndex: number) => void;

  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleTaskbarItem: (id: string) => void;
  resetWindows: () => void;

  setWindowPosition: (id: string, pos: { x: number; y: number }) => void;
  setWindowSize: (id: string, size: { w: number; h: number }) => void;

  getWindow: (id: string) => AnyWindow | undefined;
  getPagesWindow: () => PagesWindow | undefined;
}

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  zIndexCounter: 1000,

  getWindow: (id) => get().windows.find((w) => w.id === id),
  getPagesWindow: () =>
    get().windows.find((w) => w.id === PAGE_WINDOW_ID && w.type === 'pages') as
      | PagesWindow
      | undefined,

  openPage: (tab) => {
    let pages = get().getPagesWindow();

    if (!pages) {
      const nextZ = get().zIndexCounter + 1;
      const newPages: PagesWindow = {
        id: PAGE_WINDOW_ID,
        type: 'pages',
        title: tab.title,
        icon: tab.icon,
        position: getNextWindowPosition(get().windows.length),
        size: { w: 1080, h: 720 },
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
          title: tab.title,
          icon: tab.icon,
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
    folderId,
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
                title,
                icon,
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
    const folderWindow: FolderWindow = {
      id,
      type: 'folder',
      title,
      icon,
      contentType,
      folderId: folderId ?? id,
      position: initialPos ?? getNextWindowPosition(windows.length),
      size: { w: 780, h: 560 },
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
    };

    set({
      windows: [...windows, folderWindow],
      zIndexCounter: nextZ,
      activeWindowId: id,
    });
  },

  openBrowser: (browserAppId) => {
    const app = BROWSER_APPS[browserAppId];
    const id = `browser:${browserAppId}`;
    const existing = get().getWindow(id) as BrowserWindow | undefined;

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

    const nextZ = get().zIndexCounter + 1;
    const browserWindow: BrowserWindow = {
      id,
      type: 'browser',
      browserAppId,
      title: app.title,
      icon: app.icon,
      url: app.url,
      position: getNextWindowPosition(get().windows.length),
      size: { w: 1040, h: 700 },
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
    };

    set((s) => ({
      windows: [...s.windows, browserWindow],
      zIndexCounter: nextZ,
      activeWindowId: id,
    }));
  },

  openCodeWorkspace: (workspaceId) => {
    const workspace = CODE_WORKSPACES[workspaceId];
    const id = `code:${workspaceId}`;
    const existing = get().getWindow(id) as CodeWindow | undefined;

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

    const nextZ = get().zIndexCounter + 1;
    const codeWindow: CodeWindow = {
      id,
      type: 'code',
      workspaceId,
      title: workspace.title,
      icon: workspace.icon,
      owner: workspace.owner,
      repo: workspace.repo,
      branch: workspace.branch,
      path: workspace.path,
      position: getNextWindowPosition(get().windows.length),
      size: { w: 1120, h: 740 },
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
    };

    set((s) => ({
      windows: [...s.windows, codeWindow],
      zIndexCounter: nextZ,
      activeWindowId: id,
    }));
  },

  openNoteWindow: (noteId) => {
    const id = `note:${noteId}`;
    const existing = get().getWindow(id) as NoteWindow | undefined;

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

    const nextZ = get().zIndexCounter + 1;
    const noteWindow: NoteWindow = {
      id,
      type: 'note',
      noteId,
      title: 'Sticky Note',
      icon: STICKY_NOTE_ICON,
      position: getNextWindowPosition(get().windows.length),
      size: { w: 560, h: 460 },
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
    };

    set((s) => ({
      windows: [...s.windows, noteWindow],
      zIndexCounter: nextZ,
      activeWindowId: id,
    }));
  },

  setActiveTab: (tabId) => {
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== PAGE_WINDOW_ID) return w;
        const pw = w as PagesWindow;
        if (!pw.tabs.some((t) => t.id === tabId)) return pw;
        const activeTab = pw.tabs.find((t) => t.id === tabId) ?? pw.tabs[0];
        return {
          ...pw,
          title: activeTab?.title ?? pw.title,
          icon: activeTab?.icon ?? pw.icon,
          activeTabId: tabId,
          isMinimized: false,
        };
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
        const activeTab =
          nextTabs.find((t) => t.id === nextActive) ?? nextTabs[nextTabs.length - 1];

        return {
          ...pw,
          title: activeTab?.title ?? 'Pages',
          icon: activeTab?.icon ?? pw.icon,
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
        ) {
          return pw;
        }
        const tabs = [...pw.tabs];
        const [moved] = tabs.splice(from, 1);
        tabs.splice(to, 0, moved);
        return { ...pw, tabs };
      }),
    }));
  },

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
          return {
            ...pw,
            title: 'Pages',
            tabs: [],
            activeTabId: null,
            isOpen: false,
          };
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

  resetWindows: () =>
    set({
      windows: [],
      activeWindowId: null,
    }),

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
