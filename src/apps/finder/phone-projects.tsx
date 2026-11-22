import { useLayoutEffect, useMemo, useState } from 'react';
import { PROJECT_GROUPS, projectsInGroup } from '@/content/projects';
import type { ProjectSlug } from '@/content/types';
import { search } from '@/os/search';
import { motionReduced } from '@/os/theme';
import { AppIcon } from '@/ui/AppIcon';
import { Row, SearchField, Section } from '@/phone/kit';
import styles from './finder.phone.module.css';

const SEARCH_ID = 'finder-search';

/** The nearest ancestor that scrolls (the NavScreen's page). */
function scrollParent(element: Element | null) {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(node).overflowY)) return node;
  }
  return null;
}

/** Slugs of the projects that match `query` (the shared index, so 초성 search works too). */
function matching(query: string): Set<ProjectSlug> | null {
  if (!query.trim()) return null;
  const hits = search(query, 50).flatMap((item) =>
    item.kind === 'project' && item.target.type === 'open' ? [(item.target.props as { slug: ProjectSlug }).slug] : [],
  );
  return new Set(hits);
}

interface ProjectsTabProps {
  onOpen: (slug: ProjectSlug) => void;
  /** Bumped by the tab bar's search button: focus the field and show it. */
  focusRequest: number;
}

/** Projects grouped like the portfolio PDF's table of contents, under a search field. */
export function ProjectsTab({ onOpen, focusRequest }: ProjectsTabProps) {
  const [query, setQuery] = useState('');
  const hits = useMemo(() => matching(query), [query]);
  const groups = PROJECT_GROUPS.map((group) => ({
    group,
    projects: projectsInGroup(group.id).filter((p) => !hits || hits.has(p.slug)),
  })).filter((entry) => entry.projects.length > 0);
  const count = groups.reduce((sum, entry) => sum + entry.projects.length, 0);

  useLayoutEffect(() => {
    if (!focusRequest) return;
    const field = document.getElementById(SEARCH_ID);
    field?.focus({ preventScroll: true });
    scrollParent(field)?.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' });
  }, [focusRequest]);

  return (
    <>
      <div className={styles.search}>
        <SearchField id={SEARCH_ID} value={query} onChange={setQuery} placeholder="프로젝트, 기술, 숫자 검색" />
      </div>
      <p className="visually-hidden" aria-live="polite">
        {hits && `검색 결과 ${count}개`}
      </p>
      {!count && <p className={styles.empty}>‘{query.trim()}’ 검색 결과가 없어요.</p>}
      {groups.map(({ group, projects }) => (
        <Section key={group.id} title={group.title} action={group.period && <span className={styles.period}>{group.period}</span>}>
          {projects.map((project) => (
            <Row
              key={project.slug}
              leading={<AppIcon icon={project.icon} size={38} className={styles.icon} />}
              title={project.name}
              subtitle={project.highlight ?? project.summary}
              wrap
              onClick={() => onOpen(project.slug)}
            />
          ))}
        </Section>
      ))}
    </>
  );
}
