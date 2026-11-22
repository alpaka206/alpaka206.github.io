import { PROJECT_GROUPS, PROJECTS } from '@/content/projects';
import type { Block, Project, ProjectGroup, ProjectSlug } from '@/content/types';

/**
 * The portfolio window's sidebar: the open case study's sections, then the
 * other case studies by company. Pure, so the order is testable.
 */
export interface TocEntry {
  title: string;
  /** Position among ProjectArticle's top-level children (its header is child 0). */
  child: number;
  /** For a list of steps: which step inside that child. */
  item?: number;
}

/** A heading for a block, if it has one: callouts carry a sentence, not a heading. */
function headingOf(block: Block): string | undefined {
  switch (block.type) {
    case 'columns':
      for (const column of block.columns) {
        for (const inner of column) {
          const heading = headingOf(inner);
          if (heading) return heading;
        }
      }
      return undefined;
    case 'text':
    case 'bullets':
    case 'flow':
    case 'chart':
    case 'compare':
    case 'split':
      return block.title;
    default:
      return undefined;
  }
}

/**
 * Sections in reading order. ProjectArticle renders its header, one element
 * per block, the tag list and the link list, so block i is child i + 1. Steps
 * (01, 02, …) are listed one by one; a block without a heading is reached
 * through its neighbours.
 */
export function tableOfContents(project: Project): TocEntry[] {
  const entries: TocEntry[] = [{ title: '개요', child: 0 }];
  project.blocks.forEach((block, i) => {
    if (block.type === 'steps') {
      block.items.forEach((step, item) => entries.push({ title: step.title, child: i + 1, item }));
      return;
    }
    const title = headingOf(block);
    if (title && !entries.some((e) => e.title === title)) entries.push({ title, child: i + 1 });
  });
  const after = project.blocks.length + 1;
  if (project.tags.length) entries.push({ title: '사용 기술', child: after });
  if (project.links.length) entries.push({ title: '링크', child: after + (project.tags.length ? 1 : 0) });
  return entries;
}

/** Case studies in the portfolio PDF's order; the current company has no case study of its own. */
export const SEQUENCE: readonly Project[] = PROJECTS.filter((p) => p.slug !== 'eastaid');

export function neighbours(slug: ProjectSlug): { previous?: Project; next?: Project } {
  const i = SEQUENCE.findIndex((p) => p.slug === slug);
  if (i < 0) return { next: SEQUENCE[0] };
  return { previous: SEQUENCE[i - 1], next: SEQUENCE[i + 1] };
}

/** The other case studies, grouped by company as in the PDF's table of contents. */
export function otherProjects(slug: ProjectSlug): { group: ProjectGroup; projects: Project[] }[] {
  return PROJECT_GROUPS.map((group) => ({
    group,
    projects: SEQUENCE.filter((p) => p.group === group.id && p.slug !== slug),
  })).filter((entry) => entry.projects.length > 0);
}
