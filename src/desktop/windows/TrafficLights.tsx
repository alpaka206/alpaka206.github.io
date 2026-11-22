import { useRef } from 'react';
import styles from './TrafficLights.module.css';

interface TrafficLightsProps {
  /** Key window: coloured; otherwise grey until the pointer is over them. */
  active: boolean;
  /** Unified toolbar (lights at 19, 19) or a plain 32 pt title bar (9, 9). */
  chrome: 'unified' | 'titlebar';
  /** Zoomed or tiled: the green button's arrows point inward. */
  filled: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onZoom: () => void;
  /** The pointer rested on the green button: show the tiling menu under it. */
  onTileMenu: (anchor: DOMRect) => void;
}

/** How long the pointer rests on the green button before its tiling menu opens (macOS ≈ 0.6 s). */
const HOLD_MS = 600;

/**
 * Close, minimise and zoom: 14 pt, 9 pt apart, at (19, 19) under a unified
 * toolbar or (9, 9) in a title bar (macos.md §4). Hovering the group shows all
 * three glyphs, also on inactive windows.
 */
export function TrafficLights({ active, chrome, filled, onClose, onMinimize, onZoom, onTileMenu }: TrafficLightsProps) {
  const timer = useRef(0);
  const hold = (button: HTMLElement) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onTileMenu(button.getBoundingClientRect()), HOLD_MS);
  };
  const release = () => window.clearTimeout(timer.current);

  return (
    // The gaps between the buttons are title bar: they drag the window.
    <div className={styles.lights} data-active={active || undefined} data-chrome={chrome} data-window-drag>
      <button type="button" className={styles.close} aria-label="닫기" onClick={onClose}>
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <path d="M4.6 4.6l4.8 4.8M9.4 4.6l-4.8 4.8" />
        </svg>
      </button>
      <button type="button" className={styles.minimize} aria-label="최소화" onClick={onMinimize}>
        <svg viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3.8 7h6.4" />
        </svg>
      </button>
      <button
        type="button"
        className={styles.zoom}
        aria-label="확대/축소"
        onClick={() => {
          release();
          onZoom();
        }}
        onPointerEnter={(event) => hold(event.currentTarget)}
        onPointerLeave={release}
        onPointerDown={release}
      >
        <svg viewBox="0 0 14 14" aria-hidden="true">
          {filled ? <path d="M6.7 6.7H3.1L6.7 3.1ZM7.3 7.3h3.6L7.3 10.9Z" /> : <path d="M3.9 3.9h4.3L3.9 8.2ZM10.1 10.1H5.8l4.3-4.3Z" />}
        </svg>
      </button>
    </div>
  );
}
