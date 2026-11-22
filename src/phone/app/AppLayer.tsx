import { Suspense, useCallback, useLayoutEffect, useRef, type ComponentType } from 'react';
import { PHONE_VIEWS, type PhoneAppProps } from '@/apps/registry';
import { getProject } from '@/content/projects';
import { project, rubberband, springEasing, SPRINGS } from '@/lib/spring';
import { useDrag } from '@/lib/useDrag';
import { mediaUrl } from '@/media/Picture';
import { APPS, type AppProps } from '@/os/apps';
import { motionReduced } from '@/os/theme';
import { clamp, frameFor, iconRadius, isOnScreen, rectOf, type Rect } from '../geometry';
import { folderOf, iconFor, launchKey, launchTile } from '../home/items';
import { usePhoneNav, useStackFocus, type PhoneEntry } from '../nav';
import { progressVelocity, useRectMorph } from '../useRectMorph';
import styles from './AppLayer.module.css';

/** Dragged up past a quarter of the screen (projected), the app goes home. */
const CLOSE_AT = 0.25;
/** The card is half size once the finger has travelled 40% of the screen height. */
const CARD_TRAVEL = 0.4;
/** Cross-fade for reduced motion and for apps with no icon to land in. */
const FADE = springEasing(SPRINGS.smooth);

/** What the screen reader calls the open app: its Home Screen name, or the case study's title. */
function nameOf({ app, props }: PhoneEntry) {
  const slug = app === 'portfolio' ? (props as AppProps['portfolio']).slug : undefined;
  return (slug && getProject(slug)?.title) || APPS[app].phoneName || APPS[app].name;
}

const full = (radius: number): Rect => ({ x: 0, y: 0, w: window.innerWidth, h: window.innerHeight, r: radius });

/** The screen shrunk to `scale` around its centre. */
const centered = (scale: number, radius: number): Rect => {
  const { innerWidth: w, innerHeight: h } = window;
  return { x: (w * (1 - scale)) / 2, y: (h * (1 - scale)) / 2, w: w * scale, h: h * scale, r: radius };
};

/** The app card under the finger: it shrinks as it rises and follows sideways. */
function cardRect(dx: number, dy: number, radius: number): Rect {
  const { innerWidth: w, innerHeight: h } = window;
  if (dy >= 0) return { x: 0, y: rubberband(dy, h), w, h, r: radius };
  const scale = 1 - 0.5 * Math.min(1, -dy / (h * CARD_TRAVEL));
  return { x: (w - w * scale) / 2 + dx, y: h + dy - h * scale, w: w * scale, h: h * scale, r: radius };
}

/** Where a closing app lands: the tile it came from, else its Home Screen icon, else its folder. */
function landingFor(entry: PhoneEntry, originKey: string | undefined): Rect | null {
  const key = launchKey(entry.app, entry.props);
  for (const id of [originKey, key, folderOf(key)]) {
    const element = id && launchTile(id);
    if (!id || !element) continue;
    const radius = id.startsWith('widget:') || id.startsWith('stat:') ? 28 : iconRadius(element);
    const rect = rectOf(element, radius);
    if (isOnScreen(rect, window.innerWidth, window.innerHeight)) return rect;
  }
  return null;
}

interface AppLayerProps {
  /** True while an app fills the screen, so the Home Screen can stop drawing. */
  onCover: (covered: boolean) => void;
}

/**
 * The open app. It zooms out of the icon it was launched from (uniform
 * scale plus a clip whose corners grow to the display's), and goes back into
 * it when closed: by the home indicator (drag it up, the card follows the
 * finger), the nav bar's back button, or the browser's back. With reduced
 * motion it cross-fades instead.
 */
