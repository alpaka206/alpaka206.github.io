import { Glass } from '@/ui/Glass';
import { DOCK_ITEMS, type HomeItem } from './items';
import { Tile } from './Tile';
import styles from './HomeScreen.module.css';

interface DockProps {
  editing: boolean;
  onOpen: (item: HomeItem, icon: HTMLElement) => void;
  onLongPress: () => void;
}

/**
 * The Dock (K27): 368 × 103 at 17 pt from the sides and bottom, 38 pt
 * continuous corners, padding 20 top / 19 sides and bottom, four 64 pt icons
 * spread edge to edge, no labels. Liquid Glass with refraction where the
 * browser can do it.
 */
export function Dock({ editing, onOpen, onLongPress }: DockProps) {
  return (
    <Glass as="nav" aria-label="Dock" refract radius={38} className={styles.dock}>
      {DOCK_ITEMS.map((item, index) => (
        <Tile key={item.id} item={item} labelled={false} editing={editing} offset={index % 2 === 1} onOpen={onOpen} onLongPress={onLongPress} />
      ))}
    </Glass>
  );
}
