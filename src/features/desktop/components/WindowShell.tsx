import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { BROWSER_HOME_URL, normalizeBrowserInput } from '@/features/browser-window/browserPolicy';
import { BROWSER_APPS } from '@/features/desktop/config/shell';
import type {
  AnyWindow,
  BrowserWindow,
  CodeWindow,
  FolderWindow,
  PagesWindow,
  TerminalWindow,
  TextFileWindow,
} from '@/stores';
import { useDesktopStore } from '@/stores';
import { PagesBody } from './PagesBody';
import { FolderBody } from './FolderBody';
import { PageTabsInline } from './PageTabsInline';
import { useShallow } from 'zustand/shallow';

const BrowserWindowBody = lazy(async () => {
  const module = await import('@/features/browser-window/components/BrowserWindowBody');
  return { default: module.BrowserWindowBody };
});

const Github1sCodeWindow = lazy(async () => {
  const module = await import('@/features/code-window/components/Github1sCodeWindow');
  return { default: module.Github1sCodeWindow };
});

const NotepadWindowBody = lazy(async () => {
  const module = await import('@/features/notepad-window/components/NotepadWindowBody');
  return { default: module.NotepadWindowBody };
});

const TerminalWindowBody = lazy(async () => {
  const module = await import('@/features/terminal-window/components/TerminalWindowBody');
  return { default: module.TerminalWindowBody };
});

function HomeIcon() {
  return (
    <svg viewBox='0 0 16 16' className='h-4 w-4 fill-none stroke-current'>
      <path
        d='M2.4 7.2 8 2.8l5.6 4.4v5.4a1 1 0 0 1-1 1H10V9.4H6v4.2H3.4a1 1 0 0 1-1-1z'
        strokeWidth='1.4'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox='0 0 16 16' className='h-4 w-4 fill-none stroke-current'>
      <path
        d='M12.8 7.2A4.8 4.8 0 1 1 11.4 4M12 2.8v2.6H9.4'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function BrowserChrome({
  windowId,
  appId,
  currentUrl,
  refreshToken,
  onRefresh,
}: {
  windowId: string;
  appId: BrowserWindow['browserAppId'];
  currentUrl: string;
  refreshToken: number;
  onRefresh: () => void;
}) {
  const updateBrowserUrl = useDesktopStore((s) => s.updateBrowserUrl);
  const goBrowserHome = useDesktopStore((s) => s.goBrowserHome);
  const [address, setAddress] = useState(currentUrl);
  const app = BROWSER_APPS[appId];

  useEffect(() => {
    setAddress(currentUrl);
  }, [currentUrl]);

  return (
    <div className='border-b border-[#d7dce3] bg-[linear-gradient(180deg,#f7f8fa_0%,#eceff3_100%)] px-3 py-3'>
      <div className='flex items-end gap-2'>
        <div className='rounded-t-[14px] border border-b-0 border-[#dfe3ea] bg-white px-4 py-2 text-[12px] font-medium text-[#0f172a] shadow-[0_-6px_18px_rgba(15,23,42,0.04)]'>
          {app.title}
        </div>
      </div>

      <div className='mt-2 flex items-center gap-2'>
        <button
          onClick={() => {
            setAddress(BROWSER_HOME_URL);
            goBrowserHome(windowId);
          }}
          className='grid size-8 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-black/5'
          title='Home'
        >
          <HomeIcon />
        </button>

        <button
          onClick={onRefresh}
          className='grid size-8 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-black/5'
          title='Refresh'
        >
          <RefreshIcon />
        </button>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            updateBrowserUrl(windowId, normalizeBrowserInput(address));
          }}
          className='flex min-w-0 flex-1 items-center rounded-full border border-[#d8dee8] bg-white px-4 py-2 shadow-[inset_0_1px_1px_rgba(15,23,42,0.05)]'
        >
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setAddress(currentUrl);
              }
            }}
            placeholder={BROWSER_HOME_URL}
            className='min-w-0 flex-1 bg-transparent text-[12px] text-[#475569] outline-none'
          />
        </form>
      </div>
      <div className='sr-only'>{refreshToken}</div>
    </div>
  );
}

