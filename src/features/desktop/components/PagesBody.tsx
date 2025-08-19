import { PagesWindow, PageType } from '@/store';
import { useMemo } from 'react';

export function PagesBody({
  win,
  onSetActiveTab,
  onCloseTab,
}: {
  win: PagesWindow;
  onSetActiveTab: (id: PageType) => void;
  onCloseTab: (id: PageType) => void;
}) {
  const { tabs, activeTabId } = win;
  const active = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  return (
    <div className='flex flex-col w-full h-full min-h-0'>
      <div className='h-10 flex items-end bg-[#dfdfdf] border-b border-[#d0d0d0]'>
        <div className='w-[6px] h-full bg-white rounded-br-[8px]' />

        <div className='flex h-full'>
          {tabs.map((t) => {
            const isActive = t.id === active?.id;
            return (
              <button
                key={t.id}
                onClick={() => onSetActiveTab(t.id)}
                className={[
                  'flex items-center justify-between w-[155px] rounded-t-[8px] text-[12px] font-normal select-none',
                  'pr-2 pl-0',
                  isActive
                    ? 'bg-white pt-[6px] pb-[14px] mt-[6px] mb-0'
                    : 'bg-[#dfdfdf] pt-[6px] pb-[6px] mt-[6px] mb-[8px] hover:bg-white/50',
                ].join(' ')}
                title={t.title}
              >
                <div className='flex items-center w-full'>
                  <img
                    src={t.icon}
                    alt=''
                    className='w-4 h-4 object-contain ml-2 mr-2'
                  />
                  <span className='truncate text-[#1f1f1f]'>{t.title}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(t.id);
                  }}
                  className='ml-auto text-[#1f1f1f]/70 hover:text-[#1f1f1f]'
                  aria-label='Close tab'
                >
                  ×
                </button>
              </button>
            );
          })}
        </div>

        <div className='w-[6px] h-full bg-[#dfdfdf] rounded-bl-[8px]' />
      </div>

      <div
        className='flex-1 min-h-0 overflow-y-auto p-0
                   [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain
                   [&_iframe]:w-full  [&_iframe]:h-full'
      >
        {active?.content ?? (
          <div className='p-6 text-black/60 text-sm'>No tab selected.</div>
        )}
      </div>
    </div>
  );
}
