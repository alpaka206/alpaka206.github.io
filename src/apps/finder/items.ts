import { SEQUENCE } from '@/apps/portfolio/toc';
import type { NoteId } from '@/content/conversation';
import { NOTES, type Note } from '@/content/notes';
import { AWARDS, PROFILE } from '@/content/profile';
import { FEATURED, PROJECT_GROUPS } from '@/content/projects';
import type { Award, Project, ProjectGroup, ProjectSlug } from '@/content/types';
import { APPS, type AppId, type FinderLocation } from '@/os/apps';
import { matchesAny } from '@/os/search';
import { FILE_NAME } from '../preview/pdf';

/**
 * What a Finder window lists. Pure data: no React, no stores, so the views,
 * the keyboard model and the tests all agree on ids, names and order.
 *
 * Names and kinds are what Korean Finder shows for such files on macOS 27.2.1
 * (UTType descriptions read in the ko locale): "PDF 문서", "일반 텍스트 문서",
 * "WebP 이미지", "응용 프로그램", "폴더". Markdown has no Korean description on
 * macOS, so README.md really is "Markdown Document".
 */

type TagId = 'react' | 'next' | 'ai' | 'app' | 'automation';

/** A place a Finder window can show: a sidebar location or a tag. */
export type Place = FinderLocation | `tag:${TagId}`;

interface ItemBase {
  /** Unique across every location, so a selection survives a search or a view change. */
  id: string;
  /** File name as Finder shows it, with the extension when the file has one. */
  name: string;
  /** 종류 column. */
  kind: string;
  /** 기간 column. */
  period?: string;
  /** 소속 column. */
  owner?: string;
  /** What the search field matches besides the name. */
  terms: readonly string[];
}

export type FinderItem = ItemBase &
  (
    | { type: 'project'; project: Project }
    | { type: 'award'; award: Award; index: number }
    | { type: 'pdf' }
    | { type: 'note'; note: NoteId }
    | { type: 'app'; app: AppId }
    | { type: 'folder'; place?: FinderLocation; children: FinderItem[] }
    | { type: 'trash' }
  );

interface ItemGroup {
  id: string;
  title: string;
  items: FinderItem[];
}

/** Items in display order, optionally split under group headers (Finder's "그룹 사용"). */
export interface Listing {
  items: FinderItem[];
  groups: ItemGroup[] | null;
}

export const PLACE_TITLES: Record<FinderLocation, string> = {
  recents: '최근 항목',
  projects: '프로젝트',
  documents: '문서',
  desktop: '데스크탑',
  applications: '응용 프로그램',
  awards: '수상',
  trash: '휴지통',
};

export const COMMITS_URL = 'https://github.com/alpaka206/alpaka206.github.io/commits/main';

/* ---------- projects ---------- */

/** 종류 of a project: what was built, in the words a recruiter scans for. */
const PROJECT_KIND: Record<Exclude<ProjectSlug, 'eastaid'>, string> = {
  'premiere-plugin': '플러그인',
  'sales-automation': '운영 콘솔',
  mearri: '웹 서비스',
  alarmtalk: 'Android, iOS 앱',
  harucut: '웹 서비스',
  'global-web-qa': 'QA 자동화',
  'image-qa': '운영 콘솔',
  comatching: '웹 서비스',
  bucheon: '웹 서비스',
  'share-it': '웹 서비스',
  saecha: '웹 서비스',
};

const groupOf = (project: Project): ProjectGroup | undefined => PROJECT_GROUPS.find((g) => g.id === project.group);

/** A project's own period, else its company's ("2026.04 - 2026.10, 일부 계속 운영" → "2026.04 - 2026.10"). */
function projectPeriod(project: Project): string | undefined {
  return project.period ?? groupOf(project)?.period?.split(',')[0]?.trim();
}

/** The company, or "팀 프로젝트" / "외주 프로젝트" for work outside one. */
function projectOwner(project: Project): string {
  const group = groupOf(project);
  if (project.group === 'team' || !group) return project.meta.split(' / ')[0] ?? project.meta;
  return group.title;
}

function projectItem(project: Project): FinderItem {
  const kind = PROJECT_KIND[project.slug as keyof typeof PROJECT_KIND] ?? '프로젝트';
  return {
    type: 'project',
    project,
    id: `project:${project.slug}`,
    name: project.title,
    kind,
    period: projectPeriod(project),
    owner: projectOwner(project),
    terms: [project.name, project.summary, project.meta, project.highlight ?? '', ...project.tags, ...(project.keywords ?? [])],
  };
}

const PROJECT_ITEMS: readonly FinderItem[] = SEQUENCE.map(projectItem);

const projectItemOf = (slug: ProjectSlug) => PROJECT_ITEMS.find((item) => item.id === `project:${slug}`);

