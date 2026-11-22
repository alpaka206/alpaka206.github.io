import { PROFILE } from '@/content/profile';
import { getProject } from '@/content/projects';
import type { MediaKey, ProjectSlug } from '@/content/types';

/**
 * The sites Safari knows: the start page's favourites, and whether each one
 * can be shown inside a frame. Sites that send X-Frame-Options or a CSP
 * frame-ancestors rule are shown as a screenshot with a notice instead.
 */
export interface Site {
  title: string;
  href: string;
  icon: MediaKey;
  frameable: boolean;
  /** Screenshot shown when the site refuses to be framed. */
  screenshot?: MediaKey;
  /** The host with its topic particle, for "…은 다른 사이트 안에서 열리지 않도록 설정되어 있어요." */
  subject?: string;
}

function projectSite(slug: ProjectSlug, title: string, site: Omit<Site, 'title' | 'href' | 'icon'>): Site {
  const project = getProject(slug);
  const href = project?.links.find((link) => !link.href.includes('github.com'))?.href ?? '';
  return { title, href, icon: project?.icon ?? 'icons/web', ...site };
}

export const FAVORITES: readonly Site[] = [
  { title: '블로그', href: PROFILE.blog.href, icon: PROFILE.avatar, frameable: true },
  { title: 'GitHub', href: PROFILE.github.href, icon: 'icons/github', frameable: false, subject: 'github.com은' },
  projectSite('alarmtalk', 'AlarmTalk', { frameable: true }),
  projectSite('mearri', 'Mearri', { frameable: false, screenshot: 'screens/mearri', subject: 'mearri.com은' }),
  projectSite('harucut', '하루컷', { frameable: false, screenshot: 'screens/harucut', subject: 'harucut.com은' }),
  projectSite('comatching', 'COMATCHING', { frameable: false, screenshot: 'screens/comatching', subject: 'comatching.site는' }),
];

/** "www.harucut.com" → "harucut.com"; null for anything that is not an http(s) URL. */
export function hostOf(url: string): string | null {
  const parsed = URL.parse(url);
  return parsed && /^https?:$/.test(parsed.protocol) ? parsed.hostname.replace(/^www\./, '') : null;
}

export const siteFor = (url: string): Site | undefined => {
  const host = hostOf(url);
  return host ? FAVORITES.find((site) => hostOf(site.href) === host) : undefined;
};

const GOOGLE = /(^|\.)google\.com$/;

/** Google's search pages can be framed only with igu=1. */
const searchUrl = (query: string) => `https://www.google.com/search?igu=1&q=${encodeURIComponent(query)}`;

/**
 * What typing in the address field means: a URL (scheme optional) opens that
 * page, anything else searches Google.
 */
export function toAddress(input: string): string | null {
  const text = input.trim();
  if (!text) return null;
  const withScheme = /^https?:\/\//i.test(text) ? text : /^[^\s/]+\.[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(text) || /^localhost(:\d+)?(\/|$)/.test(text) ? `https://${text}` : null;
  const url = withScheme ? URL.parse(withScheme) : null;
  if (!url) return searchUrl(text);
  if (GOOGLE.test(url.hostname)) url.searchParams.set('igu', '1');
  return url.href;
}

/** The tab title: the favourite's name, a Google query, or the host. */
export function titleFor(url: string): string {
  const site = siteFor(url);
  if (site) return site.title;
  const host = hostOf(url);
  if (host && GOOGLE.test(host)) {
    const query = URL.parse(url)?.searchParams.get('q');
    if (query) return `${query} - Google 검색`;
  }
  return host ?? url;
}