export function WindowShell({ win }: { win: AnyWindow }) {
  const {
    activeWindowId,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    setWindowPosition,
    setActiveTab,
    closeTab,
    updateBrowserUrl,
  } = useDesktopStore(
    useShallow((s) => ({
      activeWindowId: s.activeWindowId,
      focusWindow: s.focusWindow,
      minimizeWindow: s.minimizeWindow,
      maximizeWindow: s.maximizeWindow,
      closeWindow: s.closeWindow,
      setWindowPosition: s.setWindowPosition,
      setActiveTab: s.setActiveTab,
      closeTab: s.closeTab,
      updateBrowserUrl: s.updateBrowserUrl,
    }))
  );

  const shellRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [browserRefreshToken, setBrowserRefreshToken] = useState(0);
  const isPagesWindow = win.type === 'pages';

  const isActive = !win.isMinimized && activeWindowId === win.id;
  const shellStyle: CSSProperties = win.isMaximized
    ? { zIndex: win.zIndex }
    : {
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
        width: win.size?.w ?? '80%',
        height: win.size?.h ?? '85%',
      };

  const onPointerDownHeader = (event: PointerEvent) => {
    if ((event.target as HTMLElement).closest('[data-nodrag]')) return;
    if (activeWindowId !== win.id || win.isMinimized) {
      focusWindow(win.id);
    }
    (event.target as Element).setPointerCapture?.(event.pointerId);
    draggingRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: win.position.x,
      originY: win.position.y,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!draggingRef.current || win.isMaximized) return;
    const { startX, startY, originX, originY } = draggingRef.current;
    const x = originX + (event.clientX - startX);
    const y = originY + (event.clientY - startY);
    if (shellRef.current) {
      shellRef.current.style.left = `${x}px`;
      shellRef.current.style.top = `${y}px`;
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    if (draggingRef.current) {
      const { startX, startY, originX, originY } = draggingRef.current;
      setWindowPosition(win.id, {
        x: originX + (event.clientX - startX),
        y: originY + (event.clientY - startY),
      });
    }
    draggingRef.current = null;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
  };

  const body = useMemo(() => {
    switch (win.type) {
      case 'pages':
        return <PagesBody win={win as PagesWindow} />;
      case 'folder':
        return <FolderBody win={win as FolderWindow} />;
      case 'browser':
        return (
          <>
            <BrowserChrome
              windowId={win.id}
              appId={(win as BrowserWindow).browserAppId}
              currentUrl={(win as BrowserWindow).url}
              refreshToken={browserRefreshToken}
              onRefresh={() => setBrowserRefreshToken((token) => token + 1)}
            />
            <Suspense
              fallback={<div className='p-4 text-sm text-black/60'>Loading browser...</div>}
            >
              <BrowserWindowBody
                browserAppId={(win as BrowserWindow).browserAppId}
                url={(win as BrowserWindow).url}
                refreshToken={browserRefreshToken}
                onNavigate={(nextUrl) => updateBrowserUrl(win.id, nextUrl)}
                onIframeFocus={() => focusWindow(win.id)}
              />
            </Suspense>
          </>
        );
      case 'code':
        return (
          <Suspense
            fallback={<div className='p-4 text-sm text-black/60'>Loading workspace...</div>}
          >
            <Github1sCodeWindow
              owner={(win as CodeWindow).owner}
              repo={(win as CodeWindow).repo}
              branch={(win as CodeWindow).branch}
              path={(win as CodeWindow).path}
              title={(win as CodeWindow).title}
              onIframeFocus={() => focusWindow(win.id)}
            />
          </Suspense>
        );
      case 'text-file':
        return (
          <Suspense
            fallback={<div className='p-4 text-sm text-black/60'>Loading notepad...</div>}
          >
            <NotepadWindowBody fileId={(win as TextFileWindow).fileId} />
          </Suspense>
        );
      case 'terminal':
        return (
          <Suspense
            fallback={<div className='p-4 text-sm text-black/60'>Loading terminal...</div>}
          >
            <TerminalWindowBody />
          </Suspense>
        );
    }
  }, [browserRefreshToken, focusWindow, updateBrowserUrl, win]);

  return (
    <div
      ref={shellRef}
      className={`absolute pointer-events-auto transition-[transform,box-shadow] duration-150 ${
        win.isMaximized ? 'inset-0' : ''
      } ${win.isOpen && !win.isMinimized ? '' : 'hidden'}`}
      style={shellStyle}
      onPointerDownCapture={() => {
        if (activeWindowId !== win.id || win.isMinimized) {
          focusWindow(win.id);
        }
      }}
    >
      <div
        className={[
          'flex h-full w-full flex-col overflow-hidden rounded-[16px] border backdrop-blur-xl',
          isActive
            ? 'border-white/30 bg-[#fefefe] shadow-[0_18px_48px_rgba(15,23,42,0.28)]'
            : 'border-black/20 bg-[#f7f8fb]/95 shadow-[0_14px_34px_rgba(15,23,42,0.14)]',
        ].join(' ')}
      >
        <div
          className={[
            'flex select-none items-center justify-between px-2',
            isPagesWindow
              ? isActive
                ? 'h-[41px] cursor-grab border-b-0 bg-[linear-gradient(180deg,#2a2b2e_0%,#242528_100%)] text-white'
                : 'h-[41px] cursor-grab border-b-0 bg-[linear-gradient(180deg,#35373b_0%,#2e3034_100%)] text-white/74'
              : isActive
                ? 'h-10 cursor-grab border-b border-[#d7dce3] bg-[linear-gradient(180deg,#eff2f7_0%,#dfe4ea_100%)]'
                : 'h-10 cursor-grab border-b border-[#dde2e9] bg-[linear-gradient(180deg,#eef1f4_0%,#e3e7ec_100%)] text-[#64748b]',
          ].join(' ')}
          onPointerDown={onPointerDownHeader}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={() => maximizeWindow(win.id)}
        >
          {win.type === 'pages' ? (
            <PageTabsInline
              win={win as PagesWindow}
              onSetActiveTab={setActiveTab}
              onCloseTab={closeTab}
            />
          ) : (
            <div className='flex items-center gap-2' data-nodrag>
              <img
                src={win.icon}
                alt=''
                className='h-5 w-5 rounded-sm object-contain'
              />
              <span
                className={[
                  'text-sm font-medium',
                  isActive ? 'text-[#1f2937]' : 'text-[#475569]',
                ].join(' ')}
              >
                {win.title}
              </span>
            </div>
          )}

          <div className='flex items-center gap-1' data-nodrag>
            <button
              onClick={() => minimizeWindow(win.id)}
              className={[
                'grid h-8 w-8 place-items-center rounded-md transition-colors',
                isPagesWindow ? 'hover:bg-white/10' : 'hover:bg-black/5',
              ].join(' ')}
              title='Minimize'
            >
              <img
                src='/assets/window-controls/minimize.webp'
                alt=''
                className={[
                  'pointer-events-none w-[12px] select-none',
                  isPagesWindow ? 'brightness-0 invert' : '',
                ].join(' ')}
              />
            </button>
            <button
              onClick={() => maximizeWindow(win.id)}
              className={[
                'grid h-8 w-8 place-items-center rounded-md transition-colors',
                isPagesWindow ? 'hover:bg-white/10' : 'hover:bg-black/5',
              ].join(' ')}
              title='Maximize'
            >
              <img
                src='/assets/window-controls/maximize.webp'
                alt=''
                className={[
                  'pointer-events-none h-[12px] w-[12px] select-none',
                  isPagesWindow ? 'brightness-0 invert' : '',
                ].join(' ')}
              />
            </button>
            <button
              onClick={() => closeWindow(win.id)}
              className={[
                'grid h-8 w-8 place-items-center rounded-md transition-colors',
                isPagesWindow ? 'hover:bg-red-500/85' : 'hover:bg-red-500/20',
              ].join(' ')}
              title='Close'
            >
              <img
                src='/assets/window-controls/close.webp'
                alt=''
                className={[
                  'pointer-events-none h-[12px] w-[12px] select-none',
                  isPagesWindow ? 'brightness-0 invert' : '',
                ].join(' ')}
              />
            </button>
          </div>
        </div>

        <div className='flex min-h-0 flex-1 overflow-hidden bg-transparent'>
          {body}
        </div>
      </div>
    </div>
  );
}
