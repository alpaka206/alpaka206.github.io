import type { CSSProperties } from 'react';
import { media, mediaUrl } from '@/media/Picture';
import styles from './BrandMark.module.css';

const BRAND = 'brand/alpaca';
/** One file for the menu bar and the boot screen: the 256 px silhouette, used as a mask. */
const MASK = `url(${mediaUrl(BRAND, 256)})`;

/**
 * The alpaca silhouette where macOS puts the Apple logo, painted in the
 * current text colour through a mask (like an SF Symbol glyph).
 */
export function BrandMark({ height, className }: { height: number; className?: string }) {
  const { width: w, height: h } = media(BRAND);
  return (
    <span
      aria-hidden="true"
      className={[styles.mark, className].filter(Boolean).join(' ')}
      style={{ width: (height * w) / h, height, '--mark': MASK } as CSSProperties}
    />
  );
}
