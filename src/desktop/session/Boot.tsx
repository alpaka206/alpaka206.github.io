import { useEffect, useRef } from 'react';
import { useSession } from '@/os/session';
import { BrandMark } from '../menubar/BrandMark';
import { preloadDesktop } from './preload';
import styles from './Boot.module.css';

/** The bar never fills faster than this, so a cached visit still reads as a start-up. */
const MIN_MS = 1400;
/** On a slow connection the login window comes anyway; the desktop keeps loading behind it. */
const MAX_MS = 6000;
/** Boot logo height: Apple's is ≈ 76 × 93 pt (macos.md §19). */
const LOGO_HEIGHT = 93;

/**
 * Start-up: the mark centred on black and a 234 × 6 pt bar near the bottom
 * (macos.md §19). The bar shows real progress, preloading the wallpaper and
 * the Dock icons, capped by elapsed time so it moves smoothly. Any key or
 * click goes straight to the login window.
 */
export function Boot() {
  const fill = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const next = () => useSession.getState().go('login');
    const started = performance.now();
    let loaded = 0;
    let frame = 0;
    const draw = (now: number) => {
      const shown = Math.min(loaded, (now - started) / MIN_MS);
      fill.current?.style.setProperty('transform', `translateX(${(shown - 1) * 100}%)`);
      bar.current?.setAttribute('aria-valuenow', String(Math.round(shown * 100)));
      if (shown >= 1) return next();
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    void preloadDesktop((fraction) => {
      loaded = fraction;
    });
    const giveUp = window.setTimeout(next, MAX_MS);

    const skip = (event: Event) => {
      if (event instanceof KeyboardEvent && event.repeat) return;
      next();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(giveUp);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  return (
    <div className={styles.boot}>
      <BrandMark height={LOGO_HEIGHT} className={styles.logo} />
      <div ref={bar} role="progressbar" aria-label="시동 중" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} className={styles.bar}>
        <span ref={fill} className={styles.fill} />
      </div>
      <p className="visually-hidden">아무 키나 누르면 건너뜁니다.</p>
    </div>
  );
}
