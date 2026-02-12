import type { PageTab } from '@/stores/useDesktopStore';

export const PAGE_TABS: Record<string, PageTab> = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: '/assets/common/system/window/Profile.webp',
  },
  blog: {
    id: 'blog',
    title: 'Tech Blog',
    icon: '/assets/common/socials/Blog.webp',
  },
  insta: {
    id: 'insta',
    title: 'Instagram',
    icon: '/assets/common/socials/Insta.webp',
  },
  awards: {
    id: 'awards',
    title: 'Awards',
    icon: '/assets/common/prize/icon.webp',
  },
};
