import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Slider } from '@/desktop/kit/controls';
import { Sidebar, SidebarItem, SidebarSection } from '@/desktop/kit/Sidebar';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup } from '@/desktop/kit/Toolbar';
import { useWindowTitle } from '@/desktop/kit/window';
import { Picture } from '@/media/Picture';
import { useFirstResponder } from '../finder/useFirstResponder';
import type { DesktopAppProps } from '../registry';
import { ALBUMS, albumById, LIBRARY, type AlbumId, type Photo } from './library';
import styles from './photos.module.css';

/**
 * Photos (사진): 보관함 and the albums in the sidebar, a square grid whose
 * size the toolbar slider sets (⌘+ and ⌘− stay the browser's page zoom), and a
 * viewer that fills the window on double-click, with ← → between photos and Escape back.
 * Strings are Photos' own on macOS 27.2.1 ("보관함", "앨범", "%ld장의 사진").
 */
type Source = 'library' | AlbumId;

/** Thumbnail edges the slider steps through, smallest to largest (Photos' zoom levels). */
const SIZES = [72, 100, 136, 184, 248, 330];
const DEFAULT_SIZE = 2;

const sourceOf = (album: string | undefined): Source => albumById(album)?.id ?? 'library';

export default function PhotosWindow({ props }: DesktopAppProps<'photos'>) {
  const [source, setSource] = useState<Source>(() => sourceOf(props.album));
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [selected, setSelected] = useState(0);
  const [viewing, setViewing] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDivElement>(null);
  const prefix = useId();

  const choose = (next: Source) => {
    setSource(next);
    setSelected(0);
    setViewing(false);
  };

  // Opened again on an album (e.g. from a case study): show it.
  const [requested, setRequested] = useState(props.album);
  if (props.album !== requested) {
    setRequested(props.album);
    if (props.album) choose(sourceOf(props.album));
  }

  const album = source === 'library' ? null : albumById(source);
  const photos: readonly Photo[] = album?.photos ?? LIBRARY;
  const title = album?.title ?? '보관함';
  const current = photos[Math.min(selected, photos.length - 1)];
  useWindowTitle(viewing && current ? current.alt : title);

  useLayoutEffect(() => {
    if (!viewing) grid.current?.querySelector(`[data-index="${selected}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [selected, viewing]);

  // The grid has the keyboard, or the viewer while it is open.
  useFirstResponder(() => (viewing ? viewer.current : grid.current), root, viewing ? 'viewer' : 'grid');

  const step = (delta: number) => setSelected((i) => Math.min(Math.max(i + delta, 0), photos.length - 1));
  const zoom = (delta: number) => setSize((s) => Math.min(Math.max(s + delta, 0), SIZES.length - 1));

  const columns = () => {
    const template = grid.current && getComputedStyle(grid.current).gridTemplateColumns;
    return template ? template.split(' ').length : 1;
  };

  // The arrows move through the grid; Space or Return opens the viewer.
  const onGridKey = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns(),
      ArrowDown: columns(),
      Home: -photos.length,
      End: photos.length,
    };
    if (event.key in moves) step(moves[event.key]!);
    else if (event.key === ' ' || event.key === 'Enter') setViewing(true);
    else return;
    event.preventDefault();
  };

  const onViewerKey = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === 'ArrowLeft') step(-1);
    else if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'Escape' || event.key === ' ') setViewing(false);
    else return;
    event.preventDefault();
  };

  const sidebar = (
    <Sidebar label="사진 사이드바">
      <SidebarSection title="사진">
        <SidebarItem label="보관함" icon="photo.on.rectangle" selected={source === 'library'} onSelect={() => choose('library')} />
      </SidebarSection>
      <SidebarSection title="앨범">
        {ALBUMS.map((a) => (
          <SidebarItem key={a.id} label={a.title} icon="square.stack" selected={source === a.id} onSelect={() => choose(a.id)} />
        ))}
      </SidebarSection>
    </Sidebar>
  );

  const toolbar = viewing ? (
    <Toolbar
      title={title}
      subtitle={`${selected + 1}/${photos.length}`}
      leading={
        <ToolbarGroup label="뷰어">
          <ToolbarButton icon="chevron.left" label="뒤로" onClick={() => setViewing(false)} />
        </ToolbarGroup>
      }
    >
      <ToolbarGroup label="사진 이동">
        <ToolbarButton icon="arrow.left" label="이전 사진" disabled={selected === 0} onClick={() => step(-1)} />
        <ToolbarButton icon="arrow.right" label="다음 사진" disabled={selected === photos.length - 1} onClick={() => step(1)} />
      </ToolbarGroup>
    </Toolbar>
  ) : (
    <Toolbar title={title} subtitle={`${photos.length}장의 사진`}>
      <ToolbarGroup label="확대/축소">
        <ToolbarButton icon="minus" label="축소" disabled={size === 0} onClick={() => zoom(-1)} />
        <span className={styles.slider}>
          <Slider
            aria-label="확대/축소"
            min={0}
            max={SIZES.length - 1}
            step={1}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </span>
        <ToolbarButton icon="plus" label="확대" disabled={size === SIZES.length - 1} onClick={() => zoom(1)} />
      </ToolbarGroup>
    </Toolbar>
  );

  return (
    <div ref={root} className={styles.window}>
      <SplitView sidebar={sidebar} toolbar={toolbar}>
        {viewing && current ? (
          <div
            ref={viewer}
            className={styles.viewer}
            tabIndex={-1}
            role="group"
            aria-label={`${current.alt}, ${selected + 1}/${photos.length}`}
            onKeyDown={onViewerKey}
            onDoubleClick={() => setViewing(false)}
          >
            <Picture
              key={current.key}
              src={current.key}
              alt={current.alt}
              sizes="(min-width: 1200px) 900px, 70vw"
              className={styles.full}
              priority
            />
          </div>
        ) : (
          <div
            ref={grid}
            className={styles.grid}
            style={{ '--cell': `${SIZES[size]}px` } as CSSProperties}
            role="listbox"
            aria-label={title}
            aria-activedescendant={current ? `${prefix}-${selected}` : undefined}
            tabIndex={0}
            onKeyDown={onGridKey}
          >
            {photos.map((p, i) => (
              <div
                key={p.key}
                id={`${prefix}-${i}`}
                role="option"
                aria-selected={i === selected}
                aria-label={p.alt}
                data-index={i}
                className={styles.cell}
                onMouseDown={() => setSelected(i)}
                onDoubleClick={() => setViewing(true)}
              >
                <Picture src={p.key} alt="" sizes={`${SIZES[size]}px`} className={styles.thumb} />
              </div>
            ))}
          </div>
        )}
      </SplitView>
    </div>
  );
}
