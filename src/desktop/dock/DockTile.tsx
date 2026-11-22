import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from 'react';
import { ItemIcon } from '@/apps/finder/ItemIcon';
import { isAppReady } from '@/desktop/windows/ready';
import { Picture } from '@/media/Picture';
import { APPS } from '@/os/apps';
import { AppIcon } from '@/ui/AppIcon';
import { bounce } from './bounce';
import { registerDockTarget } from './dockRects';
import { SQUIRCLE, type DockMetrics } from './geometry';
import type { DockItem, StackId } from './items';
import { STACKS } from './stacks';
import styles from './Dock.module.css';

export type TileItem = Exclude<DockItem, { kind: 'divider' }>;

export function tileName(item: TileItem): string {
  if (item.kind === 'app') return APPS[item.app].name;
  if (item.kind === 'stack') return STACKS[item.stack].name;
  return '휴지통';
}

interface DockTileProps {
  item: TileItem;
  metrics: DockMetrics;
  /** Roving tab stop: one tile in the Dock is reachable with Tab. */
  tabbable: boolean;
  /** A stack whose fan or grid is open. */
  expanded?: boolean;
  artRef: (element: HTMLElement | null) => void;
  /** Click or Return. Returns true when an app starts launching (the icon bounces). */
  onActivate: (origin: DOMRect) => boolean;
  /** Right-click, or the menu key on a focused tile, at a screen point. */
  onMenu: (point: { clientX: number; clientY: number }) => void;
  onHover: (hovered: boolean) => void;
  onFocus: () => void;
}

/** One Dock tile: the icon (drawn at the magnified size, scaled down at rest so it stays sharp), its running dot. */
export function DockTile({ item, metrics, tabbable, expanded, artRef, onActivate, onMenu, onHover, onFocus }: DockTileProps) {
  const lift = useRef<HTMLSpanElement>(null);
  const glyph = useRef<HTMLSpanElement>(null);
  const stopBounce = useRef<() => void>(undefined);
  const target = item.kind === 'app' ? item.app : item.kind === 'trash' ? 'trash' : null;

  useEffect(() => {
    if (!target || !glyph.current) return;
    return registerDockTarget(target, glyph.current);
  }, [target]);

  useEffect(() => () => stopBounce.current?.(), []);

  const activate = () => {
    const launched = onActivate(glyph.current!.getBoundingClientRect());
    if (launched && item.kind === 'app' && lift.current) {
      stopBounce.current?.();
      stopBounce.current = bounce(lift.current, metrics.tile * 0.5, () => isAppReady(item.app));
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault();
      const rect = glyph.current!.getBoundingClientRect();
      onMenu({ clientX: rect.left + rect.width / 2, clientY: rect.top });
    }
  };

  const name = tileName(item);
  const running = item.kind === 'app' && item.running;
  return (
    <button
      type="button"
      className={styles.tile}
      tabIndex={tabbable ? 0 : -1}
      aria-label={running ? `${name}, 실행 중` : name}
      aria-haspopup={item.kind === 'stack' ? 'dialog' : undefined}
      aria-expanded={item.kind === 'stack' ? Boolean(expanded) : undefined}
      onClick={activate}
      onContextMenu={(event: MouseEvent) => {
        event.preventDefault();
        onMenu(event);
      }}
      onKeyDown={onKeyDown}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onFocus={onFocus}
    >
      <span ref={lift} className={styles.lift}>
        <span ref={artRef} className={styles.art}>
          <span ref={glyph} className={item.kind === 'app' ? styles.glyph : styles.object}>
            {item.kind === 'app' && <AppIcon icon={APPS[item.app].icon} size={metrics.magnified * SQUIRCLE} />}
            {item.kind === 'trash' && <Picture src="system/trash-full" alt="" sizes={`${metrics.magnified}px`} className={styles.trash} />}
            {item.kind === 'stack' && <StackPile stack={item.stack} size={metrics.magnified} />}
          </span>
        </span>
      </span>
    </button>
  );
}

/** The items under the top one lean a little, left then right. */
const PILE_ANGLES = [-8, 6];

/**
 * A stack shows its newest items piled up, as macOS draws the Downloads
 * stack, each in the icon Finder gives it.
 */
function StackPile({ stack, size }: { stack: StackId; size: number }) {
  // At 90 % of the tile a page stands ≈ 54 pt tall on a 64 pt tile, as the Downloads stack does in the capture.
  const art = Math.round(size * 0.9);
  const [front, ...rest] = STACKS[stack].entries;
  const behind = rest.slice(0, PILE_ANGLES.length);
  return (
    <span className={styles.pile}>
      {behind.map((entry, i) => (
        <span key={entry.item.id} className={styles.pileItem} style={{ rotate: `${PILE_ANGLES[i]}deg` }}>
          <ItemIcon item={entry.item} size={art} />
        </span>
      ))}
      {front && (
        <span className={styles.pileItem}>
          <ItemIcon item={front.item} size={art} />
        </span>
      )}
    </span>
  );
}
