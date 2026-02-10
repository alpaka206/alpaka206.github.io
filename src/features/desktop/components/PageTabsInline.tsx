import type { PagesWindow, PageType } from '@/stores';

export function PageTabsInline({
  win,
  onSetActiveTab,
  onCloseTab,
}: {
  win: PagesWindow;
  onSetActiveTab: (id: PageType) => void;
  onCloseTab: (id: PageType) => void;
}) {
  return (
    <div className='flex items-end h-10 gap-1' data-nodrag>
      <div className='flex h-full overflow-x-auto'>
        {win.tabs.map((t) => {
          const isActive = t.id === win.activeTabId;
          return (
            <button
              key={t.id}
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
