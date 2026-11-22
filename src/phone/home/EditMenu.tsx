import { useEffect, useRef } from 'react';
import { useRestoreFocus } from '@/lib/focus';
import { Glass } from '@/ui/Glass';
import { Glyph } from '../kit';
import styles from './EditMenu.module.css';

interface EditMenuProps {
  onClose: () => void;
  onReset: () => void;
  onWallpaper: () => void;
}

/**
 * What iOS's jiggle-mode "Edit" button offers, cut down to what this Home
 * Screen can really do. A Liquid Glass menu: 250 pt wide, 32 pt corners,
 * 42 pt items (ios.md §7). Two plain buttons in a small dialog (Tab moves
 * between them); the Home Screen handles Escape.
 */
export function EditMenu({ onClose, onReset, onWallpaper }: EditMenuProps) {
  const menu = useRef<HTMLDivElement>(null);
  useRestoreFocus();
  useEffect(() => {
    menu.current?.querySelector('button')?.focus();
  }, []);
  return (
    <>
      <button type="button" tabIndex={-1} className={styles.scrim} aria-label="닫기" onClick={onClose} />
      <div ref={menu} className={styles.anchor}>
        <Glass variant="menu" radius={32} className={styles.menu} role="dialog" aria-modal="true" aria-label="편집">
          <button type="button" className={styles.item} onClick={onReset}>
            <span>기본 배열로 되돌리기</span>
            <Glyph name="arrow.clockwise" pt={17} />
          </button>
          <button type="button" className={styles.item} onClick={onWallpaper}>
            <span>배경화면 바꾸기</span>
            <Glyph name="photo" pt={17} />
          </button>
        </Glass>
      </div>
    </>
  );
}
