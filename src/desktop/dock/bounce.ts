import { motionReduced } from '@/os/theme';

/** One hop takes this long; macOS repeats it until the app has launched. */
const HOP_MS = 620;

/**
 * The launch bounce: the icon hops and falls back under "gravity" (an ease-out
 * rise and an ease-in fall, which is ballistic motion rather than a spring),
 * again and again until `done()` says the app is up, at most three times.
 * Returns a function that lets the current hop finish and stops there.
 */
export function bounce(element: HTMLElement, height: number, done: () => boolean): () => void {
  if (motionReduced()) return () => undefined;
  let hops = 0;
  let stopped = false;
  const hop = () => {
    hops += 1;
    const animation = element.animate(
      [
        { transform: 'translateY(0)', easing: 'cubic-bezier(0.25, 0.6, 0.4, 1)' },
        { transform: `translateY(${-height}px)`, offset: 0.45, easing: 'cubic-bezier(0.6, 0, 0.75, 0.4)' },
        { transform: 'translateY(0)' },
      ],
      { duration: HOP_MS },
    );
    animation.onfinish = () => {
      if (!stopped && hops < 3 && !done()) hop();
    };
  };
  hop();
  return () => {
    stopped = true;
  };
}
