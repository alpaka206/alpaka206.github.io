import { getNote, NOTES } from '@/content/notes';
import { AWARDS, PROFILE, STATS } from '@/content/profile';
import { PROJECTS } from '@/content/projects';
import type { NoteId } from '@/content/conversation';
import type { Award, Project } from '@/content/types';
import type { AppId, AppProps } from '@/os/apps';

/**
 * The terminal's home folder, built from src/content so `ls` and `cat` can
 * never say anything the rest of the site does not. Paths are arrays of
 * segments below home: [] is ~, ['projects'] is ~/projects.
 */
export const HOME = '/Users/gyuwon';

/** What `open` does with a file. */
export type Opener = { app: AppId; props?: Partial<AppProps[AppId]> } | { award: number };

interface FileNode {
  kind: 'file';
  name: string;
  read: () => string[];
  opens: Opener;
}

interface DirNode {
  kind: 'dir';
  name: string;
  children: Entry[];
}

export type Entry = FileNode | DirNode;

const file = (name: string, read: () => string[], opens: Opener): FileNode => ({ kind: 'file', name, read, opens });
const dir = (name: string, children: Entry[]): DirNode => ({ kind: 'dir', name, children });

function noteLines(id: NoteId): string[] {
  const note = getNote(id);
  if (!note) return [];
  const out = [`# ${note.title}`];
  for (const section of note.sections) {
    out.push('');
    if (section.heading) out.push(`## ${section.heading}`);
    out.push(...section.lines);
  }
  return out;
}

const aboutLines = () => [
  `# ${PROFILE.name}`,
  PROFILE.role,
  PROFILE.headline,
  '',
  ...STATS.map((stat) => `- ${stat.value}: ${stat.label}`),
];

const projectLines = (project: Project) => [
  `# ${project.title}`,
  project.meta,
  '',
  ...project.lead.split('\n'),
  ...(project.highlight ? ['', `핵심: ${project.highlight}`] : []),
  '',
  `태그: ${project.tags.join(', ')}`,
];

const awardLines = (award: Award) => [`# ${award.title}`, award.date, award.issuer];

/** "awards/2023-hana-…-team-1" → "2023-hana-…-team.md" (one file per award, not per scan). */
export const awardFileName = (award: Award) => `${(award.images[0] ?? '').replace(/^.*\//, '').replace(/-\d$/, '')}.md`;

const ROOT: DirNode = dir('~', [
  file('README.md', () => noteLines('how-built'), { app: 'notes', props: { note: 'how-built' } }),
  file('about.md', aboutLines, { app: 'about', props: { view: 'profile', section: 'overview' } }),
  dir(
    'projects',
    PROJECTS.map((project) => file(`${project.slug}.md`, () => projectLines(project), { app: 'portfolio', props: { slug: project.slug } })),
  ),
  dir(
    'notes',
    NOTES.map((note) => file(`${note.id}.md`, () => noteLines(note.id), { app: 'notes', props: { note: note.id } })),
  ),
  dir(
    'awards',
    AWARDS.map((award, index) => file(awardFileName(award), () => awardLines(award), { award: index })),
  ),
]);

/**
 * Resolves `arg` against `cwd` the way a shell does: ~, /Users/gyuwon, ., ..
 * and trailing slashes. Climbing above home stays at home. Returns null for
 * absolute paths outside home.
 */
export function resolvePath(cwd: readonly string[], arg: string): string[] | null {
  let rest = arg;
  let base: string[] = [...cwd];
  if (rest === '~' || rest.startsWith('~/')) {
    base = [];
    rest = rest.slice(1);
  } else if (rest === HOME || rest.startsWith(`${HOME}/`)) {
    base = [];
    rest = rest.slice(HOME.length);
  } else if (rest.startsWith('/')) {
    return null;
  }
  for (const segment of rest.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') base.pop();
    else base.push(segment);
  }
  return base;
}

export function entryAt(path: readonly string[]): Entry | undefined {
  let node: Entry = ROOT;
  for (const segment of path) {
    if (node.kind !== 'dir') return undefined;
    const next: Entry | undefined = node.children.find((child) => child.name === segment);
    if (!next) return undefined;
    node = next;
  }
  return node;
}

/** "/Users/gyuwon/projects" */
export const absolutePath = (path: readonly string[]) => (path.length ? `${HOME}/${path.join('/')}` : HOME);
