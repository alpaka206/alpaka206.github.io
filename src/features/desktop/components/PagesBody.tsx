import { useDesktopStore } from '@/stores';
import type { PagesWindow } from '@/stores';
import { PageScrollContainerProvider, PAGES_SCROLL_CONTAINER_ID } from '@/features/pages-window/context/PageScrollContext';
import { PageContent } from '@/features/pages-window/registry/PageContent';

export function PagesBody({ win }: { win: PagesWindow }) {
  const activeWindowId = useDesktopStore((s) => s.activeWindowId);
  const focusWindow = useDesktopStore((s) => s.focusWindow);
  const { tabs, activeTabId } = win;
  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const focusPagesWindow = () => {
    if (activeWindowId !== win.id || win.isMinimized) {
      focusWindow(win.id);
    }
  };

  if (!activeTab) {
    return <div className='p-6 text-black/60 text-sm'>No tab selected.</div>;
  }

  return (
    <div className='flex flex-col w-full h-full min-h-0'>
      <div
        id={PAGES_SCROLL_CONTAINER_ID}
        className='app-scroll flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-0
                   [&_img]:max-w-full [&_img]:h-auto [&_img]:object-contain
                   [&_iframe]:w-full [&_iframe]:h-full'
      >
        <PageScrollContainerProvider>
          <PageContent
            pageId={activeTab.id}
            onIframeFocus={focusPagesWindow}
          />
        </PageScrollContainerProvider>
      </div>
    </div>
  );
}
