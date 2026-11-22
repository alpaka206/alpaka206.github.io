import { useId, useMemo, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { toRect } from '@/os/windows';
import { ItemIcon } from './ItemIcon';
import type { FinderItem } from './items';
import { neighbor, NONE } from './selection';
import { iconLabelLines } from './truncate';
import { itemElement, navigate, optionId, pointerHandlers, selectFirstOnFocus, useLabelMeasure, useRevealFocus, type ViewProps } from './viewShared';
import styles from './IconView.module.css';

/**
 * Finder's icon view with this Mac's settings (com.apple.finder
 * StandardViewSettings.IconViewSettings): icon 64, text 12, grid spacing 54,
 * label below. The column pitch is icon + grid spacing (118 pt).
 */
const ICON = 64;
const GRID_SPACING = 54;
const PITCH = ICON + GRID_SPACING;
/** Label text may use the pitch less 2 pt a side for the selection capsule. */
const LABEL_WIDTH = PITCH - 4;
const LABEL_FONT = '400 12px';

export function IconView(props: ViewProps) {
  const { list, selection, label } = props;
  const prefix = useId();
  const root = useRef<HTMLDivElement>(null);
  const order = useMemo(() => list.items.map((item) => item.id), [list.items]);
  const measure = useLabelMeasure(LABEL_FONT);
  useRevealFocus(root, selection.focus);

  const onKeyDown = (event: KeyboardEvent) =>
    navigate(event, props, order, (from, key) => {
      const boxes = order.map((id) => toRect(itemElement(root.current, id)?.getBoundingClientRect() ?? new DOMRect()));
      const direction = ({ ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' } as const)[key as 'ArrowUp'];
      return direction ? neighbor(boxes, from, direction) : null;
    });

  const cell = (item: FinderItem) => {
    const itemLines = iconLabelLines(item.name, LABEL_WIDTH, measure);
    const truncated = itemLines.some((line) => line.includes('…'));
    return (
      <div
        key={item.id}
        id={optionId(prefix, item.id)}
        role="option"
        aria-selected={selection.ids.includes(item.id)}
        aria-label={item.name}
        title={truncated ? item.name : undefined}
        data-item-id={item.id}
        className={styles.cell}
        {...pointerHandlers(item, props, order)}
      >
        <span className={styles.icon}>
          <ItemIcon item={item} size={ICON} />
        </span>
        <span className={styles.label} aria-hidden="true">
          {itemLines.map((line, i) => (
            <span key={i} className={styles.line}>
              {line}
            </span>
          ))}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={root}
      className={styles.view}
      role="listbox"
      aria-label={label}
      aria-multiselectable="true"
      aria-activedescendant={selection.focus ? optionId(prefix, selection.focus) : undefined}
      tabIndex={0}
      style={{ '--pitch': `${PITCH}px`, '--icon': `${ICON}px` } as CSSProperties}
      onKeyDown={onKeyDown}
      onFocus={selectFirstOnFocus(props, order[0])}
      onMouseDown={(event) => {
        if (!(event.target as Element).closest('[role="option"]')) props.onSelectionChange(NONE);
      }}
    >
      {list.groups ? (
        list.groups.map((group) => (
          <div key={group.id} role="group" aria-labelledby={`${prefix}-${group.id}`} className={styles.group}>
            <h2 id={`${prefix}-${group.id}`} className={styles.groupTitle}>
              {group.title}
            </h2>
            <div className={styles.cells}>{group.items.map(cell)}</div>
          </div>
        ))
      ) : (
        <div className={styles.cells}>{list.items.map(cell)}</div>
      )}
    </div>
  );
}
