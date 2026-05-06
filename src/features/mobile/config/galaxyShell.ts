import type { CodeWorkspaceId, PageType, TextFileId } from '@/stores';

const svgDataUri = (markup: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markup)}`;

const phoneSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="8" x2="64" y1="64" y2="8">
        <stop offset="0" stop-color="#03a86b"/>
        <stop offset="1" stop-color="#7be8a3"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M25.5 20.5c-2.4 1.5-3.2 6.1-1.9 10.9 1.8 6.9 7.1 13.5 13.4 17.2 4.8 2.8 9.7 3.3 11.8 1.2l2.3-2.4c1.1-1.1 1-2.9-.2-3.9l-5.5-4.5c-1-.8-2.5-.8-3.5.1l-2.6 2.4c-4-2.2-7.1-5.4-9.3-9.5l2.4-2.4c1-1 1.1-2.5.3-3.6l-4.1-5.3c-.8-1.2-2.4-1.5-3.1-.2z" fill="#fff"/>
  </svg>
`;

const messagesSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="8" x2="64" y1="64" y2="8">
        <stop offset="0" stop-color="#1fb36c"/>
        <stop offset="1" stop-color="#74eec1"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M18 22.5c0-3 2.4-5.5 5.5-5.5h25c3 0 5.5 2.4 5.5 5.5v16c0 3-2.4 5.5-5.5 5.5H35L23.5 54v-10H23c-2.8-.2-5-2.6-5-5.4z" fill="#fff"/>
    <path d="M27 29h18M27 36h13" stroke="#20b76d" stroke-width="3.5" stroke-linecap="round"/>
  </svg>
`;

const internetSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="60" y2="10">
        <stop offset="0" stop-color="#1a65ff"/>
        <stop offset=".52" stop-color="#31b7ff"/>
        <stop offset="1" stop-color="#8cf4ff"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <circle cx="36" cy="36" r="19" fill="none" stroke="#fff" stroke-width="5"/>
    <path d="M17 39c12 5.5 25 1.2 38-12M28 18c4.8 10.8 4.8 24.4 0 36M44 18c-4.8 10.8-4.8 24.4 0 36" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
  </svg>
`;

const filesSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="62" y2="11">
        <stop offset="0" stop-color="#f1a400"/>
        <stop offset="1" stop-color="#ffd75d"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M16 27c0-3.2 2.6-5.8 5.8-5.8h10.8l5 5.8h12.6c3.2 0 5.8 2.6 5.8 5.8v14.4c0 3.2-2.6 5.8-5.8 5.8H21.8c-3.2 0-5.8-2.6-5.8-5.8z" fill="#fff" opacity=".95"/>
    <path d="M16 31.5h40" stroke="#f5b315" stroke-width="3.5"/>
  </svg>
`;

const settingsSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="63" y2="9">
        <stop offset="0" stop-color="#667085"/>
        <stop offset="1" stop-color="#d0d5dd"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M36 19.5 40 23l5.2-1.3 3.5 6.1-3.8 3.8c.2 1.4.2 2.8 0 4.2l3.8 3.8-3.5 6.1L40 44.5l-4 3.5-4-3.5-5.2 1.3-3.5-6.1 3.8-3.8a17 17 0 0 1 0-4.2l-3.8-3.8 3.5-6.1L32 23z" fill="#fff"/>
    <circle cx="36" cy="36" r="7.2" fill="#8a94a6"/>
  </svg>
`;

const notesSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="63" y2="9">
        <stop offset="0" stop-color="#facc15"/>
        <stop offset="1" stop-color="#fff2a8"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <rect x="21" y="15" width="30" height="42" rx="6" fill="#fff"/>
    <path d="M27 27h18M27 35h18M27 43h12" stroke="#d9a900" stroke-width="3" stroke-linecap="round"/>
  </svg>
`;

const terminalSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="63" y2="9">
        <stop offset="0" stop-color="#111827"/>
        <stop offset="1" stop-color="#475569"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M21 28.5 31 36l-10 7.5" fill="none" stroke="#7dd3fc" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36 45h15" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  </svg>
`;

const profileSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="63" y2="9">
        <stop offset="0" stop-color="#3b82f6"/>
        <stop offset=".55" stop-color="#9b7cff"/>
        <stop offset="1" stop-color="#f472b6"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <circle cx="36" cy="29" r="10" fill="#fff"/>
    <path d="M18 55c2.8-9.4 9.4-14.4 18-14.4S51.2 45.6 54 55" fill="#fff"/>
  </svg>
`;

const awardsSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="10" x2="62" y1="62" y2="10">
        <stop offset="0" stop-color="#ea580c"/>
        <stop offset=".48" stop-color="#f97316"/>
        <stop offset="1" stop-color="#fde047"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M27 17h18v18.5a9 9 0 0 1-18 0z" fill="#fff"/>
    <path d="M26 24h-7v7a8 8 0 0 0 8 8M46 24h7v7a8 8 0 0 1-8 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
    <path d="M32 51h8l2.5 6h-13z" fill="#fff"/>
  </svg>
`;

const codeSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="g" x1="9" x2="63" y1="63" y2="9">
        <stop offset="0" stop-color="#075985"/>
        <stop offset="1" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <rect width="72" height="72" rx="22" fill="url(#g)"/>
    <path d="M29 24 18 36l11 12M43 24l11 12-11 12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="m39 20-6 32" stroke="#e0f2fe" stroke-width="4" stroke-linecap="round"/>
  </svg>
`;

const githubSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72">
    <rect width="72" height="72" rx="22" fill="#171717"/>
    <circle cx="36" cy="36" r="21" fill="#fff"/>
    <path d="M36 18.5c-9.9 0-18 8-18 18 0 7.9 5.1 14.6 12.2 17 .9.2 1.2-.4 1.2-.9v-3.1c-5 1.1-6-2.1-6-2.1-.8-2-2-2.6-2-2.6-1.6-1.1.1-1.1.1-1.1 1.8.1 2.8 1.9 2.8 1.9 1.6 2.8 4.2 2 5.2 1.5.2-1.2.6-2 1.1-2.4-4-.5-8.2-2-8.2-8.8 0-1.9.7-3.5 1.8-4.8-.2-.4-.8-2.3.2-4.8 0 0 1.5-.5 4.9 1.8a17 17 0 0 1 8.9 0c3.4-2.3 4.9-1.8 4.9-1.8 1 2.5.4 4.4.2 4.8 1.1 1.3 1.8 2.9 1.8 4.8 0 6.8-4.2 8.3-8.2 8.8.7.6 1.2 1.7 1.2 3.4v4.5c0 .5.3 1.1 1.2.9A18 18 0 0 0 54 36.5c0-10-8.1-18-18-18z" fill="#171717"/>
  </svg>
`;

export const PHONE_SYSTEM_ICONS = {
  phone: svgDataUri(phoneSvg),
  messages: svgDataUri(messagesSvg),
  internet: svgDataUri(internetSvg),
  files: svgDataUri(filesSvg),
  settings: svgDataUri(settingsSvg),
  notes: svgDataUri(notesSvg),
  terminal: svgDataUri(terminalSvg),
  profile: svgDataUri(profileSvg),
  awards: svgDataUri(awardsSvg),
  code: svgDataUri(codeSvg),
  github: svgDataUri(githubSvg),
} as const;

export type PhoneFolderId = 'portfolio' | 'projects' | 'social' | 'tools';

export type PhoneLaunch =
  | { kind: 'page'; pageId: PageType }
  | { kind: 'folder'; folderId: PhoneFolderId }
  | { kind: 'text-file'; fileId: TextFileId }
  | { kind: 'terminal' }
  | { kind: 'code'; workspaceId: CodeWorkspaceId };

export type PhoneApp = {
  id: string;
  label: string;
  icon: string;
  launch: PhoneLaunch;
  system?: boolean;
};

