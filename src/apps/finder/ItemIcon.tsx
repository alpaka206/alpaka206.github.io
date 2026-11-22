import type { CSSProperties } from 'react';
import type { MediaKey } from '@/content/types';
import { media, mediaUrl, srcSet } from '@/media/Picture';
import { APPS } from '@/os/apps';
import { AppIcon } from '@/ui/AppIcon';
import type { FinderItem } from './items';
import styles from './ItemIcon.module.css';

/**
 * The icon Finder draws for an item, in a square of `size` pt:
 * - apps and projects: the squircle at 80.47% of the tile, the system icon
 *   grid (824 of 1024 px, macos.md §9), with the measured drop shadow;
 * - folders and blank documents: the system artwork, cut from a 1024 canvas,
 *   so it keeps its proportion inside the tile;
 * - PDFs, certificates and text files: an icon preview of the first page
 *   (Finder's "아이콘 미리보기", on by default).
 */
export function ItemIcon({ item, size }: { item: FinderItem; size: number }) {
  const box = { width: size, height: size } satisfies CSSProperties;
  switch (item.type) {
    case 'project':
    case 'app':
      return (
        <span className={styles.box} style={box} data-shadow={size >= 32 || undefined}>
          <AppIcon
            icon={item.type === 'app' ? APPS[item.app].icon : item.project.icon}
            size={Math.round(size * 0.8047 * 2) / 2}
            className={styles.app}
          />
        </span>
      );
    case 'folder':
    case 'trash':
      return <SystemArt src="system/folder" size={size} />;
    case 'pdf':
      return <PagePreview src="pdf/portfolio-01" size={size} fold />;
    case 'award':
      return <PagePreview src={item.award.images[0] ?? 'system/document'} size={size} />;
    case 'note':
      return (
        <span className={styles.box} style={box}>
          <SystemArt src="system/document" size={size} />
          {size >= 32 && <span className={styles.lines} aria-hidden="true" />}
        </span>
      );
  }
}

/** System artwork exported from a 1024 × 1024 icon canvas: scale by size / 1024. */
function SystemArt({ src, size }: { src: MediaKey; size: number }) {
  const { width, height } = media(src);
  return (
    <span className={styles.box} style={{ width: size, height: size }} data-shadow={size >= 32 || undefined}>
      <img
        src={mediaUrl(src, size * 2)}
        width={(width * size) / 1024}
        height={(height * size) / 1024}
        alt=""
        draggable={false}
        decoding="async"
      />
    </span>
  );
}

/**
 * First page or image, fitted into 94% of the tile on a white sheet with a
 * hairline edge. Documents get the folded corner Finder draws on their thumbnails.
 */
function PagePreview({ src, size, fold = false }: { src: MediaKey; size: number; fold?: boolean }) {
  const { width, height } = media(src);
  const scale = (size * 0.94) / Math.max(width, height);
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);
  const sheet = { width: w, height: h, '--fold': `${Math.round(size * 0.17)}px` } as CSSProperties;
  return (
    <span className={styles.box} style={{ width: size, height: size }} data-shadow={size >= 32 || undefined}>
      <span className={styles.sheet} style={sheet} data-fold={(fold && size >= 32) || undefined}>
        <img
          src={mediaUrl(src, w * 2)}
          srcSet={srcSet(src)}
          sizes={`${w}px`}
          width={w}
          height={h}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </span>
    </span>
  );
}
