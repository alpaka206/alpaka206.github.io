import type { CSSProperties } from 'react';
import type {
  BrowserAppId,
  CodeWorkspaceId,
  DesktopShortcutItem,
  NoteColorId,
  WallpaperId,
} from '@/stores/desktopModels';

const svgDataUri = (markup: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;

const recycleBinSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill="#eef4fb"/>
    <path d="M20 18h24l2 6H18l2-6z" fill="#6c8fb1"/>
    <path d="M18 24h28l-3 28a4 4 0 0 1-4 4H25a4 4 0 0 1-4-4l-3-28z" fill="#cfe6ff" stroke="#7ba7d6" stroke-width="2"/>
    <path d="M28 12h8a3 3 0 0 1 3 3v3H25v-3a3 3 0 0 1 3-3z" fill="#98bce3"/>
    <path d="M26 30v18M32 30v18M38 30v18" stroke="#7ba7d6" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

const stickyNoteSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="note" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#ffe47a"/>
        <stop offset="100%" stop-color="#ffce4f"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="12" fill="url(#note)"/>
    <path d="M47 64V45a6 6 0 0 1 6-6h11" fill="#f6ba2b"/>
    <path d="M16 22h32M16 31h24M16 40h20" stroke="#9f6a00" stroke-width="3" stroke-linecap="round"/>
  </svg>
`;

const windowsSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="16" fill="#0b61d8"/>
    <path d="M10 14 30 11v22H10zm22-3 22-3v25H32zm-22 24h20v19l-20-3zm22 0h22v22l-22-3z" fill="#fff"/>
  </svg>
`;

const wifiSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#e7eefb" d="M12 18.5 8.5 15a5 5 0 0 1 7 0zm0-4.8-5.8-5.1a10 10 0 0 1 11.6 0zm0-5.6L2 5a15.5 15.5 0 0 1 20 0z"/>
  </svg>
`;

const volumeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path fill="#e7eefb" d="M4 9h4l5-4v14l-5-4H4zm12.4 3a4.4 4.4 0 0 0-2.4-3.9v7.8a4.4 4.4 0 0 0 2.4-3.9zm0-8a10.3 10.3 0 0 1 0 16l-1.4-1.4a8.3 8.3 0 0 0 0-13.2z"/>
  </svg>
`;

const batterySvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="3" y="7" width="17" height="10" rx="2" fill="none" stroke="#e7eefb" stroke-width="2"/>
    <rect x="5" y="9" width="10" height="6" rx="1" fill="#7be495"/>
    <rect x="20" y="10" width="2" height="4" rx="1" fill="#e7eefb"/>
  </svg>
`;

export const WINDOWS_ICON = svgDataUri(windowsSvg);
export const CHROME_ICON = '/assets/common/brands/chrome.webp';
export const VS_CODE_ICON = '/assets/common/brands/visual-studio-code.webp';
export const RECYCLE_BIN_ICON = svgDataUri(recycleBinSvg);
export const STICKY_NOTE_ICON = svgDataUri(stickyNoteSvg);
export const WIFI_ICON = svgDataUri(wifiSvg);
export const VOLUME_ICON = svgDataUri(volumeSvg);
export const BATTERY_ICON = svgDataUri(batterySvg);

export const BROWSER_APPS: Record<
  BrowserAppId,
  {
    title: string;
    icon: string;
    mode: 'home' | 'iframe' | 'external';
    url: string;
    address: string;
    description?: string;
  }
> = {
  'browser-home': {
    title: 'Chrome',
    icon: CHROME_ICON,
    mode: 'home',
    url: 'chrome://newtab',
    address: 'chrome://newtab',
    description: 'Frequently used portfolio destinations and external links.',
  },
  blog: {
    title: 'Tech Blog',
    icon: '/assets/common/brands/blog.webp',
    mode: 'iframe',
    url: 'https://alpaka206.vercel.app/',
    address: 'https://alpaka206.vercel.app/',
  },
  insta: {
    title: 'Instagram',
    icon: '/assets/common/brands/instagram.webp',
    mode: 'iframe',
    url: 'https://www.instagram.com/alpaka_dev/embed',
    address: 'https://www.instagram.com/alpaka_dev/',
  },
  github: {
    title: 'GitHub',
    icon: '/assets/common/brands/github.webp',
    mode: 'external',
    url: 'https://github.com/alpaka206',
    address: 'https://github.com/alpaka206',
    description:
      'GitHub blocks rich in-app embedding, so the browser window shows a native handoff card.',
  },
};

const PORTFOLIO_GITHUB1S_TARGET = {
  owner: 'alpaka206',
  repo: 'alpaka206.github.io',
  branch: 'HEAD',
  path: 'src/pages/MainPage.tsx',
  title: 'Visual Studio Code',
} as const;

export const CODE_WORKSPACES: Record<
  CodeWorkspaceId,
  {
    title: string;
    icon: string;
    owner: string;
    repo: string;
    branch: string;
    path: string;
  }
> = {
  'portfolio-workspace': {
    ...PORTFOLIO_GITHUB1S_TARGET,
    icon: VS_CODE_ICON,
  },
};

export const NOTE_COLORS: Record<
  NoteColorId,
  { label: string; tile: string; surface: string; accent: string }
> = {
  yellow: {
    label: 'Honey',
    tile: 'linear-gradient(180deg,#ffe58b 0%,#ffd55d 100%)',
    surface: '#ffe58b',
    accent: '#d79f09',
  },
  blue: {
    label: 'Sky',
    tile: 'linear-gradient(180deg,#b7e3ff 0%,#8bd0ff 100%)',
    surface: '#b7e3ff',
    accent: '#2f7db7',
  },
  pink: {
    label: 'Blush',
    tile: 'linear-gradient(180deg,#ffc4dd 0%,#ff9fc6 100%)',
    surface: '#ffc4dd',
    accent: '#bb4d7a',
  },
};

export const WALLPAPERS: Record<
  WallpaperId,
  { id: WallpaperId; label: string; style: CSSProperties; accent: string }
> = {
  'windows-cloud': {
    id: 'windows-cloud',
    label: 'Cloud',
    style: {
      backgroundImage: "url('/assets/common/desktop/windows-cloud-wallpaper.webp')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    },
    accent: '#0b61d8',
  },
  'aurora-flow': {
    id: 'aurora-flow',
    label: 'Aurora',
    style: {
      background:
        'radial-gradient(circle at 18% 18%, rgba(143,252,197,0.28) 0, transparent 26%), radial-gradient(circle at 82% 14%, rgba(94,182,255,0.34) 0, transparent 34%), linear-gradient(135deg, #09111f 0%, #10284d 48%, #0f5aa7 100%)',
    },
    accent: '#5bb7ff',
  },
  'sunset-panel': {
    id: 'sunset-panel',
    label: 'Sunset',
    style: {
      background:
        'radial-gradient(circle at 20% 15%, rgba(255,219,156,0.26) 0, transparent 22%), linear-gradient(145deg, #3d1f48 0%, #86385d 45%, #d25d49 82%, #f4ab5f 100%)',
    },
    accent: '#ffb96e',
  },
};

export const DEFAULT_DESKTOP_ITEMS: DesktopShortcutItem[] = [
  {
    id: 'shortcut:about',
    kind: 'page',
    pageId: 'about',
    title: 'About Me',
    icon: '/assets/common/desktop/profile-shortcut.webp',
    position: { x: 28, y: 28 },
    isSystem: true,
  },
  {
    id: 'shortcut:projects',
    kind: 'folder',
    folderId: 'projects',
    contentType: 'projects',
    title: 'Projects',
    icon: '/assets/common/desktop/folder-shortcut.webp',
    position: { x: 28, y: 152 },
    isSystem: true,
  },
  {
    id: 'shortcut:chrome',
    kind: 'browser',
    browserAppId: 'browser-home',
    title: 'Chrome',
    icon: CHROME_ICON,
    position: { x: 28, y: 276 },
    isSystem: true,
  },
  {
    id: 'shortcut:blog',
    kind: 'page',
    pageId: 'blog',
    title: 'Tech Blog',
    icon: '/assets/common/brands/blog.webp',
    position: { x: 28, y: 400 },
    isSystem: true,
  },
  {
    id: 'shortcut:insta',
    kind: 'page',
    pageId: 'insta',
    title: 'Instagram',
    icon: '/assets/common/brands/instagram.webp',
    position: { x: 138, y: 28 },
    isSystem: true,
  },
  {
    id: 'shortcut:awards',
    kind: 'page',
    pageId: 'awards',
    title: 'Awards',
    icon: '/assets/common/awards/awards-icon.webp',
    position: { x: 138, y: 152 },
    isSystem: true,
  },
  {
    id: 'shortcut:github',
    kind: 'page',
    pageId: 'github',
    title: 'GitHub',
    icon: '/assets/common/brands/github.webp',
    position: { x: 138, y: 276 },
    isSystem: true,
  },
  {
    id: 'shortcut:vscode',
    kind: 'code',
    workspaceId: 'portfolio-workspace',
    title: 'VS Code',
    icon: VS_CODE_ICON,
    position: { x: 138, y: 400 },
    isSystem: true,
  },
  {
    id: 'shortcut:recycle-bin',
    kind: 'folder',
    folderId: 'recycle-bin',
    contentType: 'recycle-bin',
    title: 'Recycle Bin',
    icon: RECYCLE_BIN_ICON,
    position: { x: 248, y: 28 },
    isSystem: true,
  },
];

export const PINNED_APPS = [
  {
    id: 'pin:about',
    label: 'About Me',
    icon: '/assets/common/desktop/profile-shortcut.webp',
    launch: { kind: 'page' as const, pageId: 'about' as const },
  },
  {
    id: 'pin:projects',
    label: 'Projects',
    icon: '/assets/common/desktop/folder-shortcut.webp',
    launch: { kind: 'folder' as const, folderId: 'projects' as const },
  },
  {
    id: 'pin:chrome',
    label: 'Chrome',
    icon: CHROME_ICON,
    launch: { kind: 'browser' as const, browserAppId: 'browser-home' as const },
  },
  {
    id: 'pin:vscode',
    label: 'VS Code',
    icon: VS_CODE_ICON,
    launch: {
      kind: 'code' as const,
      workspaceId: 'portfolio-workspace' as const,
    },
  },
] as const;

export const START_MENU_APPS = [
  ...PINNED_APPS,
  {
    id: 'start:blog',
    label: 'Tech Blog',
    icon: '/assets/common/brands/blog.webp',
    launch: { kind: 'page' as const, pageId: 'blog' as const },
  },
  {
    id: 'start:insta',
    label: 'Instagram',
    icon: '/assets/common/brands/instagram.webp',
    launch: { kind: 'page' as const, pageId: 'insta' as const },
  },
  {
    id: 'start:awards',
    label: 'Awards',
    icon: '/assets/common/awards/awards-icon.webp',
    launch: { kind: 'page' as const, pageId: 'awards' as const },
  },
  {
    id: 'start:github',
    label: 'GitHub',
    icon: '/assets/common/brands/github.webp',
    launch: { kind: 'page' as const, pageId: 'github' as const },
  },
  {
    id: 'start:notepad',
    label: 'Notepad',
    icon: STICKY_NOTE_ICON,
    launch: { kind: 'note-create' as const },
  },
] as const;

export function getWallpaperStyle(wallpaperId: WallpaperId) {
  return WALLPAPERS[wallpaperId].style;
}
