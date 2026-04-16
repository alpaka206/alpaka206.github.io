import { useMemo, useState } from 'react';
import {
  BATTERY_ICON,
  BROWSER_APPS,
  PINNED_APPS,
  START_MENU_APPS,
  WALLPAPERS,
  WIFI_ICON,
  WINDOWS_ICON,
  VOLUME_ICON,
} from '@/features/desktop/config/shell';
import { useClock } from '@/hooks/useClock';
import { useVisitorCount } from '@/hooks/useVisitorCount';
import {
  useDesktopLayoutStore,
  useDesktopNotesStore,
  useDesktopPreferencesStore,
  useDesktopStore,
} from '@/stores';
import type { AnyWindow, PagesWindow } from '@/stores';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';
import { playSystemSound } from '@/utils/systemSounds';
import { useShallow } from 'zustand/shallow';

type TaskbarButtonStatus = 'idle' | 'running' | 'active';

function formatTaskbarTime(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
}

function formatTaskbarDate(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
  }).format(now);
}

function formatPanelDate(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

function TaskbarButton({
  icon,
  label,
  status = 'idle',
  onClick,
}: {
  icon: string;
  label: string;
  status?: TaskbarButtonStatus;
  onClick: () => void;
}) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={[
        'grid size-11 place-items-center rounded-[14px] border transition-colors',
        status === 'active'
          ? 'border-white/18 bg-white/18 shadow-[0_10px_24px_rgba(15,23,42,0.16)]'
          : status === 'running'
            ? 'border-transparent bg-white/8'
            : 'border-transparent hover:bg-white/10',
      ].join(' ')}
    >
      <img src={icon} alt='' className='pointer-events-none h-7 w-7 object-contain' />
    </button>
  );
}

