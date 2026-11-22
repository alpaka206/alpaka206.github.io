import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { SplitView } from '@/desktop/kit/SplitView';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarSearch } from '@/desktop/kit/Toolbar';
import { useWindowCommands, useWindowTitle } from '@/desktop/kit/window';
import { openContextMenu } from '@/desktop/menus/contextMenu';
import { closeQuickLook, openQuickLook, useQuickLook } from '@/desktop/quicklook/quickLook';
import { toRect, useWindows } from '@/os/windows';
import type { SymbolName } from '@/ui/Symbol';
import type { DesktopAppProps } from '../registry';
import { linkFor, openInApp, placeLink, quickLookItem } from './actions';
import { activeColumnIds, ColumnView } from './ColumnView';
import { FinderSidebar } from './FinderSidebar';
import { GalleryView } from './GalleryView';
import { back, forward, go, start } from './history';
import { IconView } from './IconView';
import { InfoPane } from './InfoPane';
import { Inspector, INSPECTOR_WIDTH } from './Inspector';
import {
  columnRoots,
  enclosingPlace,
  flatten,
  isTagPlace,
  listing,
  placeTitle,
  sortListing,
  statusText,
  type FinderItem,
  type Place,
  type Sort,
} from './items';
import { ListView } from './ListView';
import { recordOpen, useRecents } from './recents';
import { NONE, only, selectAll, type Selection } from './selection';
import { copyLink } from './share';
import { TrashSheet, type TrashSheetKind } from './TrashSheet';
import { useFirstResponder } from './useFirstResponder';
import { itemElement, type ViewProps } from './viewShared';
import styles from './finder.module.css';

type ViewMode = 'icons' | 'list' | 'columns' | 'gallery';

/** 보기 › 아이콘 / 목록 / 계층 / 갤러리 (⌘1 … ⌘4), in Finder's order. */
const VIEWS: { mode: ViewMode; icon: SymbolName; label: string }[] = [
  { mode: 'icons', icon: 'square.grid.2x2', label: '아이콘' },
  { mode: 'list', icon: 'list.bullet', label: '목록' },
  { mode: 'columns', icon: 'rectangle.split.3x1', label: '계층' },
  { mode: 'gallery', icon: 'rectangle.on.rectangle', label: '갤러리' },
];

/** Finder remembers a view per folder; the projects folder opens as a gallery of the work. */
const DEFAULT_VIEW: Partial<Record<Place, ViewMode>> = { projects: 'gallery' };

/**
 * A Finder window: sidebar, toolbar, one of the four views, the status bar,
 * and the window's own panels (정보 가져오기, the trash's sheets). Opening
 * a file hands it to its app; menu items and their shortcuts arrive through
 * useWindowCommands while this window is key.
 */
