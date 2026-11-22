import { useMemo, useRef, useState, type MouseEvent } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { getProject } from '@/content/projects';
import type { Project, ProjectSlug } from '@/content/types';
import { Sidebar, SidebarItem, SidebarSection } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowFrame, useWindowTitle } from '@/desktop/kit/window';
import { pathFor } from '@/os/routes';
import { motionReduced } from '@/os/theme';
import { toRect, useWindows } from '@/os/windows';
import { copyLink, shareUrl } from '../finder/share';
import { useFirstResponder } from '../finder/useFirstResponder';
import type { DesktopAppProps } from '../registry';
import { ProjectArticle } from './ProjectArticle';
import { neighbours, otherProjects, tableOfContents, type TocEntry } from './toc';
import styles from './portfolio.module.css';

/** A section counts as "current" once its top passes this far below the toolbar. */
const READING_LINE = 96;

export default function PortfolioWindow({ props }: DesktopAppProps<'portfolio'>) {
  const project = props.slug ? getProject(props.slug) : undefined;
  return project ? <PortfolioDocument key={project.slug} project={project} /> : <Missing />;
}

function Missing() {
  useWindowTitle('포트폴리오');
  return (
    <SplitView toolbar={<Toolbar title="포트폴리오" inset />}>
      <p className={styles.missing}>문서를 찾을 수 없습니다.</p>
    </SplitView>
  );
}

/**
 * One case study per window (windows.ts gives each slug its own window id).
 * 이전/다음 프로젝트 replace this window with the neighbour's: the neighbour's
 * window takes this frame and this one closes, so the desk keeps one window
 * per document and the reader stays in place.
 */
function PortfolioDocument({ project }: { project: Project }) {
  const { id: windowId } = useWindowFrame();
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [current, setCurrent] = useState(0);
  const [printing, setPrinting] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const jumping = useRef(false);
  const toc = useMemo(() => tableOfContents(project), [project]);
  const { previous, next } = neighbours(project.slug);
  useWindowTitle(project.title);
  useFirstResponder(() => scroller.current, root, project.slug);

  const targetOf = (entry: TocEntry | undefined) => {
    const article = scroller.current?.querySelector('article');
    const block = entry && article?.children[entry.child];
    return (entry?.item !== undefined ? block?.children[entry.item] : block) as HTMLElement | undefined;
  };

  const jump = (index: number) => {
    const target = targetOf(toc[index]);
    if (!target) return;
    setCurrent(index);
    jumping.current = true;
    const done = () => {
      jumping.current = false;
    };
    scroller.current?.addEventListener('scrollend', done, { once: true });
    window.setTimeout(done, 900);
    target.scrollIntoView({ block: 'start', behavior: motionReduced() ? 'auto' : 'smooth' });
  };

  /** The section being read: the last one whose top has passed the reading line (or the last visible one at the bottom). */
  const onScroll = () => {
    const box = scroller.current;
    if (!box || jumping.current) return;
    const top = box.getBoundingClientRect().top;
    const atBottom = box.scrollTop + box.clientHeight >= box.scrollHeight - 2;
    const limit = atBottom ? box.clientHeight - 24 : READING_LINE;
    let index = 0;
    toc.forEach((entry, i) => {
      const target = targetOf(entry);
      if (target && target.getBoundingClientRect().top - top <= limit) index = i;
    });
    setCurrent(index);
  };

  const replaceWith = (slug: ProjectSlug) => {
    const { windows, open, setRect, place, close } = useWindows.getState();
    const self = windows.find((w) => w.id === windowId);
    // Growing out of this very frame, the new document simply takes the old one's place.
    open('portfolio', { slug }, self?.rect);
    const opened = useWindows.getState().windows.at(-1);
    if (self && opened && opened.id !== windowId) {
      setRect(opened.id, self.rect);
      if (self.placement !== 'normal') place(opened.id, self.placement);
      close(windowId);
    }
  };

  const copy = () => void copyLink(shareUrl(pathFor('portfolio', { slug: project.slug })), 'portfolio');

  const openPdf = (event?: MouseEvent) => {
    const origin = event && toRect(event.currentTarget.getBoundingClientRect());
    useWindows.getState().open('preview', { page: project.pdfPages?.[0] ?? 1 }, origin);
  };

  // Print only the article: it is mounted on <body> for the duration of the print dialog.
  const print = () => {
    flushSync(() => setPrinting(true));
    window.print();
    setPrinting(false);
  };

  useWindowCommands({
    'portfolio.previous': () => previous && replaceWith(previous.slug),
    'portfolio.next': () => next && replaceWith(next.slug),
    'portfolio.copyLink': copy,
    'portfolio.openPdf': () => openPdf(),
    'portfolio.print': print,
    'portfolio.toggleSidebar': () => setSidebarHidden((hidden) => !hidden),
  });

  const sidebar = (
    <div className={styles.slim}>
      <Sidebar label="목차">
        <SidebarSection title="이 문서">
          {toc.map((entry, i) => (
            <SidebarItem key={`${entry.child}-${entry.item ?? ''}`} label={entry.title} selected={i === current} onSelect={() => jump(i)} />
          ))}
        </SidebarSection>
        {otherProjects(project.slug).map(({ group, projects }) => (
          <SidebarSection key={group.id} title={group.title}>
            {projects.map((other) => (
              <SidebarItem key={other.slug} label={other.title} icon="doc.text" onSelect={() => replaceWith(other.slug)} />
            ))}
          </SidebarSection>
        ))}
      </Sidebar>
    </div>
  );

  const toolbar = (
    <Toolbar
      title={project.title}
      subtitle={project.meta}
      inset={sidebarHidden}
      leading={
        <ToolbarGroup label="프로젝트 이동">
          <ToolbarButton
            icon="chevron.left"
            label={previous ? `이전 프로젝트: ${previous.title}` : '이전 프로젝트'}
            disabled={!previous}
            onClick={() => previous && replaceWith(previous.slug)}
          />
          <ToolbarButton
            icon="chevron.right"
            label={next ? `다음 프로젝트: ${next.title}` : '다음 프로젝트'}
            disabled={!next}
            onClick={() => next && replaceWith(next.slug)}
          />
        </ToolbarGroup>
      }
    >
      <ToolbarGroup label="공유">
        <ToolbarButton icon="link" label="링크 복사" onClick={copy} />
        <ToolbarButton icon="doc.text" label="PDF 쪽으로 보기" onClick={openPdf} disabled={!project.pdfPages?.length} />
      </ToolbarGroup>
    </Toolbar>
  );

  return (
    <div ref={root} className={styles.window}>
      <SplitView sidebar={sidebar} sidebarHidden={sidebarHidden} toolbar={toolbar}>
        <div ref={scroller} className={styles.scroller} onScroll={onScroll} tabIndex={-1}>
          <div className={styles.page}>
            <ProjectArticle project={project} />
          </div>
        </div>
        {printing &&
          createPortal(
            <div className={styles.print} data-print-root style={{ colorScheme: 'light' }}>
              <ProjectArticle project={project} />
            </div>,
            document.body,
          )}
      </SplitView>
    </div>
  );
}
