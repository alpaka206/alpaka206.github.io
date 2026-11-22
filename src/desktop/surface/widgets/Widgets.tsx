import type { CSSProperties, ReactNode } from 'react';
import { AWARDS, CAREER, PROFILE, STATS } from '@/content/profile';
import { getProject } from '@/content/projects';
import { SEQUENCE } from '@/apps/portfolio/toc';
import type { MediaKey, ProjectSlug } from '@/content/types';
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
 * They stay in full colour (macOS's 위젯 스타일: 전체 색상). Wide screens get a
 * third column with the work itself, so the room left of the desktop icons is not bare.
 */
export function Widgets() {
  return (
    <div className={styles.widgets}>
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
        <ProjectsWidget />
      </div>
      <div className={`${styles.column} ${styles.extra}`}>
        <WorkWidget />
        <AwardsWidget />
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

/** The case studies as a folder of apps: logos only, each opening its page in a window. */
function ProjectsWidget() {
  return (
    <Widget size="large" label="프로젝트">
      <h2 className={styles.eyebrow}>프로젝트</h2>
      <ul className={styles.apps}>
        {SEQUENCE.map((project) => (
          <li key={project.slug}>
            <button type="button" className={styles.app} aria-label={project.name} onClick={opens('portfolio', { slug: project.slug })}>
              <AppIcon icon={project.icon} size={52} className={styles.appIcon} />
              <span className="truncate">{project.short}</span>
            </button>
          </li>
        ))}
        <li>
          <button type="button" className={styles.app} onClick={opens('finder', { location: 'projects' })}>
            <Picture src="system/folder" alt="" sizes="52px" className={styles.folder} />
            <span className="truncate">모두 보기</span>
          </button>
        </li>
      </ul>
    </Widget>
  );
}

/** The services' own screens, as the Photos widget shows a few pictures: the desktop's colour. */
const WORK: { src: MediaKey; slug: ProjectSlug }[] = [
  { src: 'screens/mearri', slug: 'mearri' },
  { src: 'screens/harucut', slug: 'harucut' },
  { src: 'screens/comatching', slug: 'comatching' },
  { src: 'screens/alarmtalk', slug: 'alarmtalk' },
];

function WorkWidget() {
  return (
    <Widget size="large" label="작업 화면" className={styles.work}>
      {WORK.map(({ src, slug }) => {
        const project = getProject(slug);
        if (!project) return null;
        return (
          <button key={slug} type="button" className={styles.tile} onClick={opens('portfolio', { slug })}>
            <Picture src={src} alt="" sizes="172px" className={styles.tileImage} />
            <span className={styles.tileLabel}>{project.title}</span>
          </button>
        );
      })}
    </Widget>
  );
}

function AwardsWidget() {
  const latest = AWARDS[0]!;
  return (
    <Widget size="medium" label="수상">
      <button type="button" className={styles.awards} onClick={opens('finder', { location: 'awards' })}>
        <span className={styles.awardsText}>
          <span className={styles.eyebrowAccent}>수상</span>
          <span className={styles.company}>{AWARDS.length}건</span>
          <span className={`${styles.caption} clamp-2`}>
            {latest.date}, {latest.title}
          </span>
        </span>
        <span className={styles.certificates} aria-hidden="true">
          {AWARDS.slice(0, 3)
            .toReversed()
            .map((award, i) => (
              <span key={award.title} className={styles.certificate} style={{ '--fan': i - 1 } as CSSProperties}>
                <Picture src={award.images[0]!} alt="" sizes="78px" className={styles.certificateImage} />
              </span>
            ))}
        </span>
      </button>
    </Widget>
  );
}
