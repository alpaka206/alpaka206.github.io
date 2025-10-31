import type { PageTab } from '@/stores/useDesktopStore';
import { resolveUrl } from '@/utils/resolveUrl';

export const PAGE_TABS: Record<string, PageTab> = {
  about: {
    id: 'about' as any,
    title: 'About Me',
    icon: '/assets/common/system/window/Profile.webp',
    content: (
      <iframe
        src={resolveUrl('/profile')}
        title='About Me'
        className='w-full h-full'
      />
    ),
  },
  blog: {
    id: 'blog' as any,
    title: 'Tech Blog',
    icon: '/assets/common/socials/Blog.webp',
    content: (
      <iframe
        src='https://alpaka206.vercel.app/'
        title='Tech Blog'
        className='w-full h-full'
      />
    ),
  },
  insta: {
    id: 'insta' as any,
    title: 'Instagram',
    icon: '/assets/common/socials/Insta.webp',
    content: (
      <iframe
        src='https://www.instagram.com/alpaka_dev/embed'
        title='Instagram'
        className='w-full h-full'
      />
    ),
  },
  awards: {
    id: 'awards' as any,
    title: 'Awards',
    icon: '/assets/common/prize/icon.webp',
    content: (
      <iframe
        src={resolveUrl('/prize')}
        title='Awards'
        className='w-full h-full'
      />
    ),
  },
};
