import { ABOUT } from '@/features/profile/data/about';
import { prizeList } from '@/features/prize/data/prizeData';

export const DESKTOP_FEATURED_ASSETS = [
  '/assets/common/system/window/Profile.webp',
  '/assets/common/system/window/folder.webp',
  '/assets/common/socials/Blog.webp',
  '/assets/common/socials/Insta.webp',
  '/assets/common/socials/Github.webp',
  '/assets/common/prize/icon.webp',
  '/assets/window-controls/minimize.webp',
  '/assets/window-controls/maximize.webp',
  '/assets/window-controls/close.webp',
  '/assets/projects/comatching/icon.webp',
  '/assets/projects/share-it/icon.webp',
  '/assets/projects/alnc/icon.webp',
] as const;

export const PROFILE_FEATURED_ASSETS = [ABOUT.avatarSrc] as const;

export const AWARDS_FEATURED_ASSETS: readonly string[] = prizeList
  .slice(0, 4)
  .map((prize) => prize.src);
