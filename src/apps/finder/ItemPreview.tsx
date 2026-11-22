import { Fragment } from 'react';
import { getNote } from '@/content/notes';
import type { FlowNode, Project } from '@/content/types';
import { Picture } from '@/media/Picture';
import { APPS } from '@/os/apps';
import { AppIcon } from '@/ui/AppIcon';
import { ItemIcon } from './ItemIcon';
import type { FinderItem } from './items';
import styles from './ItemPreview.module.css';

/**
 * What the gallery and the preview pane show for an item: the project's cover
 * when it has one, otherwise a miniature of its first page (lead and first
 * diagram), the certificate, page 1 of the PDF, the note's text, or the icon.
 * `compact` is the filmstrip size: the same drawing, scaled down.
 */
export function ItemPreview({ item, sizes, compact = false }: { item: FinderItem; sizes: string; compact?: boolean }) {
  switch (item.type) {
    case 'project':
      return item.project.cover ? (
        <Picture src={item.project.cover} alt={compact ? '' : `${item.project.title} 화면`} sizes={sizes} className={styles.image} />
      ) : (
        <MiniDocument project={item.project} />
      );
    case 'award':
      return (
        <Picture
          src={item.award.images[0] ?? ''}
          alt={compact ? '' : item.award.title}
          sizes={sizes}
          className={`${styles.image} ${styles.paper}`}
        />
      );
    case 'pdf':
      return (
        <Picture src="pdf/portfolio-01" alt={compact ? '' : '포트폴리오 1쪽'} sizes={sizes} className={`${styles.image} ${styles.paper}`} />
      );
    case 'note':
      return <TextPage note={item.note} title={item.name} />;
    case 'app':
      return (
        <span className={styles.icon}>
          <AppIcon icon={APPS[item.app].icon} size={compact ? 38 : 128} />
        </span>
      );
    case 'folder':
    case 'trash':
      return (
        <span className={styles.icon}>
          <ItemIcon item={item} size={compact ? 48 : 160} />
        </span>
      );
  }
}

function firstFlow(project: Project): FlowNode[] {
  for (const block of project.blocks) {
    if (block.type === 'flow') return block.lanes[0]?.nodes.slice(0, 4) ?? [];
    if (block.type === 'columns') {
      const flow = block.columns.flat().find((inner) => inner.type === 'flow');
      if (flow?.type === 'flow') return flow.lanes[0]?.nodes.slice(0, 4) ?? [];
    }
  }
  return [];
}

/** A first page drawn from the case-study data, for projects without screenshots. */
function MiniDocument({ project }: { project: Project }) {
  const nodes = firstFlow(project);
  return (
    <div className={styles.sheet} role="img" aria-label={`${project.title} 문서 미리보기`}>
      <div className={styles.page}>
        <p className={styles.meta}>{project.meta}</p>
        <p className={styles.lead}>{project.lead}</p>
        {nodes.length > 0 && (
          <div className={styles.flow}>
            {nodes.map((node, i) => (
              <Fragment key={node.title}>
                {i > 0 && <span className={styles.arrow}>→</span>}
                <span className={styles.node} data-key={node.key || undefined}>
                  {node.stack ? node.stack[0]?.title : node.title}
                </span>
              </Fragment>
            ))}
          </div>
        )}
        {project.highlight && <p className={styles.highlight}>{project.highlight}</p>}
      </div>
    </div>
  );
}

function TextPage({ note, title }: { note: Parameters<typeof getNote>[0]; title: string }) {
  const lines =
    getNote(note)
      ?.sections.flatMap((s) => [...(s.heading ? [s.heading] : []), ...s.lines])
      .slice(0, 14) ?? [];
  return (
    <div className={`${styles.sheet} ${styles.portrait}`} role="img" aria-label={`${title} 미리보기`}>
      <div className={styles.text}>
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
