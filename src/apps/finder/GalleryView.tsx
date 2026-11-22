import { useId, useLayoutEffect, useMemo, useRef } from 'react';
import { InfoPane } from './InfoPane';
import { ItemPreview } from './ItemPreview';
import { itemElement, navigate, optionId, pointerHandlers, type ViewProps } from './viewShared';
import styles from './GalleryView.module.css';

/**
 * Gallery view: a large preview of the selection, the filmstrip under it at
 * Finder's gallery thumbnail size (GalleryViewSettings.iconSize 48) and the
 * information pane on the right.
 */
const THUMB = 48;

export function GalleryView(props: ViewProps) {
  const { list, selection, label } = props;
  const prefix = useId();
  const strip = useRef<HTMLDivElement>(null);
  const order = useMemo(() => list.items.map((item) => item.id), [list.items]);
  const current = list.items.find((item) => item.id === selection.focus) ?? null;

  useLayoutEffect(() => {
    if (selection.focus) itemElement(strip.current, selection.focus)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [selection.focus]);

  return (
    <div className={styles.gallery}>
      <div className={styles.stage}>
        <div className={styles.preview} onDoubleClick={() => current && props.onOpen(current)}>
          {current && <ItemPreview key={current.id} item={current} sizes="(min-width: 1400px) 900px, 60vw" />}
        </div>
        <div
          ref={strip}
          className={styles.strip}
          role="listbox"
          aria-label={label}
          aria-orientation="horizontal"
          aria-multiselectable="true"
          aria-activedescendant={selection.focus ? optionId(prefix, selection.focus) : undefined}
          tabIndex={0}
          onKeyDown={(event) =>
            navigate(event, props, order, (from, key) => {
              if (key === 'ArrowLeft') return from > 0 ? from - 1 : null;
              if (key === 'ArrowRight') return from < order.length - 1 ? from + 1 : null;
              return null;
            })
          }
        >
          {list.items.map((item) => (
            <div
              key={item.id}
              id={optionId(prefix, item.id)}
              role="option"
              aria-selected={selection.ids.includes(item.id)}
              aria-label={item.name}
              title={item.name}
              data-item-id={item.id}
              className={styles.thumb}
              style={{ width: THUMB, height: THUMB }}
              {...pointerHandlers(item, props, order)}
            >
              <ItemPreview item={item} sizes={`${THUMB}px`} compact />
            </div>
          ))}
        </div>
      </div>
      <InfoPane item={current} count={selection.ids.length} onOpen={props.onOpen} />
    </div>
  );
}
