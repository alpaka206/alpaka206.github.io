import { PROFILE, STATS } from '@/content/profile';
import type { ReactNode } from 'react';
import { Picture } from '@/media/Picture';
import { Glass } from '@/ui/Glass';
import { rectOf } from '../geometry';
import { usePhoneNav } from '../nav';
import jiggle from './jiggle.module.css';
import styles from './Widgets.module.css';

interface WidgetProps {
  /** Jiggle mode: the widget wobbles, wears the minus badge and opens nothing. */
  editing: boolean;
}

/** Opens `app` zooming out of `from` (28 pt widget corners); `key` is the tile it zooms back into. */
const launch = (from: HTMLElement, key: string, app: 'about' | 'portfolio', props = {}) =>
  usePhoneNav.getState().open(app, props, { rect: rectOf(from, 28), key });

/** The widget's slot: two grid rows, the label under it, the jiggle-mode wobble. */
function Slot({ editing, label, children }: { editing: boolean; label: string; children: ReactNode }) {
  return (
    <figure className={[styles.slot, editing && jiggle.jiggle].filter(Boolean).join(' ')}>
      {editing && <span className={`${jiggle.minus} ${styles.minus}`} aria-hidden="true" />}
      {children}
      <figcaption className={styles.caption}>{label}</figcaption>
    </figure>
  );
}

/**
 * Medium widgets (ios.md §4): 349.67 × 164.33 pt on a 402 pt iPhone,
 * 28 pt corners, 16 pt content padding, label Medium 12 six points below.
 */
export function AboutWidget({ editing }: WidgetProps) {
  return (
    <Slot editing={editing} label="소개">
      <Glass as="button" type="button" radius={28} className={styles.widget} data-launch="widget:about" onClick={(event) => !editing && launch(event.currentTarget, 'widget:about', 'about')}>
        <Picture src={PROFILE.portrait} alt="" sizes="100px" className={styles.portrait} />
        <span className={styles.about}>
          <span className={styles.name}>{PROFILE.name}</span>
          <span className={styles.headline}>{PROFILE.headline}</span>
          <span className={styles.company}>
            {PROFILE.current.company} {PROFILE.current.team}
          </span>
        </span>
      </Glass>
    </Slot>
  );
}

/** The four confirmed numbers; each opens the project it comes from. */
export function StatsWidget({ editing }: WidgetProps) {
  return (
    <Slot editing={editing} label="숫자로 보기">
      <Glass radius={28} className={`${styles.widget} ${styles.stats}`}>
        {STATS.map((stat) => (
          <button
            key={stat.value}
            type="button"
            className={styles.stat}
            data-launch={stat.project ? `stat:${stat.project}` : undefined}
            onClick={(event) => !editing && stat.project && launch(event.currentTarget, `stat:${stat.project}`, 'portfolio', { slug: stat.project })}
          >
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.statLabel}>{stat.label}</span>
          </button>
        ))}
      </Glass>
    </Slot>
  );
}
