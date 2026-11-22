import { useCallback, useState } from 'react';
import { nextWallpaper } from '@/os/actions';
import { ControlCenter } from '../control/ControlCenter';
import { iconRadius, rectOf, type Rect } from '../geometry';
import { useEscape } from '../hooks';
import { GlassButton } from '../kit';
import { usePhoneNav } from '../nav';
import { Spotlight } from '../search/Spotlight';
import { Wallpaper } from '../Wallpaper';
import { Dock } from './Dock';
import { EditMenu } from './EditMenu';
import { FolderPanel } from './FolderPanel';
import { HomePager } from './HomePager';
import type { AppItem, FolderItem, HomeItem } from './items';
import { useHomeOrder } from './useHomeOrder';
import styles from './HomeScreen.module.css';

interface HomeScreenProps {
  /** An app covers the whole screen: stop drawing the Home Screen. */
  covered: boolean;
  /** Something else has the focus (the Lock Screen, an app). */
  inert: boolean;
}

/** The Home Screen: wallpaper, pages of widgets and icons, Search pill, Dock and the overlays above them. */
export function HomeScreen({ covered, inert }: HomeScreenProps) {
  const { order, items, save, reset } = useHomeOrder();
  const [editing, setEditing] = useState(false);
  const [menu, setMenu] = useState(false);
  const [folder, setFolder] = useState<{ item: FolderItem; from: Rect } | null>(null);
  const [overlay, setOverlay] = useState<'search' | 'control' | null>(null);

  const launch = useCallback((item: AppItem, from: HTMLElement) => {
    usePhoneNav.getState().open(item.app, item.props, { rect: rectOf(from, iconRadius(from)), key: item.id });
  }, []);

  const onOpen = (item: HomeItem, icon: HTMLElement) => {
    if (item.kind === 'folder') setFolder({ item, from: rectOf(icon, iconRadius(icon)) });
    else launch(item, icon);
  };

  // One press closes the Edit menu; the next one leaves jiggle mode.
  const onEscape = useCallback(() => (menu ? setMenu(false) : setEditing(false)), [menu]);
  useEscape(onEscape);

  return (
    <div className={styles.home} data-covered={covered || undefined} inert={inert || covered}>
      {/* Behind an open folder, Search, Control Center or the Edit menu, the Home Screen is inert. */}
      <div className={styles.surface} inert={Boolean(folder || overlay || (editing && menu))}>
        <Wallpaper dimmed />
        <div className={styles.top}>
          {editing ? (
            <>
              <GlassButton label="편집" size={28} aria-haspopup="dialog" aria-expanded={menu} onClick={() => setMenu((open) => !open)}>
                편집
              </GlassButton>
              <GlassButton label="완료" size={28} prominent onClick={() => setEditing(false)}>
                완료
              </GlassButton>
            </>
          ) : (
            <GlassButton
              label="제어 센터"
              size={28}
              icon="switch.2"
              aria-haspopup="dialog"
              className={styles.controlButton}
              onClick={() => setOverlay('control')}
            />
          )}
        </div>
        <HomePager
          items={items}
          order={order}
          onReorder={save}
          editing={editing}
          onEditingChange={setEditing}
          onOpen={onOpen}
          onSearch={() => setOverlay('search')}
        />
        <Dock editing={editing} onOpen={onOpen} onLongPress={() => setEditing(true)} />
      </div>

      {editing && menu && (
        <EditMenu
          onClose={() => setMenu(false)}
          onReset={() => {
            if (window.confirm('홈 화면을 기본 배열로 되돌릴까요? 옮긴 아이콘이 처음 자리로 돌아가요.')) reset();
            setMenu(false);
          }}
          onWallpaper={nextWallpaper}
        />
      )}
      {folder && <FolderPanel folder={folder.item} from={folder.from} onLaunch={launch} onClosed={() => setFolder(null)} />}
      {overlay === 'search' && <Spotlight onClose={() => setOverlay(null)} />}
      {overlay === 'control' && <ControlCenter onClose={() => setOverlay(null)} />}
    </div>
  );
}
