import { AnyWindow, FolderWindow, PagesWindow, useDesktopStore } from '@/store';
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

  const draggingRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const onPointerDownHeader = (e: React.PointerEvent) => {
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
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    setWindowPosition(win.id, { x: originX + dx, y: originY + dy });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    draggingRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const stylePos = win.isMaximized
    ? {}
    : { left: win.position.x, top: win.position.y };
  const z = win.zIndex;

  return (
    <div
      className={`absolute pointer-events-auto ${
        win.isMaximized ? 'inset-0' : ''
      } ${win.isOpen && !win.isMinimized ? '' : 'hidden'}`}
      style={{
        ...stylePos,
        zIndex: z,
        width: win.size?.w ?? 860,
        height: win.size?.h ?? 560,
      }}
    >
      <div className='flex flex-col w-full h-full rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.3)] overflow-hidden border border-[#888] bg-[#fefefe]'>
        <div
          className='flex items-center justify-between h-10 select-none cursor-grab active:cursor-grabbing bg-[#dfdfdf] border-b border-[#d0d0d0] px-3'
          onPointerDown={onPointerDownHeader}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={() => maximizeWindow(win.id)}
        >
          <div className='flex items-center gap-2'>
            <img
              src={win.icon}
              alt=''
              className='w-5 h-5 object-contain rounded-sm'
            />
            <span className='text-sm text-[#1f1f1f]'>{win.title}</span>
          </div>
          <div className='flex items-center gap-1'>
            <button
              onClick={() => minimizeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md'
              title='Minimize'
            >
              —
            </button>
            <button
              onClick={() => maximizeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-black/5 rounded-md'
              title='Maximize'
            >
              □
            </button>
            <button
              onClick={() => closeWindow(win.id)}
              className='w-8 h-8 grid place-items-center hover:bg-red-500/20 rounded-md'
              title='Close'
            >
              ×
            </button>
          </div>
        </div>

        <div className='flex-1 min-h-0 overflow-hidden bg-white'>
          {win.type === 'pages' ? (
            <PagesBody
              win={win as PagesWindow}
              onSetActiveTab={setActiveTab}
              onCloseTab={closeTab}
            />
          ) : (
            <FolderBody win={win as FolderWindow} />
          )}
        </div>
      </div>
    </div>
  );
}
