import { PagesWindow } from '@/stores';
import { useMemo } from 'react';

export function PagesBody({ win }: { win: PagesWindow }) {
  const { tabs, activeTabId } = win;
  const active = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? tabs[0],
    [tabs, activeTabId]
  );

  return (
    <div className='flex flex-col w-full h-full min-h-0'>
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
