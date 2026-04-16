import {
  CHROME_ICON,
  SETTINGS_ICON,
} from '@/features/desktop/config/shell';
import type { PageTab, PageType } from '@/stores/useDesktopStore';

export const PORTFOLIO_DEPLOY_ORIGIN = 'https://alpaka206.github.io';

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
  chrome: {
    id: 'chrome',
    title: 'Chrome',
    icon: CHROME_ICON,
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
  settings: {
    id: 'settings',
    title: 'Settings',
    icon: SETTINGS_ICON,
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
    title: '새차처럼',
    icon: '/assets/projects/alnc/alnc-icon.webp',
  },
};

export const PAGE_PATHS: Partial<Record<PageType, string>> = {
  about: '/profile',
  awards: '/prize',
  github: '/github',
  settings: '/settings',
  comatching: '/comatching',
  'share-it': '/share-it',
  alnc: '/alnc',
};

export function getPortfolioOrigin() {
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }

  return PORTFOLIO_DEPLOY_ORIGIN;
}

export function getAbsolutePortfolioUrl(path: string) {
  return `${getPortfolioOrigin()}${path}`;
}

export function getPageAddress(pageId: PageType) {
  if (pageId === 'chrome') {
    return 'https://www.google.com/webhp?igu=1';
  }

  if (pageId === 'blog') {
    return 'https://alpaka206.vercel.app/';
  }

  if (pageId === 'insta') {
    return 'https://www.instagram.com/alpaka_dev/';
  }

  const internalPath = PAGE_PATHS[pageId];

  if (internalPath) {
    return getAbsolutePortfolioUrl(internalPath);
  }

  return getAbsolutePortfolioUrl('/');
}
