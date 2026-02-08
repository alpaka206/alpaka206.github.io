import { useDesktopStore } from '@/stores';
import { useMemo } from 'react';
import type { PagesWindow, PageType } from '@/stores';
import { useShallow } from 'zustand/shallow';

type TaskbarItem =
  | {
      kind: 'tab';
      id: string;
      icon: string;
      tabId: PageType;
      isActive: boolean;
    }
  | {
      kind: 'folder';
      id: string;
      icon: string;
      isActive: boolean;
    };

export function TaskbarInline() {
  const {
    windows,
    activeWindowId,
    toggleTaskbarItem,
    setActiveTab,
    focusWindow,
    minimizeWindow,
  } = useDesktopStore(
    useShallow((s) => ({
      windows: s.windows,
      activeWindowId: s.activeWindowId,
      toggleTaskbarItem: s.toggleTaskbarItem,
      setActiveTab: s.setActiveTab,
      focusWindow: s.focusWindow,
      minimizeWindow: s.minimizeWindow,
    }))
  );

  const pages = windows.find((w) => w.type === 'pages') as
    | PagesWindow
    | undefined;

  const items = useMemo(() => {
    const arr: TaskbarItem[] = [];

    if (pages && (pages.isOpen || pages.isMinimized)) {
      for (const t of pages.tabs) {
        arr.push({
          kind: 'tab',
          id: `pages:${t.id}`,
          icon: t.icon,
          tabId: t.id,
          isActive:
            !pages.isMinimized &&
            activeWindowId === pages.id &&
            pages.activeTabId === t.id,
        });
      }
    }

    for (const w of windows) {
      if (w.type === 'folder' && (w.isOpen || w.isMinimized)) {
        arr.push({
          kind: 'folder',
          id: w.id,
          icon: w.icon,
          isActive: !w.isMinimized && activeWindowId === w.id,
        });
      }
    }

    return arr;
  }, [windows, pages, activeWindowId]);

  const handleClick = (it: TaskbarItem) => {
    if (it.kind === 'tab') {
      if (!pages) return;
      if (pages.isMinimized) {
        setActiveTab(it.tabId);
        focusWindow(pages.id);
        return;
      }
      if (activeWindowId === pages.id && pages.activeTabId === it.tabId) {
        minimizeWindow(pages.id);
        return;
      }
      setActiveTab(it.tabId);
      focusWindow(pages.id);
    } else {
      toggleTaskbarItem(it.id);
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 z-[9999] h-12 backdrop-blur bg-black/30 border-t border-white/10 flex items-center px-2 gap-2 pointer-events-auto'>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => handleClick(it)}
          className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10 transition ${
            it.isActive ? 'bg-white/15 outline outline-1 outline-white/25' : ''
          }`}
        >
          <img
            src={it.icon}
            alt=''
            className='w-8 h-8 object-contain rounded-sm'
          />
        </button>
      ))}
    </div>
  );
}
