import type { CSSProperties, PointerEvent } from 'react';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import { useIconSize } from '../hooks';
import type { FolderItem, HomeItem } from './items';
import { useLongPress } from './useLongPress';
import jiggle from './jiggle.module.css';
import styles from './Tile.module.css';

interface TileProps {
  item: HomeItem;
  editing: boolean;
  /** Tap: launch the app or open the folder; `icon` is the element to zoom out of. */
  onOpen: (item: HomeItem, icon: HTMLElement) => void;
  /** Touch and hold: enter jiggle mode. */
  onLongPress: () => void;
  /** In jiggle mode a press starts dragging the icon instead. */
  onDragStart?: (event: PointerEvent<HTMLElement>) => void;
  /** In jiggle mode the arrow keys move the icon: ±1 across, ±4 a row up or down. */
  onKeyMove?: (step: number) => void;
  /** Dock icons have no label (the name is still announced). */
  labelled?: boolean;
  /** Wobble out of phase with the neighbours in jiggle mode. */
  offset?: boolean;
}

/** Keyboard stand-ins: the context-menu key enters jiggle mode, arrows move an icon in it. */
const STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -4, ArrowDown: 4 };

/** A Home Screen icon: 64 pt squircle, label Medium 12/14 five points below (ios.md §2). */
export function Tile({ item, editing, onOpen, onLongPress, onDragStart, onKeyMove, labelled = true, offset = false }: TileProps) {
  const size = useIconSize();
  const press = useLongPress(onLongPress);
  return (
    <button
      type="button"
      className={[styles.tile, editing && jiggle.jiggle, editing && offset && jiggle.offset].filter(Boolean).join(' ')}
      data-editing={editing || undefined}
      aria-label={item.kind === 'folder' ? `${item.label} 폴더, 앱 ${item.apps.length}개` : labelled ? undefined : item.label}
      aria-haspopup={item.kind === 'folder' ? 'dialog' : undefined}
      onPointerDown={(event) => (editing ? onDragStart?.(event) : press.onPointerDown(event))}
      onClick={(event) => {
        if (press.consume() || editing) return;
        const icon = event.currentTarget.querySelector<HTMLElement>('[data-launch]');
        if (icon) onOpen(item, icon);
      }}
      onContextMenu={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (!editing && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
          event.preventDefault();
          onLongPress();
        } else if (editing && onKeyMove && STEPS[event.key]) {
          event.preventDefault();
          onKeyMove(STEPS[event.key]!);
        }
      }}
    >
      <span className={styles.icon} data-launch={item.id}>
        {item.kind === 'folder' ? <FolderIcon folder={item} size={size} /> : <AppIcon icon={item.icon} size={size} className={styles.image} />}
        {editing && <span className={jiggle.minus} aria-hidden="true" />}
      </span>
      {labelled && <span className={styles.label}>{item.label}</span>}
    </button>
  );
}

/**
 * A folder: a glass squircle with up to nine apps in a 3 × 3 grid. Apple
 * publishes no folder metrics, so they are derived from the 64 pt icon: 9 pt
 * padding and 4 pt gaps leave 12.67 pt per mini icon, which is also the open
 * folder's 3 × 3 grid scaled down to the icon (the zoom lines them up).
 */
function FolderIcon({ folder, size }: { folder: FolderItem; size: number }) {
  const padding = (size * 9) / 64;
  const gap = (size * 4) / 64;
  const mini = (size - padding * 2 - gap * 2) / 3;
  return (
    <Glass as="span" radius={size * 0.26} className={styles.folder} style={{ '--folder-pad': `${padding}px`, '--folder-gap': `${gap}px` } as CSSProperties}>
      {folder.apps.slice(0, 9).map((app) => (
        <AppIcon key={app.id} icon={app.icon} size={mini} className={styles.mini} />
      ))}
    </Glass>
  );
}
