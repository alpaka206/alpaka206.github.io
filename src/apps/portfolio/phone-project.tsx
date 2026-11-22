import { getProject } from '@/content/projects';
import type { Link, MediaKey, Project } from '@/content/types';
import { media, Picture } from '@/media/Picture';
import { pathFor } from '@/os/routes';
import { GlassButton, NavScreen, Toolbar } from '@/phone/kit';
import { share, shareUrl } from '../finder/share';
import { ProjectArticle } from './ProjectArticle';
import styles from './project.phone.module.css';

/** Taller than this (height / width), a cover is a phone screenshot and gets a phone frame. */
const PHONE_RATIO = 1.6;

/** "alarm-talk.com 열기"; GitHub paths are too long for a button, so they read as GitHub. */
const linkTitle = (link: Link) => (new URL(link.href).hostname.endsWith('github.com') ? 'GitHub에서 보기' : `${link.label} 열기`);

/** The cover above the title: a phone in its frame, or a screenshot card. */
function Cover({ src, alt }: { src: MediaKey; alt: string }) {
  const { width, height } = media(src);
  const phone = height / width > PHONE_RATIO;
  return (
    <div className={styles.hero}>
      <div className={phone ? styles.phone : styles.card}>
        <Picture src={src} alt={alt} sizes={phone ? '150px' : '(max-width: 767px) 92vw, 480px'} priority className={styles.coverImage} />
      </div>
    </div>
  );
}

/** The floating bottom toolbar: the project's first link, and share. */
function ProjectToolbar({ project }: { project: Project }) {
  const [primary] = project.links;
  return (
    <Toolbar label="프로젝트 동작">
      {primary && (
        <GlassButton label={linkTitle(primary)} size={48} prominent href={primary.href} target="_blank" rel="noreferrer" className={styles.primary}>
          <span className="truncate">{linkTitle(primary)}</span>
        </GlassButton>
      )}
      <GlassButton
        label="공유"
        icon="square.and.arrow.up"
        size={48}
        className={primary ? undefined : styles.trailing}
        onClick={() => void share(project.title, shareUrl(pathFor('portfolio', { slug: project.slug })), 'portfolio')}
      />
    </Toolbar>
  );
}

/**
 * A case study on the phone: cover, large title (collapses into the bar),
 * the PDF's meta line and two-line lead, then the shared article.
 * Used by the portfolio app and pushed from Finder.
 */
export function ProjectScreen({ slug }: { slug: string }) {
  const project = getProject(slug);
  if (!project) {
    return (
      <NavScreen title="프로젝트" background="plain">
        <p className={styles.missing}>이 프로젝트를 찾을 수 없어요. 프로젝트 목록에서 다시 골라 주세요.</p>
      </NavScreen>
    );
  }
  return (
    <NavScreen
      title={project.title}
      background="plain"
      hero={project.cover && <Cover src={project.cover} alt={`${project.title} 화면`} />}
      bottom={<ProjectToolbar project={project} />}
    >
      <div className={styles.body}>
        <p className={styles.meta}>{project.meta}</p>
        <p className={styles.lead}>{project.lead}</p>
        <ProjectArticle project={project} header={false} />
      </div>
    </NavScreen>
  );
}
