import type { PagesWindow } from '@/stores';
import { PageContent } from '@/features/pages-window/registry/PageContent';

export function PagesBody({ win }: { win: PagesWindow }) {
  const { tabs, activeTabId } = win;
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  if (!activeTab) {
    return <div className='p-6 text-black/60 text-sm'>No tab selected.</div>;
  }

  return (
    <div className='flex flex-col w-full h-full min-h-0'>
      <div
        id='pages-scroll-container'
        className='flex-1 min-h-0 overflow-y-auto p-0
                   [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain
                   [&_iframe]:w-full [&_iframe]:h-full'
      >
        <PageContent pageId={activeTab.id} />
      </div>
    </div>
  );
}
