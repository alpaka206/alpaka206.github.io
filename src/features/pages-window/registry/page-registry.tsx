import type { PageTab } from '@/store/useDesktopStore';
import { resolveUrl } from '@/utils/resolveUrl';

export const PAGE_TABS: Record<string, PageTab> = {
  about: {
    id: 'about' as any,
    title: 'About Me',
    icon: '/assets/Profile.webp',
    content: (
      <iframe
        src={resolveUrl('/Profile')}
        title='About Me'
        className='w-full h-full'
      />
    ),
  },
  blog: {
    id: 'blog' as any,
    title: 'Tech Blog',
    icon: '/assets/Blog.webp',
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
    icon: '/assets/Insta.webp',
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
    icon: '/assets/prize.webp',
    content: (
      <iframe
        src={resolveUrl('/Prize')}
        title='Awards'
        className='w-full h-full'
      />
    ),
  },
};
