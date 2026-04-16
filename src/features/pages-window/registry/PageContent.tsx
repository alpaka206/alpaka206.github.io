import {
  lazy,
  Suspense,
  type ComponentType,
  type LazyExoticComponent,
} from 'react';
import { BROWSER_APPS } from '@/features/desktop/config/shell';
import type { PageType } from '@/stores/useDesktopStore';

type LazyComponent = LazyExoticComponent<ComponentType>;

const PAGE_CONTENT_MAP: Partial<Record<PageType, LazyComponent>> = {
  about: lazy(() => import('@/pages/ProfilePage')),
  awards: lazy(() => import('@/pages/PrizePage')),
  comatching: lazy(() => import('@/features/projects/comatching/Page')),
  'share-it': lazy(() => import('@/features/projects/share-it/Page')),
  alnc: lazy(() => import('@/features/projects/alnc/Page')),
};

export function PageContent({
  pageId,
  refreshToken = 0,
}: {
  pageId: PageType;
  refreshToken?: number;
}) {
  const Component = PAGE_CONTENT_MAP[pageId];

  if (Component) {
    return (
      <Suspense
        fallback={<div className='p-4 text-sm text-black/60'>Loading...</div>}
      >
        <Component key={`${pageId}-${refreshToken}`} />
      </Suspense>
    );
  }

  if (pageId === 'github') {
    const app = BROWSER_APPS.github;
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

  const app = pageId === 'blog' ? BROWSER_APPS.blog : BROWSER_APPS.insta;

  return (
    <iframe
      key={`${pageId}-${refreshToken}`}
      src={app.url}
      title={app.title}
      className='h-full w-full border-0 bg-white'
    />
  );
}
