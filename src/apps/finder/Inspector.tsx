import { useEffect, useId, useRef } from 'react';
import { Button } from '@/desktop/kit/controls';
import { useDismiss } from '@/desktop/menus/useDismiss';
import { useRestoreFocus } from '@/lib/focus';
import { Glass } from '@/ui/Glass';
import { ItemIcon } from './ItemIcon';
import { tagsOf, type FinderItem } from './items';
import styles from './Inspector.module.css';

interface InspectorProps {
  item: FinderItem;
  /** Where the panel sits inside the window body (already kept inside it). */
  x: number;
  y: number;
  /** Shown in the 위치 row, e.g. "프로젝트". */
  where: string;
  onOpen: (item: FinderItem) => void;
  onClose: () => void;
}

export const INSPECTOR_WIDTH = 280;

/**
 * 정보 가져오기 (⌘I) as a popover next to the item: macOS 27 popover radius 20
 * and the regular "panel" glass (macos.md §10). Escape, a click outside or the
 * close button dismisses it and focus goes back to the files.
 */
export function Inspector({ item, x, y, where, onOpen, onClose }: InspectorProps) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const project = item.type === 'project' ? item.project : null;

  // Mounted once per opening: the panel takes focus, and gives it back to the files when it closes.
  useRestoreFocus();
  useDismiss(true, panel, onClose);
  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
  }, []);

  const rows: [string, string | undefined][] = [
    ['종류', item.kind],
    ['기간', item.period],
    ['소속', item.owner],
    ['위치', where],
  ];

  return (
    <div
      ref={panel}
      role="dialog"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={styles.position}
      style={{ left: x, top: y, width: INSPECTOR_WIDTH }}
    >
      <Glass variant="panel" radius={20} className={styles.inspector}>
        <header className={styles.header}>
          <ItemIcon item={item} size={48} />
          <div className={styles.titles}>
            <h2 id={titleId} className={styles.name}>
              {item.name}
            </h2>
            <p className={styles.kind}>{project?.name ?? item.kind}</p>
          </div>
        </header>
        <dl className={styles.rows}>
          {rows
            .filter((row): row is [string, string] => Boolean(row[1]))
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}:</dt>
                <dd>{value}</dd>
              </div>
            ))}
          {project && tagsOf(project).length > 0 && (
            <div>
              <dt>태그:</dt>
              <dd className={styles.tags}>
                {tagsOf(project).map((tag) => (
                  <span key={tag.id}>
                    <i style={{ background: tag.color }} aria-hidden="true" />
                    {tag.label}
                  </span>
                ))}
              </dd>
            </div>
          )}
          {project && project.tags.length > 0 && (
            <div>
              <dt>기술:</dt>
              <dd>{project.tags.join(', ')}</dd>
            </div>
          )}
        </dl>
        <footer className={styles.footer}>
          <Button onClick={onClose}>닫기</Button>
          <Button variant="prominent" onClick={() => onOpen(item)}>
            열기
          </Button>
        </footer>
      </Glass>
    </div>
  );
}
