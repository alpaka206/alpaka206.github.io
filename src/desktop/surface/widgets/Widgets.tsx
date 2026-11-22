import type { ReactNode } from 'react';
import { CAREER, PROFILE, STATS } from '@/content/profile';
import { FEATURED, getProject } from '@/content/projects';
import type { ProjectSlug } from '@/content/types';
import { Picture } from '@/media/Picture';
import type { AppId, AppProps } from '@/os/apps';
import { toRect, useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Symbol } from '@/ui/Symbol';
import styles from './Widgets.module.css';

/**
 * Desktop widgets, top-left like macOS places them. macOS publishes no widget
 * sizes (macos.md §17), so these use WidgetKit's Mac families: small 170 × 170,
 * medium 364 × 170, large 364 × 382, corner radius ≈22, 16 pt content margins.
 * While an app is in front they turn vibrant (desaturated into the wallpaper),
 * and full colour again once the desktop is clicked, as on macOS 14 and later.
 */
export function Widgets({ vibrant }: { vibrant: boolean }) {
  return (
    <div className={styles.widgets} data-vibrant={vibrant || undefined}>
      <div className={styles.column}>
        <ProfileWidget />
        <div className={styles.stats}>
          {STATS.map((stat) => (
            <StatWidget key={stat.value} value={stat.value} label={stat.label} slug={stat.project} />
          ))}
        </div>
      </div>
      <div className={styles.column}>
        <NowWidget />
        <FeaturedWidget />
      </div>
    </div>
  );
}

/** A click handler that opens the app, growing its window out of the clicked row. */
function opens<A extends AppId>(app: A, props?: Partial<AppProps[A]>) {
  return (event: { currentTarget: Element }) => useWindows.getState().open(app, props, toRect(event.currentTarget.getBoundingClientRect()));
}

function Widget({ size, label, className, children }: { size: 'small' | 'medium' | 'large'; label: string; className?: string; children: ReactNode }) {
  return (
    <section className={[styles.widget, styles[size], className].filter(Boolean).join(' ')} aria-label={label}>
      {children}
    </section>
  );
}

function ProfileWidget() {
  return (
    <Widget size="medium" label="프로필" className={styles.profile}>
      <button type="button" className={styles.profileMain} onClick={opens('about')}>
        <Picture src={PROFILE.portrait} alt="" sizes="104px" className={styles.portrait} />
        <span className={styles.profileText}>
          <span className={styles.eyebrow}>{PROFILE.name}</span>
          <span className={styles.headline}>{PROFILE.headline}</span>
        </span>
      </button>
      <div className={styles.contacts}>
        <button type="button" className={styles.contact} onClick={opens('mail')}>
          <Symbol name="envelope" size={13} weight="medium" />
          <span className="truncate">{PROFILE.email}</span>
        </button>
        <button type="button" className={styles.contact} onClick={opens('github')}>
          <Symbol name="link" size={13} weight="medium" />
          <span className="truncate">{PROFILE.github.label}</span>
        </button>
      </div>
    </Widget>
  );
}

function StatWidget({ value, label, slug }: { value: string; label: string; slug?: ProjectSlug }) {
  const project = slug ? getProject(slug) : undefined;
  return (
    <Widget size="small" label={project?.name ?? label}>
      <button type="button" className={styles.stat} onClick={project ? opens('portfolio', { slug: project.slug }) : undefined}>
        {project && <AppIcon icon={project.icon} size={28} className={styles.statIcon} />}
        <span className={styles.value}>{value}</span>
        <span className={styles.caption}>{label}</span>
      </button>
    </Widget>
  );
}

function NowWidget() {
  const now = CAREER[0]!;
  const [team] = now.org.split(' / ');
  return (
    <Widget size="medium" label="지금">
      <button type="button" className={styles.nowHeader} onClick={opens('about', { view: 'profile', section: 'career' })}>
        <span className={styles.eyebrowAccent}>지금</span>
        <span className={styles.company}>{now.name}</span>
        <span className={styles.caption}>
          {team}, {PROFILE.current.since} - 현재
        </span>
      </button>
      <ul className={styles.duties}>
        {now.duties?.map((duty) => (
          <li key={duty.service}>
            <button type="button" className={styles.duty} onClick={opens('portfolio', { slug: 'eastaid' })}>
              <b>{duty.service}</b>
              <span className="truncate">{duty.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </Widget>
  );
}

function FeaturedWidget() {
  return (
    <Widget size="large" label="대표 프로젝트">
      <h2 className={styles.eyebrow}>대표 프로젝트</h2>
      <ul className={styles.featured}>
        {FEATURED.map((slug) => {
          const project = getProject(slug);
          if (!project) return null;
          return (
            <li key={slug}>
              <button type="button" className={styles.row} onClick={opens('portfolio', { slug })}>
                <AppIcon icon={project.icon} size={34} />
                <span className={styles.rowText}>
                  <b className="truncate">{project.name}</b>
                  <span className="truncate">{project.highlight}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Widget>
  );
}
