import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { PROFILE } from '@/content/profile';
import { Sidebar } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowTitle } from '@/desktop/kit/window';
import { mediaUrl, Picture } from '@/media/Picture';
import { motionReduced } from '@/os/theme';
import { useFirstResponder } from '../finder/useFirstResponder';
import type { DesktopAppProps } from '../registry';
import { clampPage, FILE_NAME, PAGE_COUNT, PAGE_WIDTH, pageKey, pageLabel, PAGES, zoomed } from './pdf';
import styles from './preview.module.css';

/** PDFView's page break margins on macOS 27.2.1: 4.75 pt above and below each page, 4 pt beside it. */
const SIDE_MARGIN = 4;

function download() {
  const link = document.createElement('a');
  link.href = PROFILE.portfolioPdf;
  link.download = FILE_NAME;
  link.click();
}

/** Prints the real PDF (not the page images) through a hidden frame; opens it in a tab where a frame cannot print. */
function printPdf() {
  const frame = document.createElement('iframe');
  frame.title = FILE_NAME;
  frame.style.cssText = 'position: fixed; width: 0; height: 0; border: 0; opacity: 0';
  frame.src = PROFILE.portfolioPdf;
  frame.addEventListener('load', () => {
    try {
      frame.contentWindow?.print();
    } catch {
      window.open(PROFILE.portfolioPdf, '_blank', 'noopener');
    }
    window.setTimeout(() => frame.remove(), 60_000);
  });
  document.body.append(frame);
}

/**
 * Preview (미리보기) with the portfolio PDF: continuous scrolling at the
 * window's width (PDFView's "크기에 맞게"), thumbnails in the sidebar, and the
 * page number in the subtitle.
 */
