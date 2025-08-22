import { useDesktopStore } from '@/store';
import { useMemo } from 'react';

export function TaskbarInline() {
  const windows = useDesktopStore((s) => s.windows);
  const activeWindowId = useDesktopStore((s) => s.activeWindowId);
  const toggleTaskbarItem = useDesktopStore((s) => s.toggleTaskbarItem);

  const items = useMemo(() => {
    return windows
      .filter((w) => w.isOpen || w.isMinimized)
      .slice()
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((w) => ({
        id: w.id,
        title: w.title,
        icon: w.icon,
        isActive: !w.isMinimized && w.id === activeWindowId,
      }));
  }, [windows, activeWindowId]);

  return (
    <div className='fixed bottom-0 left-0 right-0 z-[9999] h-12 backdrop-blur bg-black/30 border-t border-white/10 flex items-center px-2 gap-2 pointer-events-auto'>
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => toggleTaskbarItem(it.id)}
          className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-white/10 transition ${
            it.isActive ? 'bg-white/15 outline outline-1 outline-white/25' : ''
          }`}
          title={it.title}
        >
          <img
            src={it.icon}
            alt=''
            className='w-5 h-5 object-contain rounded-sm'
          />
          <span className='text-sm text-white/90'>{it.title}</span>
        </button>
      ))}
    </div>
  );
}
