import type { MediaKey, ProjectSlug } from '@/content/types';
import type { NoteId } from '@/content/conversation';

/**
 * Every app the desktop and phone shells can open. Metadata only: the React
 * components are wired up lazily in src/apps/registry.ts so that importing this
 * file never pulls an app's code into the initial bundle.
 */
export type AppId =
  | 'finder'
  | 'portfolio'
  | 'about'
  | 'messages'
  | 'mail'
  | 'photos'
  | 'notes'
  | 'safari'
  | 'github'
  | 'blog'
  | 'terminal'
  | 'preview'
  | 'settings';

export type FinderLocation = 'projects' | 'recents' | 'documents' | 'awards' | 'applications' | 'desktop' | 'trash';
export type ProfileSection = 'overview' | 'career' | 'skills' | 'education' | 'awards' | 'contact';
export type SettingsPane = 'appearance' | 'wallpaper' | 'desktop-dock' | 'accessibility' | 'sound' | 'privacy' | 'about-site';

/** What an app needs to know to open a particular window. */
export interface AppProps {
  finder: { location?: FinderLocation };
  portfolio: { slug: ProjectSlug };
  about: { view?: 'about' | 'profile'; section?: ProfileSection };
  messages: Record<string, never>;
  mail: { subject?: string };
  photos: { album?: string };
  notes: { note?: NoteId };
  /** `request`: a new value for each request to show `url`, so asking for the same link twice opens it twice. */
  safari: { url?: string; request?: number };
  github: Record<string, never>;
  blog: Record<string, never>;
  terminal: Record<string, never>;
  preview: { page?: number };
  settings: { pane?: SettingsPane };
}

export interface Size {
  w: number;
  h: number;
}

export interface AppMeta {
  id: AppId;
  /** Name in the menu bar and under Dock tooltips, as Korean macOS shows it. */
  name: string;
  icon: MediaKey;
  /** One window per app (true) or one per document (false). */
  singleton: boolean;
  defaultSize: Size;
  minSize: Size;
  /** Phone home screen label when it differs from the desktop name. */
  phoneName?: string;
  /**
   * Window chrome: 'unified' (52 pt toolbar, traffic lights at 19,19) or
   * 'titlebar' (32 pt title bar, lights at 9,9, Bold 13 title at x 82), per macos.md §3–4.
   */
  chrome?: 'unified' | 'titlebar';
}

const meta = (m: AppMeta) => m;

export const APPS: Record<AppId, AppMeta> = {
  finder: meta({ id: 'finder', name: 'Finder', icon: 'icons/projects', singleton: false, defaultSize: { w: 920, h: 560 }, minSize: { w: 560, h: 320 }, phoneName: '프로젝트' }),
  portfolio: meta({ id: 'portfolio', name: '포트폴리오', icon: 'icons/portfolio', singleton: false, defaultSize: { w: 1040, h: 720 }, minSize: { w: 640, h: 420 } }),
  about: meta({ id: 'about', name: '소개', icon: 'icons/about', singleton: true, defaultSize: { w: 820, h: 600 }, minSize: { w: 620, h: 420 } }),
  messages: meta({ id: 'messages', name: '메시지', icon: 'icons/messages', singleton: true, defaultSize: { w: 900, h: 640 }, minSize: { w: 620, h: 420 } }),
  mail: meta({ id: 'mail', name: 'Mail', icon: 'icons/mail', singleton: true, defaultSize: { w: 640, h: 560 }, minSize: { w: 480, h: 360 }, phoneName: '메일' }),
  photos: meta({ id: 'photos', name: '사진', icon: 'icons/photos', singleton: true, defaultSize: { w: 1040, h: 700 }, minSize: { w: 640, h: 420 } }),
  notes: meta({ id: 'notes', name: '메모', icon: 'icons/notes', singleton: true, defaultSize: { w: 900, h: 600 }, minSize: { w: 600, h: 380 } }),
  safari: meta({ id: 'safari', name: 'Safari', icon: 'icons/web', singleton: true, defaultSize: { w: 1120, h: 740 }, minSize: { w: 600, h: 400 } }),
  github: meta({ id: 'github', name: 'GitHub', icon: 'icons/github', singleton: true, defaultSize: { w: 1000, h: 700 }, minSize: { w: 600, h: 420 } }),
  blog: meta({ id: 'blog', name: '블로그', icon: 'icons/blog', singleton: true, defaultSize: { w: 1100, h: 740 }, minSize: { w: 600, h: 420 } }),
  terminal: meta({ id: 'terminal', name: '터미널', icon: 'icons/terminal', chrome: 'titlebar', singleton: true, defaultSize: { w: 760, h: 480 }, minSize: { w: 420, h: 260 } }),
  preview: meta({ id: 'preview', name: '미리보기', icon: 'icons/resume', singleton: true, defaultSize: { w: 1120, h: 760 }, minSize: { w: 600, h: 420 }, phoneName: '포트폴리오 PDF' }),
  settings: meta({ id: 'settings', name: '시스템 설정', icon: 'icons/settings', singleton: true, defaultSize: { w: 820, h: 620 }, minSize: { w: 680, h: 420 }, phoneName: '설정' }),
};

/** Pinned to the Dock, left to right; `null` draws a divider. */
export const DOCK_APPS: readonly (AppId | null)[] = [
  'finder',
  'about',
  'messages',
  'mail',
  'photos',
  'notes',
  'safari',
  'terminal',
  'preview',
  'settings',
  null,
  'github',
  'blog',
];

let windowCount = 0;

/** A window's identity: singletons use the app id, documents add their key, the rest count up. */
export function windowIdFor<A extends AppId>(app: A, props: Partial<AppProps[A]> = {}): string {
  if (APPS[app].singleton) return app;
  if (app === 'portfolio') return `portfolio:${(props as { slug?: string }).slug}`;
  return `${app}:${++windowCount}`;
}
