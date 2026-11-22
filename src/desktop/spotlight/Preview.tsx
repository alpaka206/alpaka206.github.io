import { getProject } from '@/content/projects';
import type { Block, Bullet, Project } from '@/content/types';
import { KIND_LABEL, type SearchItem } from '@/os/search';
import { AppIcon } from '@/ui/AppIcon';
import styles from './Spotlight.module.css';

const bulletText = (bullet: Bullet) => (typeof bullet === 'string' ? bullet : `${bullet.strong} ${bullet.text}`);

/** The first bullet points of a case study, wherever its layout nests them. */
function firstBullets(blocks: readonly Block[], count: number): string[] {
  for (const block of blocks) {
    if (block.type === 'bullets') return block.items.slice(0, count).map(bulletText);
    if (block.type === 'columns') {
      const nested = firstBullets(block.columns.flat(), count);
      if (nested.length) return nested;
    }
  }
  return [];
}

function ProjectPreview({ project }: { project: Project }) {
  const bullets = firstBullets(project.blocks, 3);
  return (
    <>
      <div className={styles.previewHead}>
        <AppIcon icon={project.icon} size={40} />
        <div className={styles.previewHeadText}>
          <p className={styles.meta}>{project.meta}</p>
          <h2 className={styles.previewTitle}>{project.title}</h2>
        </div>
      </div>
      <p className={styles.lead}>{project.lead}</p>
      {project.highlight && (
        <div className={styles.callout}>
          <strong>{project.highlight}</strong>
          <span>{project.summary}</span>
        </div>
      )}
      {bullets.length > 0 && (
        <ul className={styles.bullets}>
          {bullets.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Right half of the results: a case study's lead and highlight, or what an app or action is. */
export function Preview({ item }: { item: SearchItem }) {
  const project = item.kind === 'project' ? getProject(item.id.slice('project:'.length)) : undefined;
  return (
    <section className={styles.preview} aria-label="미리보기">
      {project ? (
        <ProjectPreview project={project} />
      ) : (
        <div className={styles.summary}>
          <AppIcon icon={item.icon} size={64} />
          <h2 className={styles.summaryTitle}>{item.title}</h2>
          <p className={styles.meta}>{item.subtitle}</p>
          <p className={styles.kind}>{KIND_LABEL[item.kind]}</p>
        </div>
      )}
      <p className={styles.keys} aria-hidden="true">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> 이동
        </span>
        <span>
          <kbd>↩</kbd> 열기
        </span>
        <span>
          <kbd>esc</kbd> 닫기
        </span>
      </p>
    </section>
  );
}
