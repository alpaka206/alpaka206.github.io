import type { QuickLookItem } from '@/desktop/quicklook/quickLook';
import { parseRoute, pathFor } from '@/os/routes';
import { useWindows, type Rect } from '@/os/windows';
import { COMMITS_URL, type FinderItem, type Place } from './items';
import { shareUrl } from './share';

/** What Quick Look can show for an item; folders, apps and the trash have no preview there. */
export function quickLookItem(item: FinderItem): QuickLookItem | null {
  switch (item.type) {
    case 'project':
      return { kind: 'project', slug: item.project.slug };
    case 'award':
      return { kind: 'award', index: item.index };
    case 'pdf':
      return { kind: 'pdf' };
    case 'note':
      return { kind: 'note', note: item.note };
    default:
      return null;
  }
}

/** A shareable address for an item, or null when it has none of its own. */
export function linkFor(item: FinderItem): string | null {
  switch (item.type) {
    case 'project':
      return shareUrl(pathFor('portfolio', { slug: item.project.slug }));
    case 'pdf':
      return shareUrl(pathFor('preview'));
    case 'note':
      return shareUrl(pathFor('notes', { note: item.note }));
    case 'award':
      return shareUrl(pathFor('finder', { location: 'awards' }));
    case 'app':
      return parseRoute(pathFor(item.app)) ? shareUrl(pathFor(item.app)) : null;
    case 'folder':
      return item.place ? placeLink(item.place) : null;
    case 'trash':
      return COMMITS_URL;
  }
}

/** Only places with a route of their own (프로젝트, 수상, 문서) can be shared. */
export function placeLink(place: Place): string | null {
  if (place.startsWith('tag:')) return null;
  const path = pathFor('finder', { location: place as Exclude<Place, `tag:${string}`> });
  const route = parseRoute(path);
  return route?.kind === 'app' && (route.props as { location?: string }).location === place ? shareUrl(path) : null;
}

/**
 * Opens an item in its app, growing out of `origin`. Folders, awards and the
 * trash are the window's own business (navigate, Quick Look, an explanation sheet).
 */
export function openInApp(item: FinderItem, origin?: Rect) {
  const { open } = useWindows.getState();
  switch (item.type) {
    case 'project':
      return open('portfolio', { slug: item.project.slug }, origin);
    case 'pdf':
      return open('preview', {}, origin);
    case 'note':
      return open('notes', { note: item.note }, origin);
    case 'app':
      return open(item.app, {}, origin);
  }
}
