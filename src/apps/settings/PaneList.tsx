import type { CSSProperties } from 'react';
import { PROFILE } from '@/content/profile';
import { useWindowFrame } from '@/desktop/kit/window';
import { Picture } from '@/media/Picture';
import { Symbol, type SymbolName } from '@/ui/Symbol';
import { listArrowKeys } from '@/lib/arrowKeys';
import styles from './PaneList.module.css';

/**
 * The System Settings sidebar, shared with the profile window (소개), which is
 * built the same way: an account row on top, then panes with coloured tiles.
 */
export interface Pane<T extends string> {
  id: T;
  label: string;
  icon: SymbolName;
  /** Tile colour (a colour token); the glyph is always white. */
  tint: string;
  /** Extra words the sidebar search matches. */
  keywords?: readonly string[];
}

interface PaneListProps<T extends string> {
  label: string;
  panes: readonly Pane<T>[];
  selected: T;
  onSelect: (id: T) => void;
}

/** ↑/↓ move the selection like a focused source list. */
export function PaneList<T extends string>({ label, panes, selected, onSelect }: PaneListProps<T>) {
  const { active } = useWindowFrame();
  const ids = panes.map((pane) => pane.id);
  return (
    <ul className={styles.list} aria-label={label} data-key={active || undefined} onKeyDown={listArrowKeys(ids, selected, onSelect)}>
      {panes.map((pane) => (
        <li key={pane.id}>
          <button
            type="button"
            className={styles.item}
            data-value={pane.id}
            aria-current={pane.id === selected ? 'page' : undefined}
            onClick={() => onSelect(pane.id)}
          >
            <PaneIcon icon={pane.icon} tint={pane.tint} />
            <span className={styles.label}>{pane.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PaneIcon({ icon, tint, size = 'small' }: { icon: SymbolName; tint: string; size?: 'small' | 'large' }) {
  return (
    <span className={styles.tile} data-size={size} style={{ '--tile': tint } as CSSProperties} aria-hidden="true">
      <Symbol name={icon} size={size === 'small' ? 13 : 17} weight="medium" />
    </span>
  );
}

interface ProfileRowProps {
  subtitle: string;
  /** Makes the row a button (System Settings opens the account pane). */
  onOpen?: () => void;
}

/** The account row at the top of the sidebar: portrait, name, one line under it. */
export function ProfileRow({ subtitle, onOpen }: ProfileRowProps) {
  const body = (
    <>
      <Picture src={PROFILE.portrait} alt="" sizes="40px" className={styles.avatar} />
      <span className={styles.who}>
        <span className={styles.name}>{PROFILE.name}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
    </>
  );
  return onOpen ? (
    <button type="button" className={styles.profile} onClick={onOpen}>
      {body}
    </button>
  ) : (
    <div className={styles.profile}>{body}</div>
  );
}
