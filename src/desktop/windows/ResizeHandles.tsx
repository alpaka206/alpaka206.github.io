import type { PointerEvent } from 'react';
import type { Edges } from './geometry';
import styles from './WindowFrame.module.css';

/** Edges and corners by compass point; each name says which edges it moves. */
const HANDLES = ['n', 's', 'e', 'w', 'nw', 'ne', 'sw', 'se'] as const;

const edgesOf = (name: string): Edges => ({ top: name.includes('n'), bottom: name.includes('s'), left: name.includes('w'), right: name.includes('e') });

/**
 * Invisible resize targets around the window: 6 pt bands along the edges (2 pt
 * inside), 19 × 19 pt squares centred on the corners, mostly outside the
 * rounded outline (macos.md §2, measured on Tahoe).
 */
export function ResizeHandles({ onResizeStart }: { onResizeStart: (edges: Edges, event: PointerEvent<HTMLElement>) => void }) {
  return (
    <>
      {HANDLES.map((name) => (
        <div key={name} className={`${styles.handle} ${styles[name]}`} aria-hidden="true" onPointerDown={(event) => onResizeStart(edgesOf(name), event)} />
      ))}
    </>
  );
}