function StartMenu({
  onLaunch,
}: {
  onLaunch: (launch: (typeof START_MENU_APPS)[number]['launch']) => void;
}) {
  return (
    <div className='absolute bottom-16 left-3 z-[9999] w-[340px] rounded-[28px] border border-white/15 bg-[#0d1118]/88 p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.55)] backdrop-blur-3xl'>
      <div className='rounded-[22px] border border-white/10 bg-white/6 px-4 py-4'>
        <div className='text-[14px] text-white/70'>Kim GyuWon</div>
        <div className='mt-1 text-[24px] font-semibold tracking-[-0.03em]'>
          Start
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-3'>
        {START_MENU_APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => onLaunch(app.launch)}
            className='rounded-[20px] border border-white/10 bg-white/6 p-4 text-left transition-colors hover:bg-white/10'
          >
            <img
              src={app.icon}
              alt=''
              className='h-9 w-9 rounded-xl object-contain'
            />
            <div className='mt-3 text-sm font-semibold text-white'>
              {app.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function QuickPanel({
  now,
  visitorCount,
  onReset,
}: {
  now: Date;
  visitorCount: number | null;
  onReset: () => void;
}) {
  const wallpaperId = useDesktopPreferencesStore((s) => s.wallpaperId);
  const setWallpaper = useDesktopPreferencesStore((s) => s.setWallpaper);
  const soundEnabled = useDesktopPreferencesStore((s) => s.soundEnabled);
  const toggleSound = useDesktopPreferencesStore((s) => s.toggleSound);

  return (
    <div className='absolute bottom-16 right-3 z-[9999] w-[360px] rounded-[28px] border border-white/15 bg-[#0d1118]/88 p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.55)] backdrop-blur-3xl'>
      <div className='rounded-[22px] border border-white/10 bg-white/6 px-4 py-4'>
        <div className='text-[34px] font-semibold tracking-[-0.04em]'>
          {formatTaskbarTime(now)}
        </div>
        <div className='mt-1 text-sm text-white/70'>{formatPanelDate(now)}</div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-3'>
        <div className='rounded-[20px] border border-white/10 bg-white/6 p-4'>
          <div className='text-[12px] uppercase tracking-[0.16em] text-white/50'>
            Visitors
          </div>
          <div className='mt-2 text-[24px] font-semibold'>
            {visitorCount !== null ? visitorCount.toLocaleString() : 'Hidden'}
          </div>
        </div>
        <button
          onClick={() => {
            toggleSound();
            playSystemSound('click');
          }}
          className='rounded-[20px] border border-white/10 bg-white/6 p-4 text-left transition-colors hover:bg-white/10'
        >
          <div className='text-[12px] uppercase tracking-[0.16em] text-white/50'>
            Sound
          </div>
          <div className='mt-2 text-[18px] font-semibold'>
            {soundEnabled ? 'On' : 'Off'}
          </div>
        </button>
      </div>

      <div className='mt-4 rounded-[22px] border border-white/10 bg-white/6 p-4'>
        <div className='text-[12px] uppercase tracking-[0.16em] text-white/50'>
          Wallpaper
        </div>
        <div className='mt-3 grid grid-cols-3 gap-2'>
          {Object.values(WALLPAPERS).map((wallpaper) => (
            <button
              key={wallpaper.id}
              onClick={() => {
                setWallpaper(wallpaper.id);
                playSystemSound('click');
              }}
              className={[
                'overflow-hidden rounded-2xl border p-1 text-left transition-colors',
                wallpaper.id === wallpaperId
                  ? 'border-[#7dc1ff] bg-white/12'
                  : 'border-white/10 hover:bg-white/8',
              ].join(' ')}
            >
              <div
                className='h-14 rounded-xl'
                style={wallpaper.style}
              />
              <div className='px-1 pb-1 pt-2 text-[12px] text-white/80'>
                {wallpaper.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className='mt-4 w-full rounded-[18px] border border-[#f87171]/30 bg-[#ef4444]/15 px-4 py-3 text-left text-sm font-semibold text-[#fecaca] transition-colors hover:bg-[#ef4444]/20'
      >
        Reset Desktop
      </button>
    </div>
  );
}

export function TaskbarInline() {
  const now = useClock();
  const visitorCount = useVisitorCount();
  const {
    windows,
    activeWindowId,
    toggleTaskbarItem,
    openPage,
    openFolder,
    openBrowser,
    openCodeWorkspace,
    openNoteWindow,
    resetWindows,
  } = useDesktopStore(
    useShallow((s) => ({
      windows: s.windows,
      activeWindowId: s.activeWindowId,
      toggleTaskbarItem: s.toggleTaskbarItem,
      openPage: s.openPage,
      openFolder: s.openFolder,
      openBrowser: s.openBrowser,
      openCodeWorkspace: s.openCodeWorkspace,
      openNoteWindow: s.openNoteWindow,
      resetWindows: s.resetWindows,
    }))
  );
  const createNote = useDesktopNotesStore((s) => s.createNote);
  const resetNotes = useDesktopNotesStore((s) => s.resetNotes);
  const resetLayout = useDesktopLayoutStore((s) => s.resetLayout);
  const resetPreferences = useDesktopPreferencesStore((s) => s.resetPreferences);

  const [startOpen, setStartOpen] = useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);

  const runningItems = useMemo(() => {
    return windows
      .filter((window) => {
        if (!window.isOpen && !window.isMinimized) {
          return false;
        }

        if (window.type === 'folder' && window.id === 'folder:projects') {
          return false;
        }

        if (window.type === 'browser' && window.browserAppId === 'browser-home') {
          return false;
        }

        if (window.type === 'code' && window.workspaceId === 'portfolio-workspace') {
          return false;
        }

        if (window.type === 'pages' && window.activeTabId === 'about') {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);
  const pagesWindow = windows.find(
    (window): window is PagesWindow => window.type === 'pages'
  );

  const toggleQuickPanel = () => {
    setQuickPanelOpen((value) => !value);
    setStartOpen(false);
    playSystemSound('click');
  };

  const launchFromMenu = (
    launch: (typeof START_MENU_APPS)[number]['launch']
  ) => {
    setStartOpen(false);
    switch (launch.kind) {
      case 'page':
        openPage(PAGE_TABS[launch.pageId]);
        break;
      case 'folder':
        openFolder({
          id: `folder:${launch.folderId}`,
          folderId: launch.folderId,
          title: launch.folderId === 'projects' ? 'Projects' : 'Folder',
          icon:
            launch.folderId === 'recycle-bin'
              ? '/assets/common/desktop/folder-shortcut.webp'
              : '/assets/common/desktop/folder-shortcut.webp',
          contentType:
            launch.folderId === 'projects' ? 'projects' : 'user-folder',
        });
        break;
      case 'browser':
        openBrowser(launch.browserAppId);
        break;
      case 'code':
        openCodeWorkspace(launch.workspaceId);
        break;
      case 'note-create': {
        const id = createNote(
          { x: 320, y: 180 },
          {
            surfaceVisible: false,
            title: 'Untitled Note',
          }
        );
        openNoteWindow(id);
        break;
      }
    }
    playSystemSound('open');
  };

  const handlePinnedClick = (pin: (typeof PINNED_APPS)[number]) => {
    if (
      pin.launch.kind === 'page' &&
      pagesWindow?.type === 'pages' &&
      pagesWindow.activeTabId === pin.launch.pageId &&
      activeWindowId === pagesWindow.id
    ) {
      toggleTaskbarItem(pagesWindow.id);
      return;
    }

    const windowId =
      pin.launch.kind === 'browser'
        ? `browser:${pin.launch.browserAppId}`
        : pin.launch.kind === 'folder'
          ? `folder:${pin.launch.folderId}`
          : pin.launch.kind === 'code'
            ? `code:${pin.launch.workspaceId}`
            : null;

    if (windowId && windows.some((window) => window.id === windowId)) {
      toggleTaskbarItem(windowId);
      return;
    }

    if (pin.launch.kind === 'page') {
      openPage(PAGE_TABS[pin.launch.pageId]);
    } else if (pin.launch.kind === 'folder') {
      openFolder({
        id: `folder:${pin.launch.folderId}`,
        folderId: pin.launch.folderId,
        title: 'Projects',
        icon: '/assets/common/desktop/folder-shortcut.webp',
        contentType: 'projects',
      });
    } else if (pin.launch.kind === 'browser') {
      openBrowser(pin.launch.browserAppId);
    } else if (pin.launch.kind === 'code') {
      openCodeWorkspace(pin.launch.workspaceId);
    }
    playSystemSound('open');
  };

  const getPinStatus = (
    pin: (typeof PINNED_APPS)[number]
  ): TaskbarButtonStatus => {
    if (pin.launch.kind === 'page') {
      const hasTab =
        pagesWindow?.type === 'pages' &&
        pagesWindow.tabs.some((tab) => tab.id === pin.launch.pageId);
      const isActive =
        activeWindowId === pagesWindow?.id &&
        pagesWindow?.type === 'pages' &&
        pagesWindow.activeTabId === pin.launch.pageId;
      return isActive ? 'active' : hasTab ? 'running' : 'idle';
    }

    const matchedWindow = windows.find((window) => {
      if (!window.isOpen && !window.isMinimized) {
        return false;
      }

      if (pin.launch.kind === 'folder') {
        return window.id === `folder:${pin.launch.folderId}`;
      }

      if (pin.launch.kind === 'browser') {
        return (
          window.type === 'browser' &&
          window.browserAppId === pin.launch.browserAppId
        );
      }

      if (pin.launch.kind === 'code') {
        return (
          window.type === 'code' &&
          window.workspaceId === pin.launch.workspaceId
        );
      }

      return false;
    });

    if (!matchedWindow) {
      return 'idle';
    }

    return activeWindowId === matchedWindow.id && !matchedWindow.isMinimized
      ? 'active'
      : 'running';
  };

  const handleRunningClick = (window: AnyWindow) => {
    toggleTaskbarItem(window.id);
    playSystemSound('click');
  };

  const resetDesktop = () => {
    resetLayout();
    resetNotes();
    resetPreferences();
    resetWindows();
    setQuickPanelOpen(false);
    playSystemSound('click');
  };

  return (
    <>
      {startOpen || quickPanelOpen ? (
        <button
          aria-hidden
          className='fixed inset-0 z-[9997] bg-transparent'
          onClick={() => {
            setStartOpen(false);
            setQuickPanelOpen(false);
          }}
        />
      ) : null}

      <div className='fixed bottom-0 left-0 right-0 z-[9998] border-t border-white/10 bg-black/26 px-3 pb-2 pt-2 backdrop-blur-2xl'>
        {startOpen ? <StartMenu onLaunch={launchFromMenu} /> : null}
        {quickPanelOpen ? (
          <QuickPanel now={now} visitorCount={visitorCount} onReset={resetDesktop} />
        ) : null}

        <div className='flex h-14 items-center justify-between gap-3 rounded-[22px] border border-white/10 bg-black/28 px-3'>
          <div className='flex items-center gap-2'>
            <TaskbarButton
              icon={WINDOWS_ICON}
              label='Start'
              status={startOpen ? 'active' : 'idle'}
              onClick={() => {
                setStartOpen((value) => !value);
                setQuickPanelOpen(false);
                playSystemSound('click');
              }}
            />
          </div>

          <div className='flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto px-2'>
            {PINNED_APPS.map((pin) => (
              <TaskbarButton
                key={pin.id}
                icon={pin.icon}
                label={pin.label}
                status={getPinStatus(pin)}
                onClick={() => handlePinnedClick(pin)}
              />
            ))}

            {runningItems.length > 0 ? (
              <div className='mx-2 h-7 w-px shrink-0 bg-white/12' />
            ) : null}

            {runningItems.map((window) => {
              const browserIcon =
                window.type === 'browser'
                  ? BROWSER_APPS[window.browserAppId].icon
                  : window.icon;
              return (
                <TaskbarButton
                  key={window.id}
                  icon={browserIcon}
                  label={window.title}
                  status={
                    !window.isMinimized && activeWindowId === window.id
                      ? 'active'
                      : 'running'
                  }
                  onClick={() => handleRunningClick(window)}
                />
              );
            })}
          </div>

          <div className='flex items-center gap-1 text-white/85'>
            <button
              onClick={toggleQuickPanel}
              className={[
                'grid size-9 place-items-center rounded-xl transition-colors',
                quickPanelOpen ? 'bg-white/12' : 'hover:bg-white/8',
              ].join(' ')}
            >
              <img src={WIFI_ICON} alt='' className='h-4 w-4' />
            </button>
            <button
              onClick={toggleQuickPanel}
              className={[
                'grid size-9 place-items-center rounded-xl transition-colors',
                quickPanelOpen ? 'bg-white/12' : 'hover:bg-white/8',
              ].join(' ')}
            >
              <img src={VOLUME_ICON} alt='' className='h-4 w-4' />
            </button>
            <button
              onClick={toggleQuickPanel}
              className={[
                'grid size-9 place-items-center rounded-xl transition-colors',
                quickPanelOpen ? 'bg-white/12' : 'hover:bg-white/8',
              ].join(' ')}
            >
              <img src={BATTERY_ICON} alt='' className='h-4 w-4' />
            </button>
            <button
              onClick={toggleQuickPanel}
              className={[
                'rounded-[16px] px-3 py-2 text-right transition-colors',
                quickPanelOpen ? 'bg-white/12' : 'hover:bg-white/8',
              ].join(' ')}
            >
              <div className='text-[12px] font-semibold leading-none'>
                {formatTaskbarTime(now)}
              </div>
              <div className='mt-1 text-[11px] text-white/60'>
                {formatTaskbarDate(now)}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
