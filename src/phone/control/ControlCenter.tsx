import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { PROFILE } from '@/content/profile';
import { useRestoreFocus } from '@/lib/focus';
import { play } from '@/lib/sound';
import { springEasing, SPRINGS } from '@/lib/spring';
import { Picture } from '@/media/Picture';
import { copyEmail, nextWallpaper } from '@/os/actions';
import { MIN_BRIGHTNESS, useSettings, WALLPAPERS } from '@/os/settings';
import { motionReduced, useDark, useReduced } from '@/os/theme';
import { rectOf } from '../geometry';
import { useEscape } from '../hooks';
import { Glyph } from '../kit';
import { usePhoneNav } from '../nav';
import { useSwipeAway } from '../useSwipeAway';
import { ActionsModule, RoundButton, SliderModule, WideModule } from './modules';
import styles from './ControlCenter.module.css';

/** Flicked up this far (projected), Control Center closes. */
const DISMISS = 100;

const percent = (value: number) => `${Math.round(value * 100)}%`;

/**
 * Control Center (iOS 18+ grid, iOS 26/27 glass, ios.md §6). Every control
 * changes this site for real. A web page cannot own the top-right edge swipe,
 * so it opens from the Home Screen's button; tap outside, press Escape or
 * flick it up to close.
 */
export function ControlCenter({ onClose }: { onClose: () => void }) {
  const settings = useSettings();
  const dark = useDark();
  const { motion: reduceMotion, transparency: reduceTransparency } = useReduced();
  const [hint, setHint] = useState('');
  const layer = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const hintTimer = useRef(0);
  const { drag, dismiss } = useSwipeAway({
    place: (y) => {
      layer.current?.style.setProperty('--drag', `${y}px`);
      layer.current?.style.setProperty('--shown', String(Math.max(0, 1 + y / 300)));
    },
    away: () => -300,
    threshold: () => DISMISS,
    onAway: onClose,
  });
  const close = useCallback(() => dismiss(), [dismiss]);
  useEscape(close);
  useRestoreFocus();

  useLayoutEffect(() => {
    grid.current?.querySelector('button')?.focus({ preventScroll: true });
    if (motionReduced()) return;
    layer.current?.animate([{ opacity: 0 }, { opacity: 1 }], springEasing(SPRINGS.smooth));
    grid.current?.animate([{ transform: 'translateY(-24px) scale(0.96)' }, { transform: 'none' }], springEasing(SPRINGS.snappy));
  }, []);

  const say = (text: string) => {
    setHint(text);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(''), 1600);
  };

  const wallpaper = WALLPAPERS[settings.wallpaper] ?? WALLPAPERS.glass;
  const volume = settings.sound ? settings.volume : 0;

  return (
    <div ref={layer} className={styles.layer} role="dialog" aria-modal="true" aria-label="제어 센터" onPointerDown={drag}>
      {/* Like UIKit's dimming view, the backdrop is a dismiss button a screen reader can reach (Escape for keyboards). */}
      <button type="button" tabIndex={-1} className={styles.backdrop} aria-label="닫기" onClick={close} />
      <p className={styles.hint} role="status">
        {hint}
      </p>
      <div ref={grid} className={styles.grid}>
        <ActionsModule
          title="바로 하기"
          actions={[
            { label: '이메일 주소 복사', icon: 'doc.on.doc', run: () => void copyEmail('메일') },
            { label: '포트폴리오 PDF', icon: 'arrow.down.circle', run: () => window.open(PROFILE.portfolioPdf, '_blank', 'noopener') },
          ]}
        />
        <SliderModule
          label="밝기"
          icon="sun.max"
          value={(settings.brightness - MIN_BRIGHTNESS) / (1 - MIN_BRIGHTNESS)}
          valueText={percent(settings.brightness)}
          onChange={(value) => settings.set('brightness', MIN_BRIGHTNESS + value * (1 - MIN_BRIGHTNESS))}
        />
        <SliderModule
          label="효과음 크기"
          icon={volume > 0 ? 'speaker.wave.2' : 'speaker.slash'}
          value={volume}
          valueText={volume > 0 ? percent(volume) : '끔'}
          onChange={(value) => {
            settings.set('volume', value);
            settings.set('sound', value > 0);
          }}
          onCommit={() => play('tick')}
        />
        <WideModule
          title="다크 모드"
          detail={dark ? '켬' : '끔'}
          on={dark}
          icon={<Glyph name="circle.lefthalf.filled" pt={17} weight="semibold" />}
          onClick={() => settings.set('appearance', dark ? 'light' : 'dark')}
        />
        <RoundButton
          label="동작 줄이기"
          icon="sparkles"
          on={reduceMotion}
          onClick={() => {
            settings.set('reduceMotion', !reduceMotion);
            say(`동작 줄이기 ${reduceMotion ? '끔' : '켬'}`);
          }}
        />
        <RoundButton
          label="투명도 줄이기"
          icon="square.stack"
          on={reduceTransparency}
          onClick={() => {
            settings.set('reduceTransparency', !reduceTransparency);
            say(`투명도 줄이기 ${reduceTransparency ? '끔' : '켬'}`);
          }}
        />
        <WideModule
          title="배경화면"
          detail={wallpaper.label}
          icon={<Picture src={dark ? wallpaper.portraitDark : wallpaper.portraitLight} alt="" sizes="41px" className={styles.thumb} />}
          onClick={nextWallpaper}
        />
        <RoundButton
          label="효과음"
          icon={settings.sound ? 'speaker.wave.2' : 'speaker.slash'}
          on={settings.sound}
          onClick={() => {
            const on = !settings.sound;
            settings.set('sound', on);
            if (on && settings.volume === 0) settings.set('volume', 0.5);
            say(`효과음 ${on ? '켬' : '끔'}`);
          }}
        />
        <RoundButton
          label="설정 열기"
          icon="gearshape"
          onClick={(from) => {
            onClose();
            usePhoneNav.getState().open('settings', {}, { rect: rectOf(from, 34), key: 'app:settings' });
          }}
        />
      </div>
    </div>
  );
}
