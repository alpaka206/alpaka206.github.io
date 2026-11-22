import { useCallback, useEffect, useId, useLayoutEffect, useRef } from 'react';
import { project, SPRINGS } from '@/lib/spring';
import { useDrag } from '@/lib/useDrag';
import { motionReduced } from '@/os/theme';
import { Glass } from '@/ui/Glass';
import { clamp, rectOf, type Rect } from '../geometry';
import { useEscape } from '../hooks';
import { usePhoneNav } from '../nav';
import { progressVelocity, useRectMorph } from '../useRectMorph';
import { launchTile, type AppItem, type FolderItem } from './items';
import { Tile } from './Tile';
import styles from './FolderPanel.module.css';

/** The open folder keeps the Dock's 38 pt continuous corner (Apple publishes no folder metrics). */
const RADIUS = 38;
/** Dragged down this far (projected), the folder closes. */
const DISMISS = 140;

interface FolderPanelProps {
  folder: FolderItem;
  /** The folder icon: the panel zooms out of it and back into it. */
  from: Rect;
  onLaunch: (item: AppItem, icon: HTMLElement) => void;
  onClosed: () => void;
}

/**
 * An open folder: a Liquid Glass panel grows out of the folder icon (its mini
 * icons become the full-size ones), the title fades in above, the Home Screen
 * blurs behind. Tap outside, press Escape or swipe down to put it back; an
 * app opened from it takes it along when the app goes home.
 */
export function FolderPanel({ folder, from, onLaunch, onClosed }: FolderPanelProps) {
  const titleId = useId();
  const layer = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const rest = useRef<Rect | null>(null);

  const apply = useCallback(
    (rect: Rect) => {
      const element = panel.current;
      const home = rest.current;
      if (!element || !home) return;
      const scale = rect.w / home.w;
      element.style.transform = `translate3d(${rect.x - home.x}px, ${rect.y - home.y}px, 0) scale(${scale})`;
      // The glass corner, in the panel's own (scaled) pixels, so it reads as rect.r on screen.
      (element.firstElementChild as HTMLElement | null)?.style.setProperty('border-radius', `${rect.r / scale}px`);
      layer.current?.style.setProperty('--open', String(clamp((rect.w - from.w) / (home.w - from.w), 0, 1)));
    },
    [from],
  );
  const morph = useRectMorph(apply);

  useLayoutEffect(() => {
    const element = panel.current;
    if (!element) return;
    // Measure the resting place untransformed (StrictMode runs this effect twice).
    element.style.transform = '';
    rest.current = rectOf(element, RADIUS);
    if (motionReduced()) return morph.set(rest.current);
    morph.set(from);
    morph.animate(rest.current, { spring: SPRINGS.snappy });
  }, [from, morph]);

  useEffect(() => {
    panel.current?.querySelector('button')?.focus({ preventScroll: true });
    // On unmount, after the commit that made the Home Screen interactive again.
    return () => launchTile(folder.id)?.closest('button')?.focus({ preventScroll: true });
  }, [folder.id]);

  const close = useCallback(
    (velocity = 0) => {
      if (motionReduced()) return onClosed();
      morph.animate(from, { velocity, spring: SPRINGS.snappy, onComplete: onClosed });
    },
    [from, morph, onClosed],
  );
  const dismiss = useCallback(() => close(), [close]);
  useEscape(dismiss);

  // An app opened from the folder has zoomed back into it: the folder goes too.
  const appShown = usePhoneNav((s) => s.shown !== null);
  const launched = useRef(false);
  useEffect(() => {
    if (appShown) launched.current = true;
    else if (launched.current) {
      launched.current = false;
      close();
    }
  }, [appShown, close]);

  const drag = useDrag(
    {
      onStart: () => morph.stop(),
      onMove: ({ dy }) => {
        const home = rest.current;
        if (!home) return;
        // Follows the finger down, shrinking a little, like iOS.
        const down = Math.max(0, dy);
        const k = 1 - Math.min(down / window.innerHeight, 0.5) * 0.4;
        morph.set({ x: home.x + (home.w * (1 - k)) / 2, y: home.y + down * 0.7, w: home.w * k, h: home.h * k, r: RADIUS });
      },
      onEnd: ({ dy, vy }) => {
        const home = rest.current;
        if (!home) return;
        if (project(dy, vy) > DISMISS) close(progressVelocity(vy, Math.hypot(home.x - from.x, home.y - from.y)));
        else morph.animate(home, { velocity: progressVelocity(-vy, Math.max(dy, 1)), spring: SPRINGS.snappy });
      },
    },
    { axis: 'y' },
  );

  return (
    <div ref={layer} className={styles.layer} role="dialog" aria-modal="true" aria-labelledby={titleId} onPointerDown={drag}>
      <button type="button" tabIndex={-1} className={styles.backdrop} aria-label="닫기" onClick={dismiss} />
      <div className={styles.stage}>
        <h2 id={titleId} className={styles.title}>
          {folder.label}
        </h2>
        <div ref={panel} className={styles.panel}>
          <Glass refract radius={RADIUS} className={styles.glass}>
            <ul className={styles.grid}>
              {folder.apps.map((app) => (
                <li key={app.id}>
                  <Tile item={app} editing={false} onOpen={(item, icon) => item.kind === 'app' && onLaunch(item, icon)} onLongPress={() => undefined} />
                </li>
              ))}
            </ul>
          </Glass>
        </div>
      </div>
    </div>
  );
}
