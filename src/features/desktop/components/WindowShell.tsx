import {
  AnyWindow,
  FolderWindow,
  PagesWindow,
  useDesktopStore,
} from '@/stores';
import { useRef } from 'react';
import { PagesBody } from './PagesBody';
import { FolderBody } from './FolderBody';

export function WindowShell({ win }: { win: AnyWindow }) {
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const minimizeWindow = useDesktopStore((s) => s.minimizeWindow);
  const maximizeWindow = useDesktopStore((s) => s.maximizeWindow);
  const closeWindow = useDesktopStore((s) => s.closeWindow);
  const setWindowPosition = useDesktopStore((s) => s.setWindowPosition);
  const setActiveTab = useDesktopStore((s) => s.setActiveTab);
  const closeTab = useDesktopStore((s) => s.closeTab);
  const isMax = win.isMaximized;

  const draggingRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const shellStyle: React.CSSProperties = isMax
    ? { zIndex: win.zIndex }
    : {
        left: win.position.x,
        top: win.position.y,
        zIndex: win.zIndex,
        width: win.size?.w ?? '80%',
        height: win.size?.h ?? '85%',
      };

  const onPointerDownHeader = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-nodrag]')) return;
    focusWindow(win.id);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: win.position.x,
      originY: win.position.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || win.isMaximized) return;
    const { startX, startY, originX, originY } = draggingRef.current;
    setWindowPosition(win.id, {
      x: originX + (e.clientX - startX),
      y: originY + (e.clientY - startY),
    });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      className={`absolute pointer-events-auto ${
        win.isMaximized ? 'inset-0' : ''
      } ${win.isOpen && !win.isMinimized ? '' : 'hidden'}`}
      style={shellStyle}
    >
      <div className='flex flex-col w-full h-full rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.3)] overflow-hidden border border-[#888] bg-[#fefefe]'>
        <div
          className='flex items-center justify-between h-10 select-none cursor-grab active:cursor-grabbing bg-[#dfdfdf] border-b border-[#d0d0d0] px-2'
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
                className='w-5 h-5 object-contain rounded-sm'
              />
              <span className='text-sm text-[#1f1f1f]'>{win.title}</span>
            </div>
          )}
          <div className='flex items-center gap-1' data-nodrag>
            <button
              onClick={() => minimizeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md'
              title='Minimize'
            >
              <img
                src='/assets/window-controls/minimize.webp'
                alt=''
                className='w-[12px] select-none pointer-events-none'
              />
            </button>
            <button
              onClick={() => maximizeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md'
              title='Maximize'
            >
              <img
                src='/assets/window-controls/maximize.webp'
                alt=''
                className='w-[12px] h-[12px] select-none pointer-events-none'
              />
            </button>
            <button
              onClick={() => closeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-red-500/20 rounded-md'
              title='Close'
            >
              <img
                src='/assets/window-controls/close.webp'
                alt=''
                className='w-[12px] h-[12px] select-none pointer-events-none'
              />
            </button>
          </div>
        </div>

        <div className='flex-1 min-h-0 overflow-hidden bg-white'>
          {win.type === 'pages' ? (
            <PagesBody win={win as PagesWindow} />
          ) : (
            <FolderBody win={win as FolderWindow} />
          )}
        </div>
      </div>
    </div>
  );
}

function PageTabsInline({
  win,
  onSetActiveTab,
  onCloseTab,
}: {
  win: PagesWindow;
  onSetActiveTab: (id: any) => void;
  onCloseTab: (id: any) => void;
}) {
  return (
    <div className='flex items-end h-10 gap-1' data-nodrag>
      <div className='flex h-full overflow-x-auto'>
        {win.tabs.map((t) => {
          const isActive = t.id === win.activeTabId;
          return (
            <button
              key={t.id as string}
              onClick={(e) => {
                e.stopPropagation();
                onSetActiveTab(t.id);
              }}
              className={[
                'group flex items-center justify-between w-[155px] rounded-t-[8px] text-[12px] font-normal select-none',
                'pr-2 pl-0',
                isActive
                  ? 'bg-white pt-[6px] pb-[14px] mt-[6px] mb-0'
                  : 'bg-[#dfdfdf] pt-[6px] pb-[6px] mt-[6px] mb-[8px] hover:bg-white/50',
              ].join(' ')}
              title={t.title}
              aria-pressed={isActive}
            >
              <div className='flex items-center w-full min-w-0'>
                <img
                  src={t.icon}
                  alt=''
                  className='w-4 h-4 object-contain ml-2 mr-2'
                />
                <span className='truncate text-[#1f1f1f]'>{t.title}</span>
              </div>

              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(t.id);
                }}
                aria-label='Close tab'
                className='ml-2 px-1 leading-none text-[#1f1f1f]/70 hover:text-[#1f1f1f]'
              >
                <img
                  src='/assets/window-controls/close.webp'
                  alt=''
                  className='w-[12px] h-[10px] select-none pointer-events-none'
                />
              </button>
            </button>
          );
        })}
      </div>

      <div className='w-[6px] h-full bg-[#dfdfdf] rounded-bl-[8px]' />
    </div>
  );
}
