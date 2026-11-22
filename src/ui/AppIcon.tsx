import type { CSSProperties } from 'react';
import type { MediaKey } from '@/content/types';
import { mediaUrl, srcSet } from '@/media/Picture';
import styles from './AppIcon.module.css';

interface AppIconProps {
  icon: MediaKey;
  /** Rendered edge in CSS px. */
  size: number;
  /** Accessible name; omit when a visible label sits next to the icon. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * An app icon clipped to Apple's continuous-corner squircle (the outline from
 * the official iOS UI kit, scaled with the icon) with the system's hairline rim.
 */
export function AppIcon({ icon, size, label, className, style }: AppIconProps) {
  return (
    <span className={[styles.icon, className].filter(Boolean).join(' ')} style={{ ...style, width: size, height: size }}>
      <img
        src={mediaUrl(icon, size * 2)}
        srcSet={srcSet(icon)}
        sizes={`${size}px`}
        width={size}
        height={size}
        alt={label ?? ''}
        draggable={false}
        decoding="async"
      />
    </span>
  );
}
