import { Sidebar, SidebarItem, SidebarSection } from '@/desktop/kit/Sidebar';
import type { FinderLocation } from '@/os/apps';
import type { SymbolName } from '@/ui/Symbol';
import { PLACE_TITLES, TAGS, type Place } from './items';

/**
 * Favourites use Finder's own symbols (clock for 최근 항목, the menu bar and
 * Dock for 데스크탑). 수상 is pinned next to 프로젝트, as anyone would pin a
 * folder they open often.
 */
const FAVORITES: { place: FinderLocation; icon: SymbolName }[] = [
  { place: 'recents', icon: 'clock' },
  { place: 'projects', icon: 'folder' },
  { place: 'awards', icon: 'medal' },
  { place: 'documents', icon: 'doc' },
  { place: 'desktop', icon: 'menubar.dock.rectangle' },
  { place: 'applications', icon: 'square.grid.3x3.app' },
];

export function FinderSidebar({ place, onNavigate }: { place: Place; onNavigate: (place: Place) => void }) {
  return (
    <Sidebar label="Finder 사이드바">
      <SidebarSection title="즐겨찾기">
        {FAVORITES.map(({ place: target, icon }) => (
          <SidebarItem
            key={target}
            label={PLACE_TITLES[target]}
            icon={icon}
            selected={place === target}
            onSelect={() => onNavigate(target)}
          />
        ))}
      </SidebarSection>
      <SidebarSection title="위치">
        <SidebarItem label={PLACE_TITLES.trash} icon="trash" selected={place === 'trash'} onSelect={() => onNavigate('trash')} />
      </SidebarSection>
      <SidebarSection title="태그">
        {TAGS.map((tag) => (
          <SidebarItem
            key={tag.id}
            label={tag.label}
            dot={tag.color}
            selected={place === `tag:${tag.id}`}
            onSelect={() => onNavigate(`tag:${tag.id}`)}
          />
        ))}
      </SidebarSection>
    </Sidebar>
  );
}
