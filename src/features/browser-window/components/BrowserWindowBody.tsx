import { BROWSER_APPS } from '@/features/desktop/config/shell';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';
import { useDesktopStore } from '@/stores';
import type { BrowserAppId } from '@/stores';

export function BrowserWindowBody({
  browserAppId,
  refreshToken = 0,
  onIframeFocus,
}: {
  browserAppId: BrowserAppId;
  refreshToken?: number;
  onIframeFocus?: () => void;
}) {
  const app = BROWSER_APPS[browserAppId];
  const openPage = useDesktopStore((s) => s.openPage);
  const openFolder = useDesktopStore((s) => s.openFolder);

  const chromeLinks = [
    {
      title: 'About Me',
      description: 'Open the profile page inside the Pages window.',
      action: () => openPage(PAGE_TABS.about),
    },
    {
      title: 'Projects Folder',
      description: 'Open the portfolio project folder.',
      action: () =>
        openFolder({
          id: 'folder:projects',
          title: 'Projects',
          icon: '/assets/common/desktop/folder-shortcut.webp',
          folderId: 'projects',
          contentType: 'projects',
        }),
    },
    {
      title: 'Tech Blog',
      description: 'Open the blog in the shared Pages window.',
      action: () => openPage(PAGE_TABS.blog),
    },
    {
      title: 'Instagram',
      description: 'Open Instagram in the shared Pages window.',
      action: () => openPage(PAGE_TABS.insta),
    },
    {
      title: 'Awards',
      description: 'Jump to the awards page.',
      action: () => openPage(PAGE_TABS.awards),
    },
    {
      title: 'GitHub',
      description: 'Open the GitHub handoff card in the shared Pages window.',
      action: () => openPage(PAGE_TABS.github),
    },
  ];

  if (app.mode === 'home') {
    return (
      <div className='flex h-full flex-col bg-[linear-gradient(180deg,#f7f9fc_0%,#ebf1f8_100%)] text-[#0f172a]'>
        <div className='border-b border-[#dce4ef] px-6 py-5'>
          <div className='text-[28px] font-semibold tracking-[-0.03em]'>
            Chrome Start
          </div>
          <p className='mt-2 max-w-[720px] text-sm leading-6 text-[#475569]'>
            Quick-launch the portfolio, external profiles, and source browser
            without leaving the desktop shell.
          </p>
        </div>
        <div className='grid flex-1 grid-cols-1 gap-4 overflow-auto p-6 md:grid-cols-2 xl:grid-cols-3'>
          {chromeLinks.map((link) => (
            <button
              key={link.title}
              onClick={link.action}
              className='rounded-[22px] border border-white/70 bg-white/90 p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-0.5'
            >
              <div className='text-[18px] font-semibold'>{link.title}</div>
              <div className='mt-2 text-sm leading-6 text-[#475569]'>
                {link.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (app.mode === 'external') {
    return (
      <div className='grid h-full place-items-center bg-[linear-gradient(180deg,#f8fafc_0%,#e9eef5_100%)] p-8'>
        <div className='w-full max-w-[720px] rounded-[28px] border border-white/70 bg-white/90 p-8 text-[#0f172a] shadow-[0_24px_60px_rgba(15,23,42,0.12)]'>
          <div className='text-[26px] font-semibold'>Preview unavailable</div>
          <p className='mt-3 text-sm leading-7 text-[#475569]'>
            {app.description}
          </p>
          <div className='mt-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-sm text-[#334155]'>
            {app.address}
          </div>
          <button
            onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
            className='mt-6 rounded-2xl bg-[#0b61d8] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#084eaf]'
          >
            Open on GitHub
          </button>
        </div>
      </div>
    );
  }

  return (
    <iframe
      key={`${browserAppId}-${refreshToken}`}
      src={app.url}
      title={app.title}
      className='h-full w-full border-0 bg-white'
      onFocus={onIframeFocus}
    />
  );
}
