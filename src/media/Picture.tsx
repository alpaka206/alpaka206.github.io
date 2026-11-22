import type { CSSProperties } from 'react';
import type { MediaKey } from '@/content/types';
import manifest from './manifest.json';

interface Entry {
  width: number;
  height: number;
  widths: number[];
  formats: string[];
  /** Dominant colour, painted while the image loads. */
  color: string;
}

const entries = manifest as Record<string, Entry>;

export function media(key: MediaKey): Entry {
  const entry = entries[key];
  if (!entry) throw new Error(`Unknown media "${key}". Add it to /assets and run npm run images.`);
  return entry;
}

const url = (key: MediaKey, width: number, format: string) => `${import.meta.env.BASE_URL}media/${key}-${width}.${format}`;

/** URL of the smallest variant at least `width` px wide (for CSS backgrounds and preloads). */
export function mediaUrl(key: MediaKey, width = Infinity, format = 'webp'): string {
  const { widths } = media(key);
  const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1]!;
  return url(key, chosen, format);
}

export const srcSet = (key: MediaKey, format = 'webp') =>
  media(key)
    .widths.map((w) => `${url(key, w, format)} ${w}w`)
    .join(', ');

interface PictureProps {
  src: MediaKey;
  alt: string;
  /** Rendered width in CSS px or a sizes expression; drives which file the browser picks. */
  sizes: string;
  /** Above the fold: load eagerly with high priority (the wallpaper). */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * <picture> with AVIF and WebP sources, intrinsic width and height (no layout
 * shift) and the image's dominant colour as a placeholder for photos.
 */
export function Picture({ src, alt, sizes, priority = false, className, style }: PictureProps) {
  const entry = media(src);
  const photographic = entry.formats.includes('avif');
  return (
    <picture style={{ display: 'contents' }}>
      {photographic && <source type="image/avif" srcSet={srcSet(src, 'avif')} sizes={sizes} />}
      <img
        src={mediaUrl(src)}
        srcSet={srcSet(src)}
        sizes={sizes}
        width={entry.width}
        height={entry.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={className}
        style={photographic ? { backgroundColor: entry.color, ...style } : style}
      />
    </picture>
  );
}