export const PHONE_APPS: PhoneApp[] = [
  {
    id: 'phone',
    label: 'Phone',
    icon: PHONE_SYSTEM_ICONS.phone,
    launch: { kind: 'text-file', fileId: 'contact' },
    system: true,
  },
  {
    id: 'messages',
    label: 'Messages',
    icon: PHONE_SYSTEM_ICONS.messages,
    launch: { kind: 'text-file', fileId: 'now' },
    system: true,
  },
  {
    id: 'internet',
    label: 'Internet',
    icon: PHONE_SYSTEM_ICONS.internet,
    launch: { kind: 'page', pageId: 'chrome' },
    system: true,
  },
  {
    id: 'my-files',
    label: 'My Files',
    icon: PHONE_SYSTEM_ICONS.files,
    launch: { kind: 'folder', folderId: 'projects' },
    system: true,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: PHONE_SYSTEM_ICONS.profile,
    launch: { kind: 'page', pageId: 'about' },
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: PHONE_SYSTEM_ICONS.profile,
    launch: { kind: 'folder', folderId: 'portfolio' },
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: PHONE_SYSTEM_ICONS.files,
    launch: { kind: 'folder', folderId: 'projects' },
  },
  {
    id: 'social',
    label: 'Social',
    icon: PHONE_SYSTEM_ICONS.github,
    launch: { kind: 'folder', folderId: 'social' },
  },
  {
    id: 'awards',
    label: 'Awards',
    icon: PHONE_SYSTEM_ICONS.awards,
    launch: { kind: 'page', pageId: 'awards' },
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: PHONE_SYSTEM_ICONS.github,
    launch: { kind: 'page', pageId: 'github' },
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: '/assets/common/brands/blog.webp',
    launch: { kind: 'page', pageId: 'blog' },
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '/assets/common/brands/instagram.webp',
    launch: { kind: 'page', pageId: 'insta' },
  },
  {
    id: 'notes',
    label: 'Notes',
    icon: PHONE_SYSTEM_ICONS.notes,
    launch: { kind: 'text-file', fileId: 'readme' },
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: PHONE_SYSTEM_ICONS.notes,
    launch: { kind: 'text-file', fileId: 'resume' },
  },
  {
    id: 'terminal',
    label: 'Terminal',
    icon: PHONE_SYSTEM_ICONS.terminal,
    launch: { kind: 'terminal' },
  },
  {
    id: 'code',
    label: 'Code',
    icon: PHONE_SYSTEM_ICONS.code,
    launch: { kind: 'code', workspaceId: 'portfolio-workspace' },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: PHONE_SYSTEM_ICONS.settings,
    launch: { kind: 'page', pageId: 'settings' },
    system: true,
  },
  {
    id: 'comatching',
    label: 'COMATCHING',
    icon: '/assets/projects/comatching/comatching-icon.webp',
    launch: { kind: 'page', pageId: 'comatching' },
  },
  {
    id: 'share-it',
    label: 'Share-It',
    icon: '/assets/projects/share-it/share-it-icon.webp',
    launch: { kind: 'page', pageId: 'share-it' },
  },
  {
    id: 'alnc',
    label: 'ALNC',
    icon: '/assets/projects/alnc/alnc-icon.webp',
    launch: { kind: 'page', pageId: 'alnc' },
  },
];

export const PHONE_HOME_APP_IDS = [
  'portfolio',
  'projects',
  'awards',
  'github',
  'blog',
  'instagram',
  'notes',
  'terminal',
] as const;

export const PHONE_DOCK_APP_IDS = [
  'phone',
  'messages',
  'internet',
  'settings',
] as const;

export const PHONE_FOLDER_APP_IDS: Record<PhoneFolderId, string[]> = {
  portfolio: ['profile', 'resume', 'notes', 'awards', 'phone', 'messages'],
  projects: ['comatching', 'share-it', 'alnc', 'code'],
  social: ['github', 'blog', 'instagram'],
  tools: ['internet', 'terminal', 'code', 'settings'],
};

export const PHONE_FOLDER_TITLES: Record<PhoneFolderId, string> = {
  portfolio: 'Portfolio',
  projects: 'Projects',
  social: 'Social',
  tools: 'Tools',
};

export const PHONE_APP_BY_ID = new Map(PHONE_APPS.map((app) => [app.id, app]));