/* ---------- documents, awards, apps ---------- */

const PDF_ITEM: FinderItem = {
  type: 'pdf',
  id: 'pdf',
  name: FILE_NAME,
  kind: 'PDF 문서',
  owner: PROFILE.name,
  terms: ['포트폴리오 이력서 경력기술서 PDF resume'],
};

/** The site's README is the note about how the site was built. */
const README_ITEM: FinderItem = {
  type: 'note',
  note: 'how-built',
  id: 'readme',
  name: 'README.md',
  kind: 'Markdown Document',
  owner: PROFILE.name,
  terms: noteText('how-built'),
};

function noteText(id: NoteId): string[] {
  const note = NOTES.find((n) => n.id === id);
  return note ? [note.title, ...note.sections.flatMap((s) => [s.heading ?? '', ...s.lines])] : [];
}

const noteItem = (note: Note): FinderItem => ({
  type: 'note',
  note: note.id,
  id: `note:${note.id}`,
  name: `${note.title}.txt`,
  kind: '일반 텍스트 문서',
  owner: PROFILE.name,
  terms: noteText(note.id),
});

const AWARD_ITEMS: readonly FinderItem[] = AWARDS.map((award, index) => ({
  type: 'award',
  award,
  index,
  id: `award:${index}`,
  name: `${award.title}.webp`,
  kind: 'WebP 이미지',
  period: award.date,
  owner: award.issuer,
  terms: [award.issuer, award.date, '수상'],
}));

const APP_ITEMS: readonly FinderItem[] = Object.values(APPS)
  .filter((app) => app.id !== 'portfolio')
  .map((app) => ({
    type: 'app',
    app: app.id,
    id: `app:${app.id}`,
    name: app.name,
    kind: '응용 프로그램',
    terms: [app.phoneName ?? ''],
  }));

const folder = (place: FinderLocation, children: readonly FinderItem[]): FinderItem => ({
  type: 'folder',
  place,
  children: [...children],
  id: `folder:${place}`,
  name: PLACE_TITLES[place],
  kind: '폴더',
  terms: [],
});

/** The same four icons as the desktop. */
const DESKTOP_ITEMS: readonly FinderItem[] = [README_ITEM, PDF_ITEM, folder('projects', PROJECT_ITEMS), folder('awards', AWARD_ITEMS)];

const DOCUMENT_ITEMS: readonly FinderItem[] = [PDF_ITEM, README_ITEM, ...NOTES.filter((n) => n.id !== 'how-built').map(noteItem)];

const TRASH_ITEM: FinderItem = {
  type: 'trash',
  id: 'trash:windows',
  name: '이전 포트폴리오 (Windows)',
  kind: '폴더',
  terms: ['이전 포트폴리오 Windows 윈도우'],
};

/* ---------- tags ---------- */

interface Tag {
  id: TagId;
  label: string;
  /** Finder tag colours are the system colours (macOS 27 values in tokens.css). */
  color: string;
  /** Matched against a project's tags, keywords, name and meta. */
  pattern: RegExp;
}

export const TAGS: readonly Tag[] = [
  { id: 'react', label: 'React', color: 'var(--blue)', pattern: /\bReact\b|Next\.js/ },
  { id: 'next', label: 'Next.js', color: 'var(--gray)', pattern: /Next\.js/ },
  { id: 'ai', label: 'AI 연동', color: 'var(--green)', pattern: /\bAI\b|Gemini|Vertex|ElevenLabs|Perso/ },
  { id: 'app', label: '앱', color: 'var(--orange)', pattern: /Kotlin|SwiftUI|Expo|Android|iOS/ },
  { id: 'automation', label: '자동화', color: 'var(--yellow)', pattern: /자동화|Puppeteer|n8n/ },
];

export function tagsOf(project: Project): Tag[] {
  const haystack = [project.name, project.meta, ...project.tags, ...(project.keywords ?? [])].join(' ');
  return TAGS.filter((tag) => tag.pattern.test(haystack));
}

/* ---------- places ---------- */

export const isTagPlace = (place: Place): place is `tag:${TagId}` => place.startsWith('tag:');

const tagOf = (place: Place): Tag | undefined => (isTagPlace(place) ? TAGS.find((tag) => `tag:${tag.id}` === place) : undefined);

export function placeTitle(place: Place): string {
  return isTagPlace(place) ? (tagOf(place)?.label ?? '') : PLACE_TITLES[place];
}

/** Desktop folders live on the desktop; nothing else here has a modelled parent. */
export function enclosingPlace(place: Place): Place | null {
  return place === 'projects' || place === 'awards' ? 'desktop' : null;
}

