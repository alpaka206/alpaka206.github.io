import { useRef, useState, type ReactNode, type UIEvent } from 'react';
import { usePhoneApp } from '../nav';
import { GlassButton } from './GlassButton';
import styles from './NavScreen.module.css';

interface NavScreenProps {
  title: string;
  /** iOS large title that collapses into the bar as the page scrolls (default). */
  large?: boolean;
  /** Replaces the back button; `null` leaves the leading edge empty. */
  leading?: ReactNode;
  trailing?: ReactNode;
  /** Something above the title that scrolls with the page (a cover image). */
  hero?: ReactNode;
  /** A floating bar at the bottom (tab bar, toolbar); content keeps clear of it. */
  bottom?: ReactNode;
  /** `grouped` is systemGroupedBackground for inset lists, `plain` systemBackground. */
  background?: 'grouped' | 'plain';
  /** Content fills the space under the bar without scrolling (an iframe that scrolls itself). */
  fill?: boolean;
  children: ReactNode;
}

/**
 * An iOS 26 navigation screen: glass buttons float over the content, the
 * inline title fades in once the large title scrolls away, and a soft blur
 * (the "scroll edge effect") separates the bar from what passes under it.
 * The bar comes first in the DOM, as a screen reader expects; its title (the
 * h1) is where focus lands when the screen is pushed (nav.ts). A different
 * title layout is a different screen, so it starts fresh.
 */
export function NavScreen(props: NavScreenProps) {
  return <Screen key={`${props.large ?? true}:${Boolean(props.hero)}`} {...props} />;
}

function Screen({ title, large = true, leading, trailing, hero, bottom, background = 'grouped', fill = false, children }: NavScreenProps) {
  const [scroll, setScroll] = useState({ scrolled: false, collapsed: !large && !hero });
  const titleRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const onScroll = (event: UIEvent<HTMLElement>) => {
    const top = event.currentTarget.scrollTop;
    // The inline title takes over once the large title (or the hero) has slid under the bar.
    const anchor = titleRef.current ?? heroRef.current;
    const bar = barRef.current;
    const scrolled = top > 0;
    const collapsed = !anchor || !bar || anchor.offsetTop + anchor.offsetHeight - top < bar.offsetHeight;
    if (scrolled !== scroll.scrolled || collapsed !== scroll.collapsed) setScroll({ scrolled, collapsed });
  };

  const heading = { tabIndex: -1, 'data-screen-title': '' };
  return (
    <div
      className={styles.screen}
      data-background={background}
      data-hero={hero ? '' : undefined}
      data-bottom={bottom ? '' : undefined}
      data-fill={fill || undefined}
    >
      <header ref={barRef} className={styles.bar} data-scrolled={scroll.scrolled || undefined} data-collapsed={scroll.collapsed || undefined}>
        <div className={styles.leading}>{leading === undefined ? <BackButton /> : leading}</div>
        {large ? (
          <p className={styles.inlineTitle} aria-hidden="true">
            {title}
          </p>
        ) : (
          <h1 {...heading} className={styles.inlineTitle}>
            {title}
          </h1>
        )}
        <div className={styles.trailing}>{trailing}</div>
      </header>
      <div className={styles.scroll} onScroll={onScroll}>
        {hero && <div ref={heroRef}>{hero}</div>}
        {large && (
          <h1 ref={titleRef} {...heading} className={styles.largeTitle}>
            {title}
          </h1>
        )}
        <div className={styles.content}>{children}</div>
      </div>
      {bottom}
    </div>
  );
}

/** Pops an in-app screen, or goes to the Home Screen from an app's first screen. */
export function BackButton() {
  const { screens, back, close } = usePhoneApp();
  return <GlassButton icon="chevron.left" label={screens.length ? '뒤로' : '홈 화면으로'} onClick={screens.length ? back : close} />;
}
