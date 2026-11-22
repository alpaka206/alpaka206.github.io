import type { ReactNode } from 'react';
import { getNote } from '@/content/notes';
import { AWARDS, STATS } from '@/content/profile';
import { getProject } from '@/content/projects';
import type { Block, Project, Stat } from '@/content/types';
import { formatNoteDate } from '@/lib/format';
import manifest from '@/media/manifest.json';
import { media, Picture } from '@/media/Picture';
import type { AppId, AppProps } from '@/os/apps';
import { AppIcon } from '@/ui/AppIcon';
import type { QuickLookItem } from './quickLook';
import styles from './QuickLook.module.css';

/** What the panel shows for one item: its title, how big it wants to be, the open action and the view. */
export interface Preview {
  title: string;
  /** Preferred panel size before it is fitted to the screen. */
  size: { w: number; h: number };
  open: { label: string; app: AppId; props: Partial<AppProps[AppId]> };
  body: ReactNode;
}

const PDF_PAGES = Object.keys(manifest).filter((key) => key.startsWith('pdf/portfolio-')).sort();

/** The project's numbers: its metric blocks (also inside columns), else the headline stats about it. */
function metricsOf(project: Project): Stat[] {
  const found: Stat[] = [];
  const walk = (blocks: readonly Block[]) => {
    for (const block of blocks) {
      if (block.type === 'metrics') found.push(...block.items);
      if (block.type === 'columns') block.columns.forEach(walk);
    }
  };
  walk(project.blocks);
  return found.length ? found : STATS.filter((stat) => stat.project === project.slug);
}

function ProjectBody({ project }: { project: Project }) {
  const cover = project.cover;
  // A phone screenshot (or just the app icon) stands beside the text; a desktop screenshot sits above it.
  const beside = !cover || media(cover).height > media(cover).width;
  const metrics = metricsOf(project).slice(0, 3);
  return (
    <div className={styles.project} data-layout={beside ? 'side' : 'stack'}>
      {cover ? (
        <div className={beside ? styles.phone : styles.screen}>
          <Picture src={cover} alt={`${project.title} 화면`} sizes={beside ? '230px' : '760px'} />
        </div>
      ) : (
        <div className={styles.iconTile}>
          <AppIcon icon={project.icon} size={120} label={project.title} />
        </div>
      )}
      <div className={styles.projectText}>
        <p className={styles.meta}>{project.meta}</p>
        <p className={styles.lead}>{project.lead}</p>
        {metrics.length > 0 && (
          <dl className={styles.metrics}>
            {metrics.map((metric) => (
              <div key={metric.value}>
                <dt className="nowrap">{metric.value}</dt>
                <dd>{metric.label}</dd>
              </div>
            ))}
          </dl>
        )}
        {project.tags.length > 0 && (
          <ul className={styles.tags} aria-label="사용 기술">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function previewOf(item: QuickLookItem): Preview | null {
  switch (item.kind) {
    case 'project': {
      const project = getProject(item.slug);
      if (!project) return null;
      return {
        title: project.title,
        // Text-only case studies get a smaller panel than ones with a screenshot.
        size: project.cover ? { w: 880, h: 620 } : { w: 760, h: 440 },
        open: { label: '자세히 열기', app: 'portfolio', props: { slug: project.slug } },
        body: <ProjectBody project={project} />,
      };
    }
    case 'award': {
      const award = AWARDS[item.index];
      if (!award) return null;
      return {
        title: award.title,
        // A4 portrait certificates, one or two side by side, with a caption.
        size: { w: award.images.length > 1 ? 900 : 560, h: 820 },
        open: { label: '열기', app: 'finder', props: { location: 'awards' } },
        body: (
          <figure className={styles.award}>
            <div className={styles.certificates}>
              {award.images.map((image, i) => (
                <Picture key={image} src={image} alt={`${award.title} 상장${award.images.length > 1 ? ` ${i + 1}` : ''}`} sizes="440px" />
              ))}
            </div>
            <figcaption className={styles.caption}>
              <b>{award.title}</b>
              <span>
                {award.date}, {award.issuer}
              </span>
            </figcaption>
          </figure>
        ),
      };
    }
    case 'pdf':
      return {
        title: '김규원_포트폴리오.pdf',
        size: { w: 960, h: 640 },
        open: { label: '열기', app: 'preview', props: {} },
        body: (
          <ol className={styles.pages} aria-label="페이지">
            {PDF_PAGES.map((page, i) => (
              <li key={page}>
                <Picture src={page} alt={`${i + 1}쪽`} sizes="880px" priority={i === 0} />
              </li>
            ))}
          </ol>
        ),
      };
    case 'note': {
      const note = getNote(item.note);
      if (!note) return null;
      return {
        title: note.title,
        size: { w: 640, h: 560 },
        open: { label: '열기', app: 'notes', props: { note: note.id } },
        body: (
          <article className={styles.note}>
            <p className={styles.noteDate}>{formatNoteDate(note.updated)}</p>
            <h3 className={styles.noteTitle}>{note.title}</h3>
            {note.sections.map((section, i) => (
              <section key={i}>
                {section.heading && <h4>{section.heading}</h4>}
                <ul>
                  {section.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
          </article>
        ),
      };
    }
  }
}
