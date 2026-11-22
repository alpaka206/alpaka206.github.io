import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { MediaKey } from '@/content/types';
import { useDrag } from '@/lib/useDrag';
import { Picture } from '@/media/Picture';
import { motionReduced } from '@/os/theme';
import { BackButton } from '@/phone/kit';
import styles from './viewer.phone.module.css';

interface ViewerPhoto {
  key: MediaKey;
  alt: string;
  /** Shown under the photo, may hold a line break; the alt text by default. */
  caption?: string;
}

/** Zoomed pictures are shown at twice their fitted size. */
const ZOOM = 2;
/** A second tap within this window is a double tap. */
const DOUBLE_TAP_MS = 260;

/** Where a zoomed picture's top-left corner sits in its box. */
type Pan = { x: number; y: number };

/** Keeps a 2× picture covering its w × h box. */
const clampPan = (x: number, y: number, w: number, h: number): Pan => ({
  x: Math.min(0, Math.max(-w * (ZOOM - 1), x)),
  y: Math.min(0, Math.max(-h * (ZOOM - 1), y)),
});

/** Zooming about the box point (x, y): with the origin at the top left, it stays put when translated by −point. */
const zoomAt = (x: number, y: number, w: number, h: number) => clampPan(-x, -y, w, h);

interface SlideProps {
  photo: ViewerPhoto;
  /** Load the picture (the visible slide and its neighbours). */
  near: boolean;
  /** The zoomed picture's offset; null while it fits the screen. */
  pan: Pan | null;
  tapZooms: boolean;
  onToggleChrome: () => void;
  onPan: (pan: Pan | null) => void;
}

/**
 * One photo. Tap (or double tap in Photos) zooms to 2× around the finger;
 * drag pans the zoomed picture; tap again fits it. Transforms only.
 */
function Slide({ photo, near, pan, tapZooms, onToggleChrome, onPan }: SlideProps) {
  const box = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLDivElement>(null);
  const start = useRef<Pan>({ x: 0, y: 0 });
  const tapTimer = useRef(0);

  useLayoutEffect(() => {
    if (image.current) image.current.style.transform = pan ? `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${ZOOM})` : '';
  }, [pan]);

  const toggleZoom = (clientX: number, clientY: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (rect) onPan(pan ? null : zoomAt(clientX - rect.left, clientY - rect.top, rect.width, rect.height));
  };

  const drag = useDrag({
    onStart: () => {
      if (pan) start.current = pan;
      image.current?.setAttribute('data-dragging', '');
    },
    onMove: ({ dx, dy }) => {
      const rect = box.current?.getBoundingClientRect();
      if (!pan || !rect || !image.current) return;
      const next = clampPan(start.current.x + dx, start.current.y + dy, rect.width, rect.height);
      image.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0) scale(${ZOOM})`;
    },
    onEnd: ({ dx, dy }) => {
      image.current?.removeAttribute('data-dragging');
      const rect = box.current?.getBoundingClientRect();
      if (pan && rect) onPan(clampPan(start.current.x + dx, start.current.y + dy, rect.width, rect.height));
    },
    onTap: (event) => {
      if (tapZooms) return toggleZoom(event.clientX, event.clientY);
      if (tapTimer.current) {
        window.clearTimeout(tapTimer.current);
        tapTimer.current = 0;
        return toggleZoom(event.clientX, event.clientY);
      }
      tapTimer.current = window.setTimeout(() => {
        tapTimer.current = 0;
        onToggleChrome();
      }, DOUBLE_TAP_MS);
    },
  });

  return (
    <div ref={box} className={styles.slide} data-zoomed={pan ? '' : undefined} onPointerDown={drag}>
      <div ref={image} className={styles.image}>
        {near && <Picture src={photo.key} alt={photo.alt} sizes="100vw" className={styles.picture} />}
      </div>
    </div>
  );
}

interface PhotoViewerProps {
  photos: readonly ViewerPhoto[];
  start: number;
  /** Shown at the top instead of the "3 / 20" counter. */
  title?: string;
  /** Certificates zoom on a single tap; in Photos a tap shows or hides the bars and a double tap zooms. */
  tapZooms?: boolean;
}

/**
 * Full-screen viewer on black. Swipe between photos with native scroll
 * snapping, or use ← and →; Return zooms in and out, + and − too. The back
 * button and the browser's back both return to where it was opened from.
 */
export function PhotoViewer({ photos, start, title, tapZooms = false }: PhotoViewerProps) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(start);
  const [chrome, setChrome] = useState(true);
  const [pan, setPan] = useState<Pan | null>(null);

  useLayoutEffect(() => {
    const element = track.current;
    if (element) element.scrollLeft = start * element.clientWidth;
  }, [start]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const element = track.current;
      if (!element || event.metaKey || event.ctrlKey || event.altKey) return;
      const { clientWidth: w, clientHeight: h } = element;
      if (event.key === 'Enter' || event.key === '+' || event.key === '=' || event.key === '-') {
        // Return on the back button presses it.
        if ((event.target as Element).closest('button, a')) return;
        event.preventDefault();
        const zoomIn = event.key === 'Enter' ? !pan : event.key !== '-';
        setPan(zoomIn ? (pan ?? zoomAt(w / 2, h / 2, w, h)) : null);
        return;
      }
      const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!step || pan) return;
      const next = Math.min(photos.length - 1, Math.max(0, Math.round(element.scrollLeft / w) + step));
      element.scrollTo({ left: next * w, behavior: motionReduced() ? 'auto' : 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [photos.length, pan]);

  const current = photos[index];
  return (
    <div className={styles.viewer} data-chrome={chrome || undefined}>
      <div className={styles.top}>
        <BackButton />
        {/* Where focus lands when the viewer is pushed (the phone's stack focuses [data-screen-title]). */}
        <p className={styles.title} aria-live="polite" tabIndex={-1} data-screen-title>
          {title ?? `${index + 1} / ${photos.length}`}
        </p>
      </div>
      {/* A Tab stop of its own, so Return has a photo to zoom. */}
      <div
        ref={track}
        className={styles.track}
        tabIndex={0}
        aria-label={current?.alt}
        data-locked={pan ? '' : undefined}
        onScroll={(event) => setIndex(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
      >
        {photos.map((photo, i) => (
          <Slide
            key={photo.key}
            photo={photo}
            near={Math.abs(i - index) <= 1}
            pan={i === index ? pan : null}
            tapZooms={tapZooms}
            onToggleChrome={() => setChrome((shown) => !shown)}
            onPan={setPan}
          />
        ))}
      </div>
      {current && <p className={styles.caption}>{current.caption ?? current.alt}</p>}
    </div>
  );
}
