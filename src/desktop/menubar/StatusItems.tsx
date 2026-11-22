import { useBattery, useMinute, useOnline } from '@/lib/device';
import { formatMenuClock } from '@/lib/format';
import { Symbol } from '@/ui/Symbol';
import { MenuList, type MenuRow } from '../menus/MenuList';
import { BatteryGlyph } from './BatteryGlyph';
import type { MenuButtonProps, OpenMenu } from './MenuBar';
import { panelToggle, togglePanel, usePanel, type Panel } from './panels';
import styles from './MenuBar.module.css';

interface StatusItemsProps {
  open: OpenMenu | null;
  bind: (key: string) => MenuButtonProps;
  onHide: () => void;
  onDismiss: () => void;
}

/** Status menus only report; nothing in them is an action. */
const informational = () => false;
const ignore = () => undefined;

/** Korean strings as ControlCenter.app ships them (Battery and WiFi loctables). */
const WIFI = 'Wi‑Fi';

/**
 * The right side of the menu bar, left to right as on the owner's Mac:
 * Wi-Fi, battery (only when the browser reports one), Spotlight, Control
 * Center and the clock, which opens Notification Center.
 */
export function StatusItems({ open, bind, onHide, onDismiss }: StatusItemsProps) {
  const battery = useBattery();
  const online = useOnline();
  const clock = formatMenuClock(useMinute());
  const panel = usePanel((s) => s.open);

  const panelButton = (target: Panel) => ({
    ...panelToggle(target),
    'aria-haspopup': 'dialog' as const,
    'aria-expanded': panel === target,
    'data-selected': panel === target || undefined,
    onClick: () => {
      onHide();
      togglePanel(target);
    },
  });

  const percent = battery ? Math.round(battery.level * 100) : 0;
  const batteryMenu: MenuRow[] = battery
    ? [
        { heading: '배터리', detail: `${percent}%` },
        { label: battery.charging ? '전원 공급원: 전원 어댑터' : '전원 공급원: 배터리' },
        ...(battery.charging && battery.level >= 1 ? [{ label: '충전 완료됨' }] : []),
      ]
    : [];
  const wifiMenu: MenuRow[] = [{ heading: WIFI }, { label: online ? '연결됨' : '연결 안 됨' }];
  const menu = open?.key === 'wifi' ? { label: WIFI, entries: wifiMenu } : open?.key === 'battery' && battery ? { label: '배터리', entries: batteryMenu } : null;

  return (
    <div className={styles.status}>
      <button type="button" className={`${styles.item} ${styles.statusItem}`} aria-label={`${WIFI}, ${online ? '연결됨' : '연결 안 됨'}`} {...bind('wifi')}>
        <Symbol name={online ? 'wifi' : 'wifi.slash'} size={20} weight="medium" />
      </button>
      {battery && (
        <button
          type="button"
          className={`${styles.item} ${styles.statusItem}`}
          aria-label={`배터리 ${percent}%${battery.charging ? ', 충전 중' : ''}`}
          {...bind('battery')}
        >
          <BatteryGlyph level={battery.level} charging={battery.charging} />
        </button>
      )}
      <button type="button" className={`${styles.item} ${styles.statusItem}`} aria-label="Spotlight" {...panelButton('spotlight')}>
        <Symbol name="magnifyingglass" size={17} weight="semibold" />
      </button>
      <button type="button" className={`${styles.item} ${styles.statusItem}`} aria-label="제어 센터" {...panelButton('controlCenter')}>
        <Symbol name="switch.2" size={17.5} weight="medium" />
      </button>
      <button type="button" className={`${styles.item} ${styles.clock}`} aria-label={`${clock}, 알림 센터`} {...panelButton('notificationCenter')}>
        <span>{clock}</span>
      </button>

      {open && menu && (
        <MenuList
          key={open.key}
          entries={menu.entries}
          label={menu.label}
          placement={open.placement}
          isEnabled={informational}
          onChoose={ignore}
          onDismiss={onDismiss}
          highlightFirst={open.keyboard}
        />
      )}
    </div>
  );
}