export function AppLayer({ onCover }: AppLayerProps) {
  const shown = usePhoneNav((s) => s.shown);
  const closing = usePhoneNav((s) => s.entry === null && s.shown !== null);
  const frame = useRef<HTMLElement>(null);
  const cover = useRef<HTMLImageElement>(null);
  const coverFrom = useRef(0);
  const settled = useRef(false);
  const wasClosing = useRef(false);
  const fade = useRef<Animation>(undefined);
  const dragged = useRef(false);
  const release = useRef(0);
  const dragRadius = useRef(0);
  /** The tile to focus once the Home Screen is live again (it stays inert until `shown` has cleared). */
  const returnTo = useRef<string | null>(null);
  useStackFocus(frame);

  const radius = () => parseFloat(frame.current ? getComputedStyle(frame.current).getPropertyValue('--phone-display-radius') : '') || 55;

  const apply = useCallback((rect: Rect) => {
    const element = frame.current;
    if (!element) return;
    settled.current = false;
    const geometry = frameFor(rect, window.innerWidth, window.innerHeight);
    element.style.transform = geometry.transform;
    element.style.clipPath = geometry.clipPath;
    const image = cover.current;
    if (!image) return;
    // The icon dissolves into the app while the frame grows to 2.5× the icon.
    image.style.opacity = coverFrom.current ? String(clamp(1 - (rect.w - coverFrom.current) / (coverFrom.current * 1.5), 0, 1)) : '0';
    image.style.top = `${geometry.top}px`;
    image.style.height = `${geometry.height}px`;
  }, []);
  const morph = useRectMorph(apply);

  /** Full screen at rest: no transform or clip, so it follows viewport changes by itself. */
  const settle = useCallback(() => {
    const element = frame.current;
    if (!element) return;
    element.style.transform = '';
    element.style.clipPath = '';
    settled.current = true;
    onCover(true);
  }, [onCover]);

  const key = shown ? `${shown.app}|${JSON.stringify(shown.props)}` : '';

  // Launch.
  useLayoutEffect(() => {
    const element = frame.current;
    if (!key || !element) return;
    const { origin } = usePhoneNav.getState();
    const isIcon = origin && !origin.key.startsWith('widget:') && !origin.key.startsWith('stat:');
    coverFrom.current = isIcon ? origin.rect.w : 0;
    onCover(false);
    if (!origin || motionReduced()) {
      morph.set(full(radius()));
      settle();
      element.animate([{ opacity: 0 }, { opacity: 1 }], FADE);
    } else {
      morph.set(origin.rect);
      morph.animate(full(radius()), { spring: SPRINGS.snappy, onComplete: settle });
    }
    // The app's own first focus (a sheet's title, an autofocused field) wins over the frame.
    if (!element.contains(document.activeElement)) element.focus({ preventScroll: true });
  }, [key, morph, onCover, settle]);

  // Close (Home, or history back to it), or a reopen that interrupts the close.
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    if (!closing) {
      // Reopened mid-close: grow back from wherever the app is.
      if (wasClosing.current) {
        fade.current?.cancel();
        morph.animate(full(radius()), { spring: SPRINGS.snappy, onComplete: settle });
      }
      wasClosing.current = false;
      return;
    }
    wasClosing.current = true;
    const { shown: entry, origin } = usePhoneNav.getState();
    if (!entry) return;
    const finish = () => {
      if (usePhoneNav.getState().entry) return;
      returnTo.current = origin?.key ?? launchKey(entry.app, entry.props);
      usePhoneNav.setState({ shown: null, origin: null });
    };
    onCover(false);
    if (settled.current) morph.set(full(radius()));
    const landing = landingFor(entry, origin?.key);
    const velocity = release.current;
    release.current = 0;
    if (landing && !motionReduced()) {
      coverFrom.current = landing.w;
      morph.animate(landing, { velocity, spring: SPRINGS.snappy, onComplete: finish });
      return;
    }
    // No icon to land in (none for this app on the current page), or reduced motion: fade out,
    // drifting a little toward the middle unless motion is reduced.
    if (!motionReduced()) morph.animate(centered(0.6, radius()));
    fade.current = element.animate([{ opacity: 1 }, { opacity: 0 }], FADE);
    fade.current.onfinish = finish;
  }, [closing, morph, onCover, settle]);

  useLayoutEffect(() => {
    if (shown || !returnTo.current) return;
    launchTile(returnTo.current)?.closest('button')?.focus({ preventScroll: true });
    returnTo.current = null;
  }, [shown]);

  const drag = useDrag({
    onStart: () => {
      dragged.current = true;
      dragRadius.current = radius();
      morph.stop();
      if (settled.current) morph.set(full(dragRadius.current));
      onCover(false);
    },
    onMove: ({ dx, dy }) => morph.set(cardRect(dx, dy, dragRadius.current)),
    onEnd: ({ dx, dy, vx, vy }) => {
      const card = cardRect(dx, dy, dragRadius.current);
      if (-project(dy, vy) > window.innerHeight * CLOSE_AT) {
        const entry = usePhoneNav.getState().shown;
        const landing = entry && landingFor(entry, usePhoneNav.getState().origin?.key);
        const distance = landing ? Math.hypot(landing.x - card.x, landing.y - card.y) : window.innerHeight;
        release.current = progressVelocity(Math.hypot(vx, vy), distance);
        usePhoneNav.getState().close();
      } else {
        // Back to full screen; a finger still moving away from it carries the card a little further first.
        morph.animate(full(dragRadius.current), { velocity: progressVelocity(vy, Math.max(Math.abs(dy), 1)), spring: SPRINGS.snappy, onComplete: settle });
      }
    },
  });

  if (!shown) return null;
  const View = PHONE_VIEWS[shown.app] as ComponentType<PhoneAppProps>;
  return (
    <section ref={frame} className={styles.frame} aria-label={nameOf(shown)} tabIndex={-1}>
      <div className={styles.content}>
        <Suspense fallback={<div className={styles.launch} />}>
          <View key={key} props={shown.props} />
        </Suspense>
      </div>
      <img ref={cover} className={styles.cover} src={mediaUrl(iconFor(shown.app, shown.props), 256)} alt="" draggable={false} />
      <button
        type="button"
        className={styles.handle}
        aria-label="홈 화면으로"
        onPointerDown={(event) => {
          dragged.current = false;
          drag(event);
        }}
        onClick={() => {
          if (!dragged.current) usePhoneNav.getState().close();
        }}
      >
        <span className={styles.indicator} />
      </button>
    </section>
  );
}
