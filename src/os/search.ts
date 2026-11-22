import { NOTES } from '@/content/notes';
import { AWARDS, CAREER, PROFILE, SKILLS } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import type { MediaKey } from '@/content/types';
import { APPS, type AppId, type AppProps } from './apps';

export type SearchKind = 'app' | 'project' | 'career' | 'award' | 'skill' | 'note' | 'action';

export type SearchTarget =
  | { type: 'open'; app: AppId; props?: Partial<AppProps[AppId]> }
  | { type: 'command'; command: string }
  | { type: 'link'; href: string };

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  icon: MediaKey;
  target: SearchTarget;
  /** Lower-cased, space-free haystack (title, subtitle, keywords). */
  text: string;
  /** Initial consonants of the title, then of each keyword, for 초성 search ("ㅁㅇㄹ" finds Mearri by 메아리). */
  initials: string[];
}

export const KIND_LABEL: Record<SearchKind, string> = {
  app: '응용 프로그램',
  project: '프로젝트',
  career: '경력',
  award: '수상',
  skill: '기술',
  note: '메모',
  action: '동작',
};

const INITIALS = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';

/** "메아리 자막" → "ㅁㅇㄹㅈㅁ"; non-Hangul characters pass through lower-cased. */
export function initialsOf(text: string): string {
  let out = '';
  for (const char of text.replace(/\s+/g, '')) {
    const code = char.charCodeAt(0) - 0xac00;
    out += code >= 0 && code < 11172 ? INITIALS[Math.floor(code / 588)] : char.toLowerCase();
  }
  return out;
}

/** Lower-cased, NFC, without spaces: "세일즈 자동화" and "세일즈자동화" compare equal. */
export const squash = (text: string) => text.normalize('NFC').toLowerCase().replace(/\s+/g, '');

/** An empty query matches everything; otherwise any of the texts must contain it, spaces ignored. */
export function matchesAny(query: string, texts: readonly string[]) {
  const q = squash(query);
  return !q || texts.some((text) => squash(text).includes(q));
}

function item(kind: SearchKind, id: string, title: string, subtitle: string, icon: MediaKey, target: SearchTarget, keywords: string[] = []): SearchItem {
  return { id: `${kind}:${id}`, kind, title, subtitle, icon, target, text: squash([title, subtitle, ...keywords].join(' ')), initials: [title, ...keywords].filter(Boolean).map(initialsOf) };
}

export const INDEX: readonly SearchItem[] = [
  ...Object.values(APPS)
    .filter((app) => app.id !== 'portfolio')
    .map((app) => item('app', app.id, app.name, '응용 프로그램', app.icon, { type: 'open', app: app.id }, [app.phoneName ?? ''])),
  ...PROJECTS.map((p) =>
    item('project', p.slug, p.title, p.name, p.icon, { type: 'open', app: 'portfolio', props: { slug: p.slug } }, [p.summary, p.highlight ?? '', p.meta, ...p.tags, ...(p.keywords ?? [])]),
  ),
  ...CAREER.map((c) =>
    item('career', c.name, c.name, `${c.org}, ${c.period}`, 'icons/about', { type: 'open', app: 'about', props: { view: 'profile', section: 'career' } }, [c.summary, ...(c.duties?.map((d) => `${d.service} ${d.text}`) ?? [])]),
  ),
  ...AWARDS.map((a) =>
    item('award', a.title, a.title, `${a.date}, ${a.issuer}`, 'icons/awards', { type: 'open', app: 'finder', props: { location: 'awards' } }),
  ),
  ...SKILLS.flatMap((group) =>
    group.items.map((line, i) => item('skill', `${group.title}-${i}`, line, group.title, 'icons/notes', { type: 'open', app: 'notes', props: { note: 'skills' } })),
  ),
  ...NOTES.map((n) => item('note', n.id, n.title, '메모', 'icons/notes', { type: 'open', app: 'notes', props: { note: n.id } })),
  item('action', 'mail', '김규원에게 메일 쓰기', PROFILE.email, 'icons/mail', { type: 'open', app: 'mail' }, ['이메일', '연락', '컨택', 'contact']),
  item('action', 'pdf', '포트폴리오 PDF 열기', '20쪽', 'icons/resume', { type: 'open', app: 'preview' }, ['이력서', 'resume', '다운로드', '경력기술서']),
  item('action', 'copy-email', '이메일 주소 복사', PROFILE.email, 'icons/mail', { type: 'command', command: 'system.copyEmail' }),
  item('action', 'text', '텍스트 버전으로 보기', '접근성, 빠르게 읽기', 'icons/notes', { type: 'command', command: 'system.readerMode' }, ['리더', '읽기', '접근성']),
  item('action', 'dark', '다크 모드 전환', '화면 모드', 'icons/settings', { type: 'command', command: 'system.toggleDarkMode' }, ['다크', '라이트', '테마', 'theme']),
  item('action', 'source', '이 사이트의 소스 코드 보기', 'GitHub', 'icons/github', { type: 'link', href: 'https://github.com/alpaka206/alpaka206.github.io' }, ['코드', 'source', '레포']),
];

/** Apps and projects lead: they are what a visitor came for; a skill is one line of a note. */
const KIND_BONUS: Partial<Record<SearchKind, number>> = { app: 20, project: 20 };

/** Ranked matches; ties keep index order (apps, then projects, ...). */
export function search(query: string, limit = 12): SearchItem[] {
  const q = squash(query);
  if (!q) return [];
  const initialsQuery = /^[ㄱ-ㅎ]+$/.test(q);
  const scored: { item: SearchItem; score: number }[] = [];
  for (const entry of INDEX) {
    const title = squash(entry.title);
    let score = 0;
    if (initialsQuery) {
      const [own = '', ...aliases] = entry.initials;
      score = own.startsWith(q) ? 70 : aliases.some((a) => a.startsWith(q)) ? 55 : own.includes(q) ? 40 : 0;
    }
    else if (title.startsWith(q)) score = 100;
    else if (title.includes(q)) score = 75;
    else if (squash(entry.subtitle).includes(q)) score = 60;
    else if (entry.text.includes(q)) score = 50;
    if (score) scored.push({ item: entry, score: score + (KIND_BONUS[entry.kind] ?? 0) });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}
