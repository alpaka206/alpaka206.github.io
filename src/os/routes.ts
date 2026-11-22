import { getProject } from '@/content/projects';
import { getNote } from '@/content/notes';
import type { NoteId } from '@/content/conversation';
import type { AppId, AppProps, FinderLocation, ProfileSection, SettingsPane } from './apps';

/**
 * Deep links. Each path opens one window, so a recruiter can share
 * /projects/mearri and land on that case study with no boot or login.
 */
export type Route = { kind: 'reader' } | { kind: 'app'; app: AppId; props: Partial<AppProps[AppId]> };

/** Finder places with a link of their own. */
const FINDER_LINKS: readonly FinderLocation[] = ['projects', 'awards', 'documents'];
/** Apps whose link is just their name. */
const APP_LINKS: readonly AppId[] = ['messages', 'mail', 'notes', 'photos', 'terminal', 'github', 'blog'];
export const PROFILE_SECTIONS: readonly ProfileSection[] = ['overview', 'career', 'skills', 'education', 'awards', 'contact'];
const PANES: SettingsPane[] = ['appearance', 'wallpaper', 'desktop-dock', 'accessibility', 'sound', 'privacy', 'about-site'];

export function parseRoute(pathname: string): Route | null {
  const [head, tail] = pathname.split('/').filter(Boolean);
  if (!head) return null;
  if (head === 'text') return { kind: 'reader' };
  if (head === 'projects' && tail && getProject(tail)) return { kind: 'app', app: 'portfolio', props: { slug: tail as AppProps['portfolio']['slug'] } };
  const place = FINDER_LINKS.find((location) => location === head);
  if (place && !tail) return { kind: 'app', app: 'finder', props: { location: place } };
  if (head === 'about') {
    const section = PROFILE_SECTIONS.find((s) => s === tail);
    return { kind: 'app', app: 'about', props: section ? { view: 'profile', section } : {} };
  }
  if (head === 'notes' && tail && getNote(tail as NoteId)) return { kind: 'app', app: 'notes', props: { note: tail as NoteId } };
  if (head === 'settings') return { kind: 'app', app: 'settings', props: { pane: PANES.find((p) => p === tail) } };
  if (head === 'portfolio-pdf') return { kind: 'app', app: 'preview', props: {} };
  const app = APP_LINKS.find((id) => id === head);
  return app ? { kind: 'app', app, props: {} } : null;
}

export function pathFor(app: AppId, props: Partial<AppProps[AppId]> = {}): string {
  switch (app) {
    case 'portfolio':
      return `/projects/${(props as AppProps['portfolio']).slug}`;
    case 'finder': {
      const location = (props as AppProps['finder']).location ?? 'projects';
      return FINDER_LINKS.includes(location) ? `/${location}` : '/';
    }
    case 'about': {
      const { view, section } = props as AppProps['about'];
      return view === 'profile' && section ? `/about/${section}` : '/about';
    }
    case 'notes': {
      const { note } = props as AppProps['notes'];
      return note ? `/notes/${note}` : '/notes';
    }
    case 'settings': {
      const { pane } = props as AppProps['settings'];
      return pane ? `/settings/${pane}` : '/settings';
    }
    case 'preview':
      return '/portfolio-pdf';
    case 'safari':
      return '/';
    default:
      return `/${app}`;
  }
}