/** What Recents can point back to: things that were opened, newest first. */
export type RecentRef =
  { type: 'project'; slug: ProjectSlug } | { type: 'pdf' } | { type: 'note'; note: NoteId } | { type: 'award'; index: number };

function itemFor(ref: RecentRef): FinderItem | undefined {
  switch (ref.type) {
    case 'project':
      return projectItemOf(ref.slug);
    case 'pdf':
      return PDF_ITEM;
    case 'note':
      return ref.note === 'how-built' ? README_ITEM : DOCUMENT_ITEMS.find((i) => i.type === 'note' && i.note === ref.note);
    case 'award':
      return AWARD_ITEMS[ref.index];
  }
}

/** Unfiltered contents of a place, in Finder's default order. */
export function placeItems(place: Place, recents: readonly RecentRef[] = []): FinderItem[] {
  if (isTagPlace(place)) {
    const tag = tagOf(place);
    return PROJECT_ITEMS.filter((item) => item.type === 'project' && tag !== undefined && tagsOf(item.project).includes(tag));
  }
  switch (place) {
    case 'projects':
      return [...PROJECT_ITEMS];
    case 'recents': {
      const opened = recents.map(itemFor).filter((item) => item !== undefined);
      return opened.length ? opened : FEATURED.map(projectItemOf).filter((item) => item !== undefined);
    }
    case 'documents':
      return [...DOCUMENT_ITEMS];
    case 'desktop':
      return [...DESKTOP_ITEMS];
    case 'applications':
      return [...APP_ITEMS];
    case 'awards':
      return [...AWARD_ITEMS];
    case 'trash':
      return [TRASH_ITEM];
  }
}

/**
 * The listing a view draws: the place's items narrowed by the search field,
 * split by company for the projects folder (empty groups disappear).
 */
export function listing(place: Place, query = '', recents: readonly RecentRef[] = []): Listing {
  const items = placeItems(place, recents).filter((item) => matchesAny(query, [item.name, ...item.terms]));
  if (place !== 'projects') return { items, groups: null };
  const groups = PROJECT_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    items: items.filter((item) => item.type === 'project' && item.project.group === group.id),
  })).filter((group) => group.items.length > 0);
  return { items: groups.flatMap((group) => group.items), groups };
}

/** Column view: the projects folder shows its companies as folders, then their projects. */
export function columnRoots(list: Listing): FinderItem[] {
  if (!list.groups) return list.items;
  return list.groups.map((group) => ({
    type: 'folder',
    children: group.items,
    id: `group:${group.id}`,
    name: group.title,
    kind: '폴더',
    terms: [],
  }));
}

/** Every item reachable from `items`, folders' contents included (ids are unique within a place). */
export function flatten(items: readonly FinderItem[]): FinderItem[] {
  return items.flatMap((item) => (item.type === 'folder' ? [item, ...flatten(item.children)] : [item]));
}

/* ---------- sorting (list view headers) ---------- */

export type SortKey = 'name' | 'period' | 'kind' | 'owner';
export interface Sort {
  key: SortKey;
  ascending: boolean;
}

const collator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' });

/** "2024.07 - 현재" → 2024.07; undefined sorts last. */
export function periodStart(period: string | undefined): number {
  const match = period?.match(/(\d{4})\.(\d{1,2})(?:\.(\d{1,2}))?/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]) * 10_000 + Number(match[2]) * 100 + Number(match[3] ?? 0);
}

export function sortItems(items: readonly FinderItem[], sort: Sort): FinderItem[] {
  const direction = sort.ascending ? 1 : -1;
  const value = (item: FinderItem) => item[sort.key] ?? '';
  return items.toSorted((a, b) => {
    if (sort.key === 'period') {
      const [x, y] = [periodStart(a.period), periodStart(b.period)];
      if (x !== y) return x === Number.POSITIVE_INFINITY ? 1 : y === Number.POSITIVE_INFINITY ? -1 : (x - y) * direction;
    }
    return collator.compare(value(a), value(b)) * direction || collator.compare(a.name, b.name);
  });
}

/** Sorts inside each group, like Finder does with "그룹 사용" on. */
export function sortListing(list: Listing, sort: Sort | null): Listing {
  if (!sort) return list;
  if (!list.groups) return { items: sortItems(list.items, sort), groups: null };
  const groups = list.groups.map((group) => ({ ...group, items: sortItems(group.items, sort) }));
  return { items: groups.flatMap((group) => group.items), groups };
}

/* ---------- status bar ---------- */

/** Finder's status bar strings (LocalizableMerged.strings SB_COUNT, SB18, SB17). */
export function statusText(total: number, selected: number): string {
  if (selected === 0) return `${total}개의 항목`;
  return `${selected}/${total} 선택됨`;
}
