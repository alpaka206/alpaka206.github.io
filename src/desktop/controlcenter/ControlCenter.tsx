import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/lib/device';
import { radioArrowKeys } from '@/lib/arrowKeys';
import { play } from '@/lib/sound';
import { Picture } from '@/media/Picture';
import { runCommand } from '@/os/commands';
import { APPEARANCES, useSettings, WALLPAPERS, type Appearance, type WallpaperId } from '@/os/settings';
import { useWindows } from '@/os/windows';
import { Glass } from '@/ui/Glass';
import { Symbol, type SymbolName } from '@/ui/Symbol';
import { closePanel, toggleSelector, usePanel } from '../menubar/panels';
import { useDarkAppearance } from '../menubar/wallpaper';
import { useDismiss } from '../menus/useDismiss';
import { ActionTile, Choice, Module, Slider, ToggleRow } from './modules';
import styles from './ControlCenter.module.css';

const APPEARANCE_IDS = Object.keys(APPEARANCES) as Appearance[];
const APPEARANCE_ICONS: Record<Appearance, SymbolName> = { auto: 'circle.lefthalf.filled', light: 'sun.max', dark: 'moon' };

const WALLPAPER_IDS = Object.keys(WALLPAPERS) as WallpaperId[];

/** The panel's controls change the real settings: nothing here is decoration. */
function ControlCenterPanel() {
  const layer = useRef<HTMLDivElement>(null);
  useDismiss(true, layer, closePanel, { ignore: toggleSelector('controlCenter') });
  useEffect(() => layer.current?.focus({ preventScroll: true }), []);

  const { appearance, wallpaper, brightness, volume, sound, reduceMotion, reduceTransparency, dockAutohide, set } = useSettings();
  const systemMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const systemTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  const dark = useDarkAppearance();
  // "null" follows the system, so the switches show what is actually in effect.
  const motionReduced = reduceMotion ?? systemMotion;
  const transparencyReduced = reduceTransparency ?? systemTransparency;
  const muted = !sound || volume === 0;
  const chooseAppearance = (value: Appearance) => set('appearance', value);
  const chooseWallpaper = (id: WallpaperId) => set('wallpaper', id);

  return (
    <div ref={layer} role="dialog" aria-label="제어 센터" tabIndex={-1} className={styles.layer}>
      <Glass variant="panel" radius={37} className={styles.panel}>
        <Module cols={2} rows={2} label="화면 모드">
          <p className={styles.title}>화면 모드</p>
          <p className={styles.subtitle}>{APPEARANCES[appearance]}</p>
          <div role="radiogroup" aria-label="화면 모드" className={styles.choices} onKeyDown={radioArrowKeys(APPEARANCE_IDS, appearance, chooseAppearance)}>
            {APPEARANCE_IDS.map((value) => (
              <Choice
                key={value}
                value={value}
                icon={APPEARANCE_ICONS[value]}
                label={APPEARANCES[value]}
                selected={appearance === value}
                onSelect={() => chooseAppearance(value)}
              />
            ))}
          </div>
        </Module>

        <Module cols={2} rows={2} className={styles.toggles}>
          <ToggleRow icon="accessibility" label="동작 줄이기" on={motionReduced} onChange={(on) => set('reduceMotion', on)} />
          <ToggleRow icon="rectangle.on.rectangle" label="투명도 줄이기" on={transparencyReduced} onChange={(on) => set('reduceTransparency', on)} />
          <ToggleRow icon="dock.rectangle" label="Dock 자동 가리기" on={dockAutohide} onChange={(on) => set('dockAutohide', on)} />
        </Module>

        <Module cols={4} rows={1} className={styles.sliderModule}>
          <p className={styles.title}>디스플레이</p>
          <Slider
            label="디스플레이 밝기"
            value={brightness}
            min={0.3}
            max={1}
            onChange={(value) => set('brightness', value)}
            icon={<Symbol name="sun.max" size={16} weight="medium" />}
          />
        </Module>

        <Module cols={4} rows={1} className={styles.sliderModule}>
          <p className={styles.title}>사운드</p>
          <Slider
            label="사운드 음량"
            value={sound ? volume : 0}
            min={0}
            max={1}
            onChange={(value) => {
              set('volume', value);
              if (value > 0 && !sound) set('sound', true);
            }}
            onCommit={() => play('pop')}
            icon={
              <button type="button" aria-label="음소거" aria-pressed={!sound} className={styles.mute} onClick={() => set('sound', !sound)}>
                <Symbol name={muted ? 'speaker.slash' : 'speaker.wave.2'} size={16} weight="medium" />
              </button>
            }
          />
        </Module>

        <Module cols={4} rows={2} label="배경화면">
          <p className={styles.title}>배경화면</p>
          <div role="radiogroup" aria-label="배경화면" className={styles.wallpapers} onKeyDown={radioArrowKeys(WALLPAPER_IDS, wallpaper, chooseWallpaper)}>
            {WALLPAPER_IDS.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={wallpaper === id}
                tabIndex={wallpaper === id ? 0 : -1}
                data-value={id}
                className={styles.wallpaper}
                onClick={() => chooseWallpaper(id)}
              >
                <Picture src={WALLPAPERS[id][dark ? 'dark' : 'light']} alt="" sizes="64px" className={styles.thumb} />
                <span className={styles.wallpaperName}>{WALLPAPERS[id].label}</span>
              </button>
            ))}
          </div>
        </Module>

        <Module cols={2} rows={1}>
          <ActionTile
            icon="doc.on.doc"
            label="이메일 주소 복사"
            onClick={() => {
              closePanel();
              runCommand('system.copyEmail');
            }}
          />
        </Module>
        <Module cols={2} rows={1}>
          <ActionTile
            icon="doc.text"
            label="포트폴리오 PDF 열기"
            onClick={() => {
              closePanel();
              useWindows.getState().open('preview');
            }}
          />
        </Module>
      </Glass>
    </div>
  );
}

/** Control Center, dropped from its menu bar item. */
export function ControlCenter() {
  const open = usePanel((s) => s.open === 'controlCenter');
  return open ? <ControlCenterPanel /> : null;
}
