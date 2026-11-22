import { placeItems, type FinderItem } from '@/apps/finder/items';
import { PROJECTS } from '@/content/projects';
import { AWARD_ITEMS, type QuickLookItem } from '@/desktop/quicklook/quickLook';
import { useWindows, type Rect } from '@/os/windows';

/**
 * The files that live on the desktop and in the Dock's 문서 stack. Their name
 * and icon come from Finder's own model (its 데스크탑 location), so a file
 * looks the same on the desktop as in a Finder window. Each knows how Finder
 * opens it and what Quick Look shows for it (a folder shows its contents).
 */
export type FileId = 'readme' | 'portfolio-pdf' | 'projects' | 'awards';

interface DesktopFile {
  /** The same file in Finder: name (extension included) and what ItemIcon draws. */
  item: FinderItem;
  /** `origin` is the icon's screen rect: the window grows out of it. */
  open: (origin?: Rect) => void;
  quickLook: () => readonly QuickLookItem[];
}

const desktop = new Map(placeItems('desktop').map((item) => [item.id, item]));

function finderItem(id: string): FinderItem {
  const item = desktop.get(id);
  if (!item) throw new Error(`Finder's desktop has no item "${id}"`);
  return item;
}

const windows = useWindows.getState;

export const FILES: Record<FileId, DesktopFile> = {
  readme: {
    item: finderItem('readme'),
    open: (origin) => windows().open('notes', { note: 'how-built' }, origin),
    quickLook: () => [{ kind: 'note', note: 'how-built' }],
  },
  'portfolio-pdf': {
    item: finderItem('pdf'),
    open: (origin) => windows().open('preview', {}, origin),
    quickLook: () => [{ kind: 'pdf' }],
  },
  projects: {
    item: finderItem('folder:projects'),
    open: (origin) => windows().open('finder', { location: 'projects' }, origin),
    quickLook: () => PROJECTS.map((project) => ({ kind: 'project', slug: project.slug })),
  },
  awards: {
    item: finderItem('folder:awards'),
    open: (origin) => windows().open('finder', { location: 'awards' }, origin),
    quickLook: () => AWARD_ITEMS,
  },
};
