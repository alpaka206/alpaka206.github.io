import { useRef, useState } from 'react';
import { useBattery, useOnline } from '@/lib/device';
import { runCommand } from '@/os/commands';
import type { MenuItem } from '@/os/menus';
import { Symbol } from '@/ui/Symbol';
import { BatteryGlyph } from '../menubar/BatteryGlyph';
import { MenuList, type MenuPlacement } from '../menus/MenuList';
import { useDismiss } from '../menus/useDismiss';
import styles from './LoginWindow.module.css';

/** LoginUIKit's 전원 pull-down; each item runs the real session command. */
const POWER: MenuItem[] = [
  { label: '잠자기', command: 'system.sleep' },
  { label: '재시동', command: 'system.restart' },
  { label: '시스템 종료', command: 'system.shutdown' },
];

const always = () => true;

/**
 * The login window's status bar (macos.md §19): as tall as the menu bar,
 * items 14 pt apart at the top right. Sleep, restart and shut down live in
 * the 전원 pull-down here, not in a row at the bottom; the lock screen has none.
 */
export function LoginStatusBar({ power }: { power: boolean }) {
  const battery = useBattery();
  const online = useOnline();
  const [menu, setMenu] = useState<{ placement: MenuPlacement; keyboard: boolean } | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useDismiss(menu !== null, bar, () => setMenu(null), { escape: false });

  const close = () => {
    setMenu(null);
    button.current?.focus({ preventScroll: true });
  };

  return (
    <div ref={bar} className={styles.status} data-status>
      <Symbol name={online ? 'wifi' : 'wifi.slash'} size={20} weight="medium" title={online ? 'Wi‑Fi 연결됨' : 'Wi‑Fi 연결 안 됨'} />
      {battery && (
        <span role="img" aria-label={`배터리 ${Math.round(battery.level * 100)}%`}>
          <BatteryGlyph level={battery.level} charging={battery.charging} />
        </span>
      )}
      {power && (
        <button
          ref={button}
          type="button"
          className={styles.power}
          aria-label="전원"
          aria-haspopup="menu"
          aria-expanded={menu !== null}
          onClick={(event) => {
            if (menu) return setMenu(null);
            const { left, right, bottom } = event.currentTarget.getBoundingClientRect();
            setMenu({ placement: { x: left, y: bottom + 8.5, flipX: right + 4 }, keyboard: event.detail === 0 });
          }}
        >
          <Symbol name="power" size={17} weight="medium" />
        </button>
      )}
      {menu && (
        <MenuList
          entries={POWER}
          label="전원"
          placement={menu.placement}
          isEnabled={always}
          onChoose={(item) => {
            setMenu(null);
            if (item.command) runCommand(item.command);
          }}
          onDismiss={close}
          highlightFirst={menu.keyboard}
        />
      )}
    </div>
  );
}
