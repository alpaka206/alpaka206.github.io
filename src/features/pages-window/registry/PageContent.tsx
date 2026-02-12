import { lazy, Suspense, type ComponentType } from 'react';
import type { PageType } from '@/stores/useDesktopStore';

type LazyComponent = React.LazyExoticComponent<ComponentType>;

type PageEntry =
  | { kind: 'component'; Component: LazyComponent }
  | { kind: 'iframe'; src: string; title: string };

const PAGE_CONTENT_MAP: Record<PageType, PageEntry> = {
  about: {
    kind: 'component',
    Component: lazy(() => import('@/pages/ProfilePage')),
  },
  awards: {
    kind: 'component',
    Component: lazy(() => import('@/pages/PrizePage')),
  },
  comatching: {
    kind: 'component',
    Component: lazy(() => import('@/features/projects/comatching/Page')),
  },
  'share-it': {
    kind: 'component',
    Component: lazy(() => import('@/features/projects/shareit/Page')),
  },
  alnc: {
    kind: 'component',
    Component: lazy(() => import('@/features/projects/alnc/Page')),
  },
  blog: {
    kind: 'iframe',
    src: 'https://alpaka206.vercel.app/',
    title: 'Tech Blog',
  },
  insta: {
    kind: 'iframe',
    src: 'https://www.instagram.com/alpaka_dev/embed',
    title: 'Instagram',
  },
};

export function PageContent({ pageId }: { pageId: PageType }) {
  const entry = PAGE_CONTENT_MAP[pageId];

  if (entry.kind === 'iframe') {
    return (
      <iframe
        src={entry.src}
        title={entry.title}
        className='w-full h-full border-0'
      />
    );
  }

  const { Component } = entry;
  return (
    <Suspense
      fallback={
        <div className='p-4 text-black/60 text-sm'>Loading...</div>
      }
    >
      <Component />
    </Suspense>
  );
}
