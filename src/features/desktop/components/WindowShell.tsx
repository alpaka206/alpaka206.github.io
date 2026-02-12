import type { AnyWindow, FolderWindow, PagesWindow } from '@/stores';
import { useDesktopStore } from '@/stores';
import { useRef } from 'react';
import { PagesBody } from './PagesBody';
import { FolderBody } from './FolderBody';
import { PageTabsInline } from './PageTabsInline';
import { useShallow } from 'zustand/shallow';

export function WindowShell({ win }: { win: AnyWindow }) {
  const {
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    setWindowPosition,
    setActiveTab,
    closeTab,
  } = useDesktopStore(
    useShallow((s) => ({
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

  const shellStyle: React.CSSProperties = win.isMaximized
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
    const x = originX + (e.clientX - startX);
    const y = originY + (e.clientY - startY);
    if (shellRef.current) {
      shellRef.current.style.left = `${x}px`;
      shellRef.current.style.top = `${y}px`;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (draggingRef.current) {
      const { startX, startY, originX, originY } = draggingRef.current;
      setWindowPosition(win.id, {
        x: originX + (e.clientX - startX),
        y: originY + (e.clientY - startY),
      });
    }
    draggingRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  return (
    <div
      ref={shellRef}
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
