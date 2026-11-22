import { Fragment, useId, useMemo, useRef } from 'react';
import { Symbol } from '@/ui/Symbol';
import { ItemIcon } from './ItemIcon';
import type { FinderItem, Sort, SortKey } from './items';
import { NONE } from './selection';
import { navigate, optionId, pointerHandlers, selectFirstOnFocus, useRevealFocus, type ViewProps } from './viewShared';
import styles from './ListView.module.css';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: '이름' },
  { key: 'period', label: '기간' },
  { key: 'kind', label: '종류' },
  { key: 'owner', label: '소속' },
];

/** Enough empty stripes for the tallest window; the filler clips what it does not need. */
const FILLER_ROWS = 48;

interface ListViewProps extends ViewProps {
  sort: Sort | null;
  onSortChange: (sort: Sort) => void;
}

/**
 * Finder's list view: 16 pt icons and 13 pt text (ListViewSettings), 24 pt
 * rows under a 28 pt header in 11 pt (NSTableView on macOS 27.2.1), inset
 * 10 pt with 6 pt corners and alternating row colours (AppKit render).
 */
export function ListView(props: ListViewProps) {
  const { list, selection, label, sort, onSortChange } = props;
  const prefix = useId();
  const root = useRef<HTMLDivElement>(null);
  const order = useMemo(() => list.items.map((item) => item.id), [list.items]);
  useRevealFocus(root, selection.focus);

  // Rows alternate through the whole list, and empty stripes carry on below the last one, as in Finder.
  const row = (item: FinderItem) => (
    <div
      key={item.id}
      id={optionId(prefix, item.id)}
      role="row"
      aria-selected={selection.ids.includes(item.id)}
      data-item-id={item.id}
      data-stripe={order.indexOf(item.id) % 2 || undefined}
      className={styles.row}
      {...pointerHandlers(item, props, order)}
    >
      <span role="gridcell" className={styles.name}>
        <ItemIcon item={item} size={16} />
        <span className="truncate">{item.name}</span>
      </span>
      <span role="gridcell" className={styles.secondary}>
        {item.period ?? '--'}
      </span>
      <span role="gridcell" className={styles.secondary}>
        {item.kind}
      </span>
      <span role="gridcell" className={styles.secondary}>
        {item.owner ?? '--'}
      </span>
    </div>
  );

  return (
    <div
      ref={root}
      className={styles.view}
      role="grid"
      aria-label={label}
      aria-multiselectable="true"
      aria-rowcount={list.items.length + 1}
      aria-activedescendant={selection.focus ? optionId(prefix, selection.focus) : undefined}
      tabIndex={0}
      onKeyDown={(event) => {
        // The rows' keys; a focused sort button keeps its own.
        if (event.target !== event.currentTarget) return;
        navigate(event, props, order, (from, key) => {
          if (key === 'ArrowUp') return from > 0 ? from - 1 : null;
          if (key === 'ArrowDown') return from < order.length - 1 ? from + 1 : null;
          return null;
        });
      }}
      onFocus={selectFirstOnFocus(props, order[0])}
      onMouseDown={(event) => {
        if (!(event.target as Element).closest('[role="row"][data-item-id], [role="columnheader"]')) props.onSelectionChange(NONE);
      }}
    >
      <div role="rowgroup" className={styles.head}>
        <div role="row" className={styles.headRow}>
          {COLUMNS.map((column) => {
            const active = sort?.key === column.key;
            return (
              <span
                key={column.key}
                role="columnheader"
                aria-sort={active ? (sort.ascending ? 'ascending' : 'descending') : 'none'}
                className={styles.header}
              >
                <button type="button" onClick={() => onSortChange({ key: column.key, ascending: active ? !sort.ascending : true })}>
                  {column.label}
                  {active && <Symbol name={sort.ascending ? 'chevron.up' : 'chevron.down'} size={10} weight="semibold" />}
                </button>
              </span>
            );
          })}
        </div>
      </div>
      <div role="rowgroup" className={styles.body}>
        {list.groups
          ? list.groups.map((group) => (
              <Fragment key={group.id}>
                <div role="row" className={styles.groupRow}>
                  <span role="gridcell" aria-colspan={COLUMNS.length}>
                    {group.title}
                  </span>
                </div>
                {group.items.map(row)}
              </Fragment>
            ))
          : list.items.map(row)}
      </div>
      <div className={styles.filler} aria-hidden="true">
        {Array.from({ length: FILLER_ROWS }, (_, i) => (
          <i key={i} data-stripe={(order.length + i) % 2 || undefined} />
        ))}
      </div>
    </div>
  );
}
