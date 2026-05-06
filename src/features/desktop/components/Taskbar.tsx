import { useMemo, useState } from 'react';
import {
  BATTERY_ICON,
  BROWSER_APPS,
  PINNED_APPS,
  START_MENU_APPS,
  START_MENU_RECOMMENDED_IDS,
  WALLPAPERS,
  WIFI_ICON,
  WINDOWS_ICON,
  VOLUME_ICON,
  type LauncherAction,
  type LauncherEntry,
} from '@/features/desktop/config/shell';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';
import { useClock } from '@/hooks/useClock';
import {
  useDesktopLayoutStore,
  useDesktopPreferencesStore,
  useDesktopStore,
  useDesktopTerminalStore,
  useDesktopTextFilesStore,
} from '@/stores';
import type { AnyWindow, PagesWindow } from '@/stores';
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

function matchesLauncher(entry: LauncherEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const haystack = [entry.label, entry.subtitle, ...entry.keywords]
    .join(' ')
    .toLowerCase();

  return normalizedQuery
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

function getFolderLaunchOptions(folderId: 'projects' | 'recycle-bin') {
  if (folderId === 'projects') {
    return {
      id: 'folder:projects',
      folderId: 'projects' as const,
      title: 'Projects',
      icon: '/assets/common/desktop/folder-shortcut.webp',
      contentType: 'projects' as const,
    };
  }

  return {
    id: 'folder:recycle-bin',
    folderId: 'recycle-bin' as const,
    title: 'Recycle Bin',
    icon: '/assets/common/desktop/folder-shortcut.webp',
    contentType: 'recycle-bin' as const,
  };
}

function getLaunchWindowId(action: LauncherAction) {
  switch (action.kind) {
    case 'folder':
      return `folder:${action.folderId}`;
    case 'browser':
      return `browser:${action.browserAppId}`;
    case 'code':
      return `code:${action.workspaceId}`;
    case 'text-file':
      return `text-file:${action.fileId}`;
    case 'terminal':
      return 'terminal:main';
    case 'page':
      return 'pages';
  }
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

function LauncherList({
  title,
  entries,
  onLaunch,
}: {
  title: string;
  entries: LauncherEntry[];
  onLaunch: (entry: LauncherEntry) => void;
}) {
  if (entries.length === 0) {
    return null;
  }

  return (
    <section className='mt-5'>
      <div className='mb-3 flex items-center justify-between px-1'>
        <div className='text-[12px] font-semibold uppercase tracking-[0.18em] text-white/48'>
          {title}
        </div>
      </div>
      <div className='space-y-2'>
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onLaunch(entry)}
            className='flex w-full items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-3 py-3 text-left transition-colors hover:bg-white/10'
          >
            <img
              src={entry.icon}
              alt=''
              className='h-10 w-10 rounded-[14px] object-contain'
            />
            <div className='min-w-0'>
              <div className='truncate text-sm font-semibold text-white'>
                {entry.label}
              </div>
              <div className='mt-1 truncate text-[12px] text-white/60'>
                {entry.subtitle}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function StartMenu({
  query,
  onQueryChange,
  results,
  recommendedEntries,
  onLaunch,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  results: LauncherEntry[];
  recommendedEntries: LauncherEntry[];
  onLaunch: (entry: LauncherEntry) => void;
}) {
  const isSearching = query.trim().length > 0;

  return (
    <div className='absolute bottom-16 left-3 z-[9999] w-[360px] rounded-[28px] border border-white/15 bg-[#0d1118]/88 p-4 text-white shadow-[0_28px_80px_rgba(15,23,42,0.55)] backdrop-blur-3xl'>
      <div className='rounded-[22px] border border-white/10 bg-white/6 px-4 py-4'>
        <div className='text-[14px] text-white/70'>Kim GyuWon Portfolio</div>
        <div className='mt-1 text-[24px] font-semibold tracking-[-0.03em]'>
          Start
        </div>
        <p className='mt-2 text-sm leading-6 text-white/56'>
          앱 이름과 키워드로 빠르게 검색 가능
        </p>
      </div>

      <label className='mt-4 flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-4 py-3'>
        <span className='text-sm text-white/50'>Search</span>
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder='About, GitHub, Terminal, README.txt'
          className='min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35'
        />
      </label>

      {isSearching ? (
        <section className='mt-5'>
          <div className='mb-3 px-1 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/48'>
            Search Results
          </div>
          {results.length > 0 ? (
            <div className='space-y-2'>
              {results.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onLaunch(entry)}
                  className='flex w-full items-center gap-3 rounded-[20px] border border-white/10 bg-white/6 px-3 py-3 text-left transition-colors hover:bg-white/10'
                >
                  <img
                    src={entry.icon}
                    alt=''
                    className='h-10 w-10 rounded-[14px] object-contain'
                  />
                  <div className='min-w-0'>
                    <div className='truncate text-sm font-semibold text-white'>
                      {entry.label}
                    </div>
                    <div className='mt-1 truncate text-[12px] text-white/60'>
                      {entry.subtitle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className='rounded-[20px] border border-white/10 bg-white/6 px-4 py-5 text-sm leading-6 text-white/60'>
              검색 결과가 없습니다. `About`, `Projects`, `Terminal`, `Notepad`,
              `GitHub` 같은 이름으로 다시 시도해보세요.
            </div>
          )}
        </section>
      ) : (
        <>
          <section className='mt-5'>
            <div className='mb-3 flex items-center justify-between px-1'>
              <div className='text-[12px] font-semibold uppercase tracking-[0.18em] text-white/48'>
                Pinned
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              {PINNED_APPS.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => onLaunch(entry)}
                  className='rounded-[20px] border border-white/10 bg-white/6 p-4 text-left transition-colors hover:bg-white/10'
                >
                  <img
                    src={entry.icon}
                    alt=''
                    className='h-9 w-9 rounded-xl object-contain'
                  />
                  <div className='mt-3 text-sm font-semibold text-white'>
                    {entry.label}
                  </div>
                  <div className='mt-1 text-[12px] text-white/58'>
                    {entry.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <LauncherList
            title='Recommended'
            entries={recommendedEntries}
            onLaunch={onLaunch}
          />
        </>
      )}
    </div>
  );
}

function QuickPanel({
  now,
  onReset,
  onOpenSettings,
}: {
  now: Date;
  onReset: () => void;
  onOpenSettings: () => void;
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

      <div className='mt-4 grid grid-cols-1 gap-3'>
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
        <div className='flex items-center justify-between gap-3'>
          <div className='text-[12px] uppercase tracking-[0.16em] text-white/50'>
            Wallpaper
          </div>
          <button
            onClick={onOpenSettings}
            className='rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] font-semibold text-white/80 transition-colors hover:bg-white/12'
          >
            Open Settings
          </button>
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
              <div className='h-14 rounded-xl' style={wallpaper.style} />
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
  const {
    windows,
    activeWindowId,
    toggleTaskbarItem,
    openPage,
    openFolder,
    openBrowser,
    openCodeWorkspace,
    openTextFileWindow,
    openTerminalWindow,
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
      openTextFileWindow: s.openTextFileWindow,
      openTerminalWindow: s.openTerminalWindow,
      resetWindows: s.resetWindows,
    }))
  );

  const recordLauncherUse = useDesktopPreferencesStore((s) => s.recordLauncherUse);
  const recentLauncherIds = useDesktopPreferencesStore((s) => s.recentLauncherIds);
  const resetPreferences = useDesktopPreferencesStore((s) => s.resetPreferences);
  const resetLayout = useDesktopLayoutStore((s) => s.resetLayout);
  const resetTextFiles = useDesktopTextFilesStore((s) => s.resetTextFiles);
  const resetTerminal = useDesktopTerminalStore((s) => s.resetTerminal);

  const [startOpen, setStartOpen] = useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [launcherQuery, setLauncherQuery] = useState('');

  const startEntriesById = useMemo(
    () => new Map(START_MENU_APPS.map((entry) => [entry.id, entry])),
    []
  );

  const searchResults = useMemo(
    () =>
      START_MENU_APPS.filter((entry) => matchesLauncher(entry, launcherQuery)).slice(
        0,
        12
      ),
    [launcherQuery]
  );

  const recommendedEntries = useMemo(() => {
    const recentEntries = recentLauncherIds
      .map((id) => startEntriesById.get(id))
      .filter((entry): entry is LauncherEntry => Boolean(entry));

    if (recentEntries.length > 0) {
      return recentEntries;
    }

    return START_MENU_RECOMMENDED_IDS.map((id) => startEntriesById.get(id)).filter(
      (entry): entry is LauncherEntry => Boolean(entry)
    );
  }, [recentLauncherIds, startEntriesById]);

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

        if (window.type === 'terminal' && window.id === 'terminal:main') {
          return false;
        }

        if (
          window.type === 'pages' &&
          window.activeTabId === 'about' &&
          window.tabs.length <= 1
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.zIndex - b.zIndex);
  }, [windows]);

  const pagesWindow = windows.find(
    (window): window is PagesWindow => window.type === 'pages'
  );

  const launchEntry = (entry: LauncherEntry) => {
    recordLauncherUse(entry.id);
    setStartOpen(false);
    setLauncherQuery('');

    switch (entry.launch.kind) {
      case 'page':
        openPage(PAGE_TABS[entry.launch.pageId]);
        break;
      case 'folder':
        openFolder(getFolderLaunchOptions(entry.launch.folderId));
        break;
      case 'browser':
        openBrowser(entry.launch.browserAppId);
        break;
      case 'code':
        openCodeWorkspace(entry.launch.workspaceId);
        break;
      case 'text-file':
        openTextFileWindow(entry.launch.fileId);
        break;
      case 'terminal':
        openTerminalWindow();
        break;
    }

    playSystemSound('open');
  };

  const toggleQuickPanel = () => {
    setQuickPanelOpen((value) => !value);
    setStartOpen(false);
    playSystemSound('click');
  };

  const handlePinnedClick = (pin: LauncherEntry) => {
    if (
      pin.launch.kind === 'page' &&
      pagesWindow?.type === 'pages' &&
      pagesWindow.activeTabId === pin.launch.pageId &&
      activeWindowId === pagesWindow.id
    ) {
      toggleTaskbarItem(pagesWindow.id);
      return;
    }

    const windowId = getLaunchWindowId(pin.launch);

    if (
      pin.launch.kind !== 'page' &&
      windows.some((window) => window.id === windowId)
    ) {
      toggleTaskbarItem(windowId);
      return;
    }

    launchEntry(pin);
  };

  const getPinStatus = (pin: LauncherEntry): TaskbarButtonStatus => {
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

      return window.id === getLaunchWindowId(pin.launch);
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
    resetPreferences();
    resetTextFiles();
    resetTerminal();
    resetWindows();
    setQuickPanelOpen(false);
    setStartOpen(false);
    setLauncherQuery('');
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
        {startOpen ? (
          <StartMenu
            query={launcherQuery}
            onQueryChange={setLauncherQuery}
            results={searchResults}
            recommendedEntries={recommendedEntries}
            onLaunch={launchEntry}
          />
        ) : null}
        {quickPanelOpen ? (
          <QuickPanel
            now={now}
            onReset={resetDesktop}
            onOpenSettings={() => {
              setQuickPanelOpen(false);
              openPage(PAGE_TABS.settings);
              playSystemSound('open');
            }}
          />
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
