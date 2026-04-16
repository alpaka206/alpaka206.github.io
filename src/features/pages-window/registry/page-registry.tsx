import type { PageTab, PageType } from '@/stores/useDesktopStore';

export const PAGE_TABS: Record<PageType, PageTab> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: '/assets/common/desktop/profile-shortcut.webp',
  },
  awards: {
    id: 'awards',
    title: 'Awards',
    icon: '/assets/common/awards/awards-icon.webp',
  },
  blog: {
    id: 'blog',
    title: 'Tech Blog',
    icon: '/assets/common/brands/blog.webp',
  },
  insta: {
    id: 'insta',
    title: 'Instagram',
    icon: '/assets/common/brands/instagram.webp',
  },
  github: {
    id: 'github',
    title: 'GitHub',
    icon: '/assets/common/brands/github.webp',
  },
  comatching: {
    id: 'comatching',
    title: 'COMATCHING',
    icon: '/assets/projects/comatching/comatching-icon.webp',
  },
  'share-it': {
    id: 'share-it',
    title: 'Share-It',
    icon: '/assets/projects/share-it/share-it-icon.webp',
  },
  alnc: {
    id: 'alnc',
    title: '인감처럼',
    icon: '/assets/projects/alnc/alnc-icon.webp',
  },
};

export const PAGE_ADDRESSES: Record<PageType, string> = {
  about: 'portfolio://about-me',
  awards: 'portfolio://awards',
  blog: 'https://alpaka206.vercel.app/',
  insta: 'https://www.instagram.com/alpaka_dev/',
  github: 'https://github.com/alpaka206',
  comatching: 'portfolio://projects/comatching',
  'share-it': 'portfolio://projects/share-it',
  alnc: 'portfolio://projects/alnc',
};
