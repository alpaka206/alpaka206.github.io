import { useId, useLayoutEffect, useMemo, useRef, type KeyboardEvent } from 'react';
import { Symbol } from '@/ui/Symbol';
import { InfoPane } from './InfoPane';
import { ItemIcon } from './ItemIcon';
import { columnRoots, type FinderItem, type Listing } from './items';
import { moveTo, NONE, only } from './selection';
import { itemElement, optionId, pointerHandlers, selectFirstOnFocus, type ViewProps } from './viewShared';
import styles from './ColumnView.module.css';

/**
 * Miller columns (계층 보기): companies, then their projects, then a preview
 * column for the selected file. Columns are 245 pt wide with 13 pt text and
 * folder arrows (ColumnViewOptions on this Mac), rows 24 pt (NSBrowser).
 */
const COLUMN_WIDTH = 245;

const childrenOf = (item: FinderItem | undefined) => (item?.type === 'folder' ? item.children : null);

/** The chain of items from a root down to `id` (ids are unique within a place). */
function pathTo(items: readonly FinderItem[], id: string | null): FinderItem[] {
  if (!id) return [];
  for (const item of items) {
    if (item.id === id) return [item];
    const below = pathTo(childrenOf(item) ?? [], id);
    if (below.length) return [item, ...below];
  }
  return [];
}

/** Ids of the column the keyboard is in, for ⌘A and the status bar. */
export function activeColumnIds(list: Listing, focus: string | null): string[] {
  const roots = columnRoots(list);
  const parent = pathTo(roots, focus).at(-2);
  return ((parent && childrenOf(parent)) ?? roots).map((item) => item.id);
}

export function ColumnView(props: ViewProps) {
  const { list, selection, onSelectionChange, label } = props;
  const prefix = useId();
  const root = useRef<HTMLDivElement>(null);
  const roots = useMemo(() => columnRoots(list), [list]);
  const path = pathTo(roots, selection.focus);
  const focus = path.at(-1);

  // One column per level of the path, plus the open folder's contents.
  const columns: { key: string; title: string; items: readonly FinderItem[] }[] = [{ key: 'root', title: label, items: roots }];
  for (const item of path) {
    const children = childrenOf(item);
    if (children) columns.push({ key: item.id, title: item.name, items: children });
  }
  const activeColumn = Math.max(0, path.length - 1);
  const siblings = columns[activeColumn]?.items ?? roots;
  const order = siblings.map((item) => item.id);

  useLayoutEffect(() => {
    const scroller = root.current;
    if (!scroller) return;
    scroller.scrollTo({ left: scroller.scrollWidth, behavior: 'auto' });
    if (selection.focus) itemElement(scroller, selection.focus)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [selection.focus, columns.length]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const index = focus ? order.indexOf(focus.id) : -1;
    let next: string | undefined;
    switch (event.key) {
      case 'ArrowDown':
        next = index < 0 ? roots[0]?.id : order[Math.min(index + 1, order.length - 1)];
        break;
      case 'ArrowUp':
        next = index < 0 ? roots[0]?.id : order[Math.max(index - 1, 0)];
        break;
      case 'ArrowRight':
      case 'ArrowLeft':
        // Into the open folder, or back out to its parent.
        next = event.key === 'ArrowRight' ? childrenOf(focus)?.[0]?.id : path.at(-2)?.id;
        if (next) {
          event.preventDefault();
          onSelectionChange(only(next));
        }
        return;
      default:
        return;
    }
    event.preventDefault();
    if (next) onSelectionChange(moveTo(selection, order, next, event.shiftKey));
  };

  return (
    <div
      ref={root}
      className={styles.columns}
      role="group"
      aria-label={label}
      aria-activedescendant={selection.focus ? optionId(prefix, selection.focus) : undefined}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={selectFirstOnFocus(props, roots[0]?.id)}
    >
      {columns.map((column, c) => {
        const columnOrder = column.items.map((item) => item.id);
        // Clicking in an outer column narrows the path to that column, like Finder.
        const columnProps = { ...props, selection: c === activeColumn ? selection : NONE };
        return (
          <div
            key={column.key}
            role="listbox"
            aria-label={column.title}
            aria-multiselectable="true"
            className={styles.column}
            style={{ width: COLUMN_WIDTH }}
          >
            {column.items.map((item) => {
              const inPath = path[c]?.id === item.id;
              const selected = c === activeColumn ? selection.ids.includes(item.id) : inPath;
              return (
                <div
                  key={item.id}
                  id={optionId(prefix, item.id)}
                  role="option"
                  aria-selected={selected}
                  aria-expanded={item.type === 'folder' ? inPath : undefined}
                  data-item-id={item.id}
                  data-path={inPath && c < activeColumn ? '' : undefined}
                  className={styles.row}
                  {...pointerHandlers(item, columnProps, columnOrder)}
                >
                  <ItemIcon item={item} size={16} />
                  <span className={styles.name}>{item.name}</span>
                  {item.type === 'folder' && <Symbol name="chevron.right" size={10} weight="semibold" className={styles.arrow} />}
                </div>
              );
            })}
          </div>
        );
      })}
      {focus && focus.type !== 'folder' && selection.ids.length === 1 && (
        <div className={styles.previewColumn}>
          <InfoPane item={focus} count={1} onOpen={props.onOpen} withPreview />
        </div>
      )}
    </div>
  );
}
