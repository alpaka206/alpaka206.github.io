import { useLayoutEffect } from 'react';
import { useMediaQuery } from '@/lib/device';
import { ACCENTS, useSettings } from './settings';

/**
 * Mirrors settings onto <html> so CSS does the rest:
 * data-theme, data-motion, data-transparency and the --accent colour.
 */
export function useApplyTheme() {
  const dark = useDark();
  const accent = useSettings((s) => s.accent);
  const { motion, transparency } = useReduced();

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = dark ? 'dark' : 'light';
    root.dataset.motion = motion ? 'reduced' : 'full';
    root.dataset.transparency = transparency ? 'reduced' : 'full';
    root.style.setProperty('--accent', ACCENTS[accent][dark ? 'dark' : 'light']);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#000000' : '#f2f2f7');
  }, [dark, accent, motion, transparency]);
}

/** Reduce Motion and Reduce Transparency as they apply: the setting, or the system's while it is unset. */
export function useReduced() {
  const motion = useSettings((s) => s.reduceMotion);
  const transparency = useSettings((s) => s.reduceTransparency);
  const systemMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const systemTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  return { motion: motion ?? systemMotion, transparency: transparency ?? systemTransparency };
}

/** The effective appearance: the setting, or the system's while it is 자동. */
export function useDark() {
  const appearance = useSettings((s) => s.appearance);
  const system = useMediaQuery('(prefers-color-scheme: dark)');
  return appearance === 'dark' || (appearance === 'auto' && system);
}

/** For imperative animations: read the live setting instead of re-rendering. */
export const motionReduced = () => document.documentElement.dataset.motion === 'reduced';