export default function PreviewWindow({ props }: DesktopAppProps<'preview'>) {
  const [scale, setScale] = useState<number | 'fit'>('fit');
  const [current, setCurrent] = useState(() => clampPage(props.page ?? 1));
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  /** The point of the document at the centre of the view, as fractions, kept across a zoom. */
  const keepPosition = useRef<{ x: number; y: number } | null>(null);
  const prefix = useId();
  useWindowTitle(FILE_NAME);
  useFirstResponder(() => scroller.current, root, 'document');

  const pageElement = (page: number) => scroller.current?.querySelector<HTMLElement>(`[data-page="${page}"]`);

  const goToPage = (page: number, smooth = true) => {
    const target = clampPage(page);
    pageElement(target)?.scrollIntoView({ block: 'start', inline: 'nearest', behavior: smooth && !motionReduced() ? 'smooth' : 'auto' });
    setCurrent(target);
  };

  // Opened at a page ("PDF 쪽으로 보기"), now or later: show that page. Scrolling updates `current`.
  useLayoutEffect(() => {
    if (props.page) pageElement(clampPage(props.page))?.scrollIntoView({ block: 'start' });
  }, [props.page]);

  // Zooming keeps the same place of the document in the middle of the view, as PDFView does.
  useLayoutEffect(() => {
    const box = scroller.current;
    const centre = keepPosition.current;
    if (box && centre) {
      box.scrollLeft = centre.x * box.scrollWidth - box.clientWidth / 2;
      box.scrollTop = centre.y * box.scrollHeight - box.clientHeight / 2;
    }
    keepPosition.current = null;
  }, [scale]);

  useLayoutEffect(() => {
    thumbs.current?.querySelector(`[data-thumb="${current}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  /** The page that crosses the top third of the view is the one being read. */
  const onScroll = () => {
    const box = scroller.current;
    if (!box) return;
    const line = box.getBoundingClientRect().top + box.clientHeight / 3;
    const page = PAGES.find((p) => (pageElement(p)?.getBoundingClientRect().bottom ?? 0) > line) ?? PAGE_COUNT;
    if (page !== current) setCurrent(page);
  };

  const setZoom = (next: number | 'fit') => {
    const box = scroller.current;
    if (box) {
      keepPosition.current = {
        x: (box.scrollLeft + box.clientWidth / 2) / box.scrollWidth,
        y: (box.scrollTop + box.clientHeight / 2) / box.scrollHeight,
      };
    }
    setScale(next);
  };

  const fitScale = () => ((scroller.current?.clientWidth ?? PAGE_WIDTH) - SIDE_MARGIN * 2) / PAGE_WIDTH;
  const zoomBy = (steps: number) => setZoom(zoomed(scale === 'fit' ? fitScale() : scale, steps));

  useWindowCommands({
    'preview.zoomIn': () => zoomBy(1),
    'preview.zoomOut': () => zoomBy(-1),
    'preview.actualSize': () => setZoom(1),
    'preview.previous': () => goToPage(current - 1),
    'preview.next': () => goToPage(current + 1),
    'preview.download': download,
    'preview.print': printPdf,
  });

  // ⌥↑ / ⌥↓: 이전 항목 / 다음 항목 in Preview's 이동 menu. The arrows and Page keys scroll natively.
  const onKeyDown = (event: KeyboardEvent) => {
    if (!event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowUp') goToPage(current - 1);
    else if (event.key === 'ArrowDown') goToPage(current + 1);
    else return;
    event.preventDefault();
  };

  const onThumbKey = (event: KeyboardEvent) => {
    const step = { ArrowUp: -1, ArrowDown: 1, Home: -PAGE_COUNT, End: PAGE_COUNT }[event.key];
    if (step === undefined || event.metaKey || event.altKey) return;
    event.preventDefault();
    goToPage(current + step, false);
  };

  const fit = scale === 'fit';
  const pageWidth = fit ? undefined : Math.round(PAGE_WIDTH * scale);

  const sidebar = (
    <Sidebar label="미리보기 사이드바">
      <div
        ref={thumbs}
        className={styles.thumbs}
        role="listbox"
        aria-label="페이지 썸네일"
        tabIndex={0}
        aria-activedescendant={`${prefix}-${current}`}
        onKeyDown={onThumbKey}
      >
        {PAGES.map((page) => (
          <div
            key={page}
            id={`${prefix}-${page}`}
            role="option"
            aria-selected={page === current}
            aria-label={`${page}페이지`}
            data-thumb={page}
            className={styles.thumb}
            onClick={() => goToPage(page, false)}
          >
            <img src={mediaUrl(pageKey(page), 360)} width={360} height={203} alt="" loading="lazy" decoding="async" draggable={false} />
            <span className={styles.number}>{page}</span>
          </div>
        ))}
      </div>
    </Sidebar>
  );

  const toolbar = (
    <Toolbar
      title={FILE_NAME}
      subtitle={pageLabel(current)}
      inset={sidebarHidden}
      leading={
        <ToolbarGroup label="보기">
          <ToolbarButton
            icon="sidebar.left"
            label={sidebarHidden ? '사이드바 보기' : '사이드바 가리기'}
            pressed={!sidebarHidden}
            onClick={() => setSidebarHidden((hidden) => !hidden)}
          />
        </ToolbarGroup>
      }
    >
      <ToolbarGroup label="확대/축소">
        <ToolbarButton icon="minus" label="축소" onClick={() => zoomBy(-1)} />
        <ToolbarButton icon="plus" label="확대" onClick={() => zoomBy(1)} />
      </ToolbarGroup>
      <ToolbarGroup label="파일">
        <ToolbarLink icon="arrow.up.right.square" label="새 탭에서 열기" href={PROFILE.portfolioPdf} />
        <ToolbarButton icon="arrow.down.circle" label="PDF 내려받기" onClick={download} />
      </ToolbarGroup>
    </Toolbar>
  );

  return (
    <div ref={root} className={styles.window}>
      <SplitView sidebar={sidebar} sidebarHidden={sidebarHidden} toolbar={toolbar}>
        <div
          ref={scroller}
          className={styles.document}
          tabIndex={0}
          role="document"
          aria-label={`${FILE_NAME}, ${pageLabel(current)}`}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
        >
          <div
            className={styles.pages}
            data-fit={fit || undefined}
            style={{ '--page-width': pageWidth && `${pageWidth}px` } as CSSProperties}
          >
            {PAGES.map((page) => (
              <div key={page} className={styles.page} data-page={page}>
                <Picture
                  src={pageKey(page)}
                  alt={`포트폴리오 ${page}페이지`}
                  sizes={fit ? 'calc(100vw - 240px)' : `${pageWidth}px`}
                  priority={page === clampPage(props.page ?? 1)}
                />
              </div>
            ))}
          </div>
        </div>
      </SplitView>
    </div>
  );
}
