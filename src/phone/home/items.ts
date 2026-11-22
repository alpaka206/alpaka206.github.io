import { getProject } from '@/content/projects';
import type { MediaKey, ProjectSlug } from '@/content/types';
import { APPS, type AppId, type AppProps } from '@/os/apps';

/** Something on the Home Screen that opens an app. */
export interface AppItem {
  kind: 'app';
  /** Stable id: the saved order and the zoom-back target both use it. */
  id: string;
  app: AppId;
  props: Partial<AppProps[AppId]>;
  label: string;
  icon: MediaKey;
}

export interface FolderItem {
  kind: 'folder';
  id: string;
  label: string;
  apps: AppItem[];
}

export type HomeItem = AppItem | FolderItem;

/** The tile id that opens `app` with `props`, so a closing app can zoom back into it. */
export function launchKey(app: AppId, props: Partial<AppProps[AppId]> = {}): string {
  if (app === 'portfolio') return `project:${(props as AppProps['portfolio']).slug}`;
  if (app === 'finder' && (props as AppProps['finder']).location === 'awards') return 'awards';
  return `app:${app}`;
}

/** The tile on screen that `key` names (a Home Screen icon, a folder, a widget), if it is rendered. */
export const launchTile = (key: string) => document.querySelector<HTMLElement>(`[data-launch="${CSS.escape(key)}"]`);

const app = <A extends AppId>(id: A, props: Partial<AppProps[A]> = {}, label?: string, icon?: MediaKey): AppItem => ({
  kind: 'app',
  id: launchKey(id, props),
  app: id,
  props,
  label: label ?? APPS[id].phoneName ?? APPS[id].name,
  icon: icon ?? APPS[id].icon,
});

/** A case study as an app of its own, under its short label. */
const project = (slug: ProjectSlug): AppItem => {
  const found = getProject(slug);
  if (!found) throw new Error(`Unknown project "${slug}"`);
  return app('portfolio', { slug }, found.short, found.icon);
};

const folder = (id: string, label: string, apps: AppItem[]): FolderItem => ({ kind: 'folder', id: `folder:${id}`, label, apps });

/** The Home Screen in its default order (the approved design, P02). */
export const HOME_ITEMS: readonly HomeItem[] = [
  app('finder'),
  app('preview'),
  app('photos'),
  app('notes'),
  folder('estsoft', '이스트소프트', [project('premiere-plugin'), project('sales-automation'), project('mearri'), project('alarmtalk')]),
  folder('samsung', '삼성 QA', [project('global-web-qa'), project('image-qa')]),
  project('harucut'),
  folder('team', '팀 프로젝트', [project('comatching'), project('bucheon'), project('share-it'), project('saecha')]),
  app('github'),
  app('blog'),
  app('finder', { location: 'awards' }, '수상', 'icons/awards'),
  app('settings'),
];

export const DOCK_ITEMS: readonly AppItem[] = [app('messages'), app('mail'), app('safari'), app('about')];

const ALL_APPS: readonly AppItem[] = [...HOME_ITEMS.flatMap((item) => (item.kind === 'folder' ? item.apps : [item])), ...DOCK_ITEMS];
const ICON_OF = new Map(ALL_APPS.map((item) => [item.id, item.icon]));

/** The icon an app zooms out of and back into. */
export const iconFor = (app: AppId, props: Partial<AppProps[AppId]> = {}) => ICON_OF.get(launchKey(app, props)) ?? APPS[app].icon;

const FOLDER_OF = new Map(HOME_ITEMS.flatMap((item) => (item.kind === 'folder' ? item.apps.map((inner) => [inner.id, item.id] as const) : [])));

/** The folder that holds `key`, when it lives in one. */
export const folderOf = (key: string) => FOLDER_OF.get(key);

type WidgetId = 'about' | 'stats';

/** A cell on a Home Screen page: a medium widget fills two whole rows, an icon one cell. */
export type Slot = { kind: 'widget'; id: WidgetId } | { kind: 'item'; item: HomeItem };

export const WIDGETS: readonly Slot[] = [
  { kind: 'widget', id: 'about' },
  { kind: 'widget', id: 'stats' },
];

const COLUMNS = 4;
const WIDGET_ROWS = 2;

/**
 * Splits the slots into pages of `rows` × 4 cells, the way iOS flows icons on
 * to the next page. A 402 × 874 iPhone fits six rows (ios.md §2), so two
 * medium widgets leave room for eight icons and the rest go to page two.
 */
export function paginate(slots: readonly Slot[], rows: number): Slot[][] {
  const capacity = Math.max(rows, WIDGET_ROWS) * COLUMNS;
  const pages: Slot[][] = [[]];
  let used = 0;
  for (const slot of slots) {
    const size = slot.kind === 'widget' ? WIDGET_ROWS * COLUMNS : 1;
    if (slot.kind === 'widget') used = Math.ceil(used / COLUMNS) * COLUMNS;
    if (used + size > capacity) {
      pages.push([]);
      used = 0;
    }
    pages[pages.length - 1]!.push(slot);
    used += size;
  }
  return pages;
}

/** Icon (--ios-icon) + 5 pt gap + 14 pt label: the height of one icon cell. */
export const LABEL_HEIGHT = 5 + 14;
/** The last label stays this far above the search pill (the kit leaves 29 pt). */
const CLEARANCE = 16;

/** How many icon rows fit in `height`, at the kit's pitch, never more than the six a 402 × 874 iPhone shows. */
export function rowsThatFit(height: number, pitch: number, cell: number) {
  return Math.min(6, Math.max(2, Math.floor((height - CLEARANCE - cell) / pitch) + 1));
}

/** Moves `id` to where `target` is, shifting the items in between. */
export function moveTo(order: readonly string[], id: string, target: string): string[] {
  const next = order.filter((other) => other !== id);
  next.splice(order.indexOf(target), 0, id);
  return next;
}
