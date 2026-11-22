import { Button } from '@/desktop/kit/controls';
import { ItemIcon } from './ItemIcon';
import { ItemPreview } from './ItemPreview';
import { tagsOf, type FinderItem } from './items';
import { quickLookItem } from './actions';
import styles from './InfoPane.module.css';

interface InfoPaneProps {
  item: FinderItem | null;
  /** 0 or several selected items: Finder shows a count instead of details. */
  count: number;
  onOpen: (item: FinderItem) => void;
  /** The preview pane (⇧⌘P) draws the preview on top; the gallery has it in the main area already. */
  withPreview?: boolean;
}

/** The pane on the right of the gallery and of the preview pane: what the selection is, and a way to open it. */
export function InfoPane({ item, count, onOpen, withPreview = false }: InfoPaneProps) {
  if (!item) {
    return (
      <aside className={styles.pane} aria-label="미리보기">
        <p className={styles.empty}>{count > 1 ? `${count}개 항목 선택됨` : '선택된 항목 없음'}</p>
      </aside>
    );
  }
  const project = item.type === 'project' ? item.project : null;
  const finderTags = project ? tagsOf(project) : [];
  const rows: [string, string | undefined][] = [
    ['종류', item.kind],
    ['기간', item.period],
    ['소속', project?.meta ?? item.owner],
    ['역할', project?.summary],
    ['성과', project?.highlight],
  ];
  return (
    <aside className={styles.pane} aria-label={`${item.name} 미리보기`}>
      {withPreview && (
        <div className={styles.preview}>
          <ItemPreview item={item} sizes="240px" />
        </div>
      )}
      <header className={styles.header}>
        <ItemIcon item={item} size={40} />
        <div className={styles.titles}>
          <h2 className={styles.name}>{project?.title ?? item.name}</h2>
          <p className={styles.kind}>{project?.name ?? item.kind}</p>
        </div>
      </header>
      {project && !withPreview && <p className={styles.lead}>{project.lead.replace(/\n/g, ' ')}</p>}
      <h3 className={styles.section}>정보</h3>
      <dl className={styles.rows}>
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]))
          .map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        {project && project.links.length > 0 && (
          <div>
            <dt>링크</dt>
            <dd>
              {project.links.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && ', '}
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </span>
              ))}
            </dd>
          </div>
        )}
      </dl>
      {finderTags.length > 0 && (
        <>
          <h3 className={styles.section}>태그</h3>
          <ul className={styles.tags} aria-label="태그">
            {finderTags.map((tag) => (
              <li key={tag.id}>
                <span className={styles.dot} style={{ background: tag.color }} aria-hidden="true" />
                {tag.label}
              </li>
            ))}
          </ul>
        </>
      )}
      {project && project.tags.length > 0 && !withPreview && (
        <ul className={styles.stack} aria-label="사용 기술">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      <div className={styles.actions}>
        <Button variant="prominent" size="large" onClick={() => onOpen(item)}>
          {project ? '자세히 열기' : '열기'}
        </Button>
        {quickLookItem(item) && <p className={styles.hint}>스페이스로 빠르게 보기</p>}
      </div>
    </aside>
  );
}