export default function FinderWindow({ windowId, props }: DesktopAppProps<'finder'>) {
  const [history, setHistory] = useState(() => start<Place>(props.location ?? 'recents'));
  const place = history.current;
  const [views, setViews] = useState<Partial<Record<Place, ViewMode>>>({});
  const view = views[place] ?? DEFAULT_VIEW[place] ?? 'icons';
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Selection>(NONE);
  const [sort, setSort] = useState<Sort | null>(null);
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [previewShown, setPreviewShown] = useState(false);
  const [inspector, setInspector] = useState<{ id: string; x: number; y: number } | null>(null);
  const [sheet, setSheet] = useState<TrashSheetKind | null>(null);
  const recents = useRecents((s) => s.refs);
  const root = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const title = placeTitle(place);
  useWindowTitle(title);
  useFirstResponder(() => body.current?.querySelector<HTMLElement>('[data-view] [tabindex="0"]'), root, `${view} ${place}`);

  const list = useMemo(() => {
    const unsorted = listing(place, query, recents);
    return view === 'list' ? sortListing(unsorted, sort) : unsorted;
  }, [place, query, recents, view, sort]);
  const byId = useMemo(() => new Map(flatten([...list.items, ...columnRoots(list)]).map((item) => [item.id, item])), [list]);

  // The gallery always shows something: with nothing chosen it previews the first item, as Finder does.
  const first = list.items[0];
  const effective = view === 'gallery' && first && !selection.ids.some((id) => byId.has(id)) ? only(first.id) : selection;
  const selected = effective.ids.map((id) => byId.get(id)).filter((item): item is FinderItem => Boolean(item));
  const order = view === 'columns' ? activeColumnIds(list, effective.focus) : list.items.map((item) => item.id);

  /* ---------- navigation ---------- */

  const goTo = (next: Place, select: Selection = NONE) => {
    setHistory((h) => go(h, next));
    setSelection(select);
    setQuery('');
    setInspector(null);
  };

  // A window asked to show another place (the 이동 menu, a deep link) goes there.
  const [requested, setRequested] = useState(props.location);
  if (props.location !== requested) {
    setRequested(props.location);
    if (props.location && props.location !== place) goTo(props.location);
  }

  // The window's props follow the folder it shows, so the address bar (and a reload) land here too.
  // A tag is a filter, not a place with its own link: the window keeps its last folder.
  useEffect(() => {
    if (!isTagPlace(place)) useWindows.getState().setProps<'finder'>(windowId, { location: place });
  }, [windowId, place]);

  /** Back or forward, with the folder we came out of selected, as Finder does. */
  const step = (direction: 'back' | 'forward') => {
    const next = direction === 'back' ? back(history) : forward(history);
    if (next === history) return;
    setHistory(next);
    setSelection(only(`folder:${place}`));
    setQuery('');
    setInspector(null);
  };

  const setView = (mode: ViewMode) => {
    setViews((v) => ({ ...v, [place]: mode }));
    setInspector(null);
  };

  /* ---------- opening, Quick Look, information ---------- */

  const quickLook = (target?: FinderItem) => {
    const item = target ?? selected[0];
    if (!item) return;
    if (item.type === 'trash') return setSheet('about');
    if (useQuickLook.getState().items.length) return closeQuickLook();
    // Several selected: Quick Look pages through them. One selected: through the whole folder.
    const siblings = list.items.includes(item) ? list.items : [item];
    const pool = (selected.length > 1 ? selected : siblings).filter((i) => quickLookItem(i));
    const index = pool.indexOf(item);
    if (index < 0) return;
    openQuickLook(
      pool.map(quickLookItem).filter((entry) => entry !== null),
      index,
      itemElement(body.current, item.id)?.getBoundingClientRect(),
    );
  };

  const open = (item: FinderItem) => {
    switch (item.type) {
      case 'folder':
        if (item.place) goTo(item.place);
        else if (item.children[0]) setSelection(only(item.children[0].id));
        return;
      case 'trash':
        return setSheet('about');
      case 'award':
        recordOpen({ type: 'award', index: item.index });
        return quickLook(item);
      default: {
        const icon = itemElement(body.current, item.id);
        openInApp(item, icon ? toRect(icon.getBoundingClientRect()) : undefined);
      }
    }
  };

  /** Several selected open one by one; folders and the trash need a selection of one. */
  const openAll = (items: readonly FinderItem[]) => {
    const [single] = items;
    if (items.length === 1 && single) open(single);
    else items.filter((item) => item.type !== 'folder' && item.type !== 'trash').forEach(open);
  };

  const showInfo = (target?: FinderItem) => {
    const item = target ?? selected[0];
    const host = body.current;
    const anchor = item && itemElement(host, item.id);
    if (!item || !host || !anchor) return;
    const area = host.getBoundingClientRect();
    const at = anchor.getBoundingClientRect();
    const roomRight = area.right - at.right > INSPECTOR_WIDTH + 16;
    const x = roomRight ? at.right - area.left + 8 : Math.max(8, at.left - area.left - INSPECTOR_WIDTH - 8);
    const y = Math.min(Math.max(8, at.top - area.top), Math.max(8, area.height - 340));
    setInspector({ id: item.id, x, y });
  };

  const copyItemLink = (item: FinderItem) => {
    const url = linkFor(item);
    if (url) void copyLink(url, 'finder');
  };

  // Share copies the link of what was chosen, else of the folder (the gallery's preview of its first item is not a choice).
  const chosen = selection.ids.map((id) => byId.get(id)).find((item) => item !== undefined);
  const shareLink = chosen ? linkFor(chosen) : placeLink(place);

  const onContextMenu = (event: MouseEvent, item: FinderItem) => {
    const targets = effective.ids.includes(item.id) ? selected : [item];
    openContextMenu(
      event,
      [
        { label: '열기', command: 'open' },
        { label: '훑어보기', command: quickLookItem(item) || item.type === 'trash' ? 'quickLook' : undefined },
        'separator',
        { label: '정보 가져오기', command: 'info' },
        { label: '링크 복사', command: linkFor(item) ? 'copyLink' : undefined },
      ],
      (command) => {
        if (command === 'open') openAll(targets);
        else if (command === 'quickLook') quickLook(item);
        else if (command === 'info') showInfo(item);
        else if (command === 'copyLink') copyItemLink(item);
      },
    );
  };

  useWindowCommands({
    'finder.view.icons': () => setView('icons'),
    'finder.view.list': () => setView('list'),
    'finder.view.columns': () => setView('columns'),
    'finder.view.gallery': () => setView('gallery'),
    'finder.toggleSidebar': () => setSidebarHidden((hidden) => !hidden),
    'finder.togglePreview': () => setPreviewShown((shown) => !shown),
    'finder.open': () => openAll(selected),
    'finder.getInfo': () => showInfo(),
    'finder.quickLook': () => quickLook(),
    'finder.enclosing': () => {
      const up = enclosingPlace(place);
      if (up) goTo(up, only(`folder:${place}`));
    },
    'finder.emptyTrash': () => setSheet('confirm'),
    'nav.back': () => step('back'),
    'nav.forward': () => step('forward'),
    'go.recents': () => goTo('recents'),
    'go.documents': () => goTo('documents'),
    'go.desktop': () => goTo('desktop'),
    'go.applications': () => goTo('applications'),
    'go.projects': () => goTo('projects'),
    'go.awards': () => goTo('awards'),
    'edit.selectAll': () => setSelection(selectAll(order)),
    'edit.find': () => root.current?.querySelector<HTMLInputElement>('input[type="search"]')?.focus(),
  });

  // Keys that are not menu items: Space (Quick Look), Return and ⌘↓ (open), Escape (deselect).
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.target as HTMLElement).closest('input, textarea, button, [role="dialog"], [role="alertdialog"]')) return;
    const plain = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
    if (event.key === ' ' && plain) quickLook();
    else if ((event.key === 'Enter' && plain) || (event.key === 'ArrowDown' && event.metaKey)) openAll(selected);
    else if (event.key === 'Escape' && plain && selection.ids.length) setSelection(NONE);
    else return;
    event.preventDefault();
  };

  /* ---------- rendering ---------- */

  const viewProps: ViewProps = { list, selection: effective, onSelectionChange: setSelection, onOpen: open, onContextMenu, label: title };
  const fileView = {
    icons: <IconView {...viewProps} />,
    list: <ListView {...viewProps} sort={sort} onSortChange={setSort} />,
    columns: <ColumnView {...viewProps} />,
    gallery: <GalleryView {...viewProps} />,
  }[view];
  const single = selected.length === 1 ? (selected[0] ?? null) : null;
  const inspected = inspector ? byId.get(inspector.id) : undefined;

  // Back and forward in one capsule, the folder's name, the views (the current one pressed), share and search: three groups plus search, per the HIG.
  const toolbar = (
    <Toolbar
      title={title}
      inset={sidebarHidden}
      leading={
        <ToolbarGroup label="탐색">
          <ToolbarButton icon="chevron.left" label="뒤로" disabled={!history.back.length} onClick={() => step('back')} />
          <ToolbarButton icon="chevron.right" label="앞으로" disabled={!history.forward.length} onClick={() => step('forward')} />
        </ToolbarGroup>
      }
    >
      <ToolbarGroup label="보기">
        {VIEWS.map(({ mode, icon, label }) => (
          <ToolbarButton key={mode} icon={icon} label={label} pressed={view === mode} onClick={() => setView(mode)} />
        ))}
      </ToolbarGroup>
      <ToolbarGroup label="공유">
        <ToolbarButton
          icon="square.and.arrow.up"
          label="공유"
          title={shareLink ? `‘${chosen?.name ?? title}’ 링크 복사` : '공유할 링크 없음'}
          disabled={!shareLink}
          onClick={() => {
            if (shareLink) void copyLink(shareLink, 'finder');
          }}
        />
      </ToolbarGroup>
      <ToolbarSearch
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setQuery('');
        }}
      />
    </Toolbar>
  );

  return (
    <div ref={root} className={styles.window}>
      <SplitView sidebar={<FinderSidebar place={place} onNavigate={goTo} />} sidebarHidden={sidebarHidden} toolbar={toolbar}>
        <div ref={body} className={styles.body} onKeyDown={onKeyDown}>
          <div className={styles.main}>
            <div className={styles.viewport} data-view={view}>
              {fileView}
              {query && !list.items.length && <p className={styles.empty}>결과 없음</p>}
            </div>
            {previewShown && (view === 'icons' || view === 'list') && (
              <InfoPane item={single} count={selected.length} onOpen={open} withPreview />
            )}
          </div>
          <footer className={styles.status} aria-live="polite">
            {statusText(view === 'columns' ? order.length : list.items.length, selected.length)}
          </footer>
          {inspected && inspector && (
            <Inspector item={inspected} x={inspector.x} y={inspector.y} where={title} onOpen={open} onClose={() => setInspector(null)} />
          )}
          {sheet && <TrashSheet kind={sheet} onChange={setSheet} />}
        </div>
      </SplitView>
    </div>
  );
}
