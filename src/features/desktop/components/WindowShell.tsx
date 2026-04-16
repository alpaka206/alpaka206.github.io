import {
  lazy,
  Suspense,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import type {
  AnyWindow,
  BrowserWindow,
  CodeWindow,
  FolderWindow,
  NoteWindow,
  PagesWindow,
} from '@/stores';
import { useDesktopStore } from '@/stores';
import { BROWSER_APPS } from '@/features/desktop/config/shell';
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

const NoteWindowBody = lazy(async () => {
  const module = await import('@/features/note-window/components/NoteWindowBody');
  return { default: module.NoteWindowBody };
});

function BrowserChrome({
  appId,
  refreshToken,
  onRefresh,
}: {
  appId: BrowserWindow['browserAppId'];
  refreshToken: number;
  onRefresh: () => void;
}) {
  const app = BROWSER_APPS[appId];

  return (
    <div className='border-b border-[#e5e7eb] bg-[linear-gradient(180deg,#f7f8fa_0%,#eceff3_100%)] px-3 py-3'>
      <div className='flex items-end gap-2'>
        <div className='rounded-t-[14px] border border-b-0 border-[#dfe3ea] bg-white px-4 py-2 text-[12px] font-medium text-[#0f172a] shadow-[0_-6px_18px_rgba(15,23,42,0.04)]'>
          {app.title}
        </div>
      </div>
      <div className='mt-2 flex items-center gap-2'>
        <button className='grid size-8 place-items-center rounded-full text-[#64748b] hover:bg-black/5'>
          ‹
        </button>
        <button className='grid size-8 place-items-center rounded-full text-[#64748b] hover:bg-black/5'>
          ›
        </button>
        <button
          onClick={onRefresh}
          className='grid size-8 place-items-center rounded-full text-[#64748b] hover:bg-black/5'
          title='Refresh'
        >
          ↻
        </button>
        <div className='flex min-w-0 flex-1 items-center rounded-full border border-[#d8dee8] bg-white px-4 py-2 text-[12px] text-[#475569] shadow-[inset_0_1px_1px_rgba(15,23,42,0.05)]'>
          <span className='truncate'>{app.address}</span>
        </div>
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
  const shellStyle: React.CSSProperties = win.isMaximized
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
              appId={(win as BrowserWindow).browserAppId}
              refreshToken={browserRefreshToken}
              onRefresh={() =>
                setBrowserRefreshToken((token) => token + 1)
              }
            />
            <Suspense fallback={<div className='p-4 text-sm text-black/60'>Loading browser…</div>}>
              <BrowserWindowBody
                browserAppId={(win as BrowserWindow).browserAppId}
                refreshToken={browserRefreshToken}
                onIframeFocus={() => focusWindow(win.id)}
              />
            </Suspense>
          </>
        );
      case 'code':
        return (
          <Suspense fallback={<div className='p-4 text-sm text-black/60'>Loading workspace…</div>}>
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
      case 'note':
        return (
          <Suspense fallback={<div className='p-4 text-sm text-black/60'>Loading note…</div>}>
            <NoteWindowBody noteId={(win as NoteWindow).noteId} />
          </Suspense>
        );
    }
  }, [browserRefreshToken, focusWindow, win]);

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
              <span className='text-sm font-medium text-[#1f2937]'>
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
