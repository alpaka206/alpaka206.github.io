import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/lib/device';
import { play } from '@/lib/sound';
import type { SettingsPane } from '@/os/apps';
import { APPEARANCES, useSettings } from '@/os/settings';
import { Glyph, NavScreen, Row, Section, Segmented, Toggle } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import type { PhoneAppProps } from '../registry';
import { AccentPicker, ControlRow, SliderRow, WallpaperPicker } from './phone-controls';
import { RESET_QUESTION, SITE } from './site';
import styles from './settings.phone.module.css';

/** settings.brightness runs 0.3..1: the veil over the screen never goes fully black. */
const MIN_BRIGHTNESS = 0.3;

/** Desktop panes this phone screen has no separate section for land on the closest one. */
const SECTION_FOR: Record<SettingsPane, string> = {
  appearance: 'appearance',
  wallpaper: 'wallpaper',
  'desktop-dock': 'appearance',
  accessibility: 'accessibility',
  sound: 'sound',
  privacy: 'about-site',
  'about-site': 'about-site',
};

const percent = (value: number) => `${Math.round(value * 100)}%`;

/** iOS Settings for this site: every control changes the real setting (src/os/settings). */
export default function View({ props }: PhoneAppProps<'settings'>) {
  const settings = useSettings();
  const systemMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const systemTransparency = useMediaQuery('(prefers-reduced-transparency: reduce)');
  const { open } = usePhoneApp();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.pane) root.current?.querySelector(`#settings-${SECTION_FOR[props.pane]}`)?.scrollIntoView({ block: 'start' });
  }, [props.pane]);

  const brightness = (settings.brightness - MIN_BRIGHTNESS) / (1 - MIN_BRIGHTNESS);
  const resetAll = () => {
    if (window.confirm(RESET_QUESTION)) settings.reset();
  };

  return (
    <NavScreen title="설정">
      <div ref={root}>
        <div id="settings-appearance">
          <Section title="화면 모드" footer="자동은 기기의 라이트, 다크 설정을 따라요.">
            <ControlRow>
              <Segmented options={APPEARANCES} value={settings.appearance} onChange={(value) => settings.set('appearance', value)} label="화면 모드" />
            </ControlRow>
            <SliderRow
              label="밝기"
              value={brightness}
              valueText={percent(settings.brightness)}
              onChange={(value) => settings.set('brightness', MIN_BRIGHTNESS + value * (1 - MIN_BRIGHTNESS))}
              leading={<Glyph name="sun.max" pt={13} className={styles.sliderGlyph} />}
              trailing={<Glyph name="sun.max" pt={20} className={styles.sliderGlyph} />}
            />
          </Section>
          <Section title="강조 색상">
            <ControlRow>
              <AccentPicker />
            </ControlRow>
          </Section>
        </div>

        <div id="settings-wallpaper">
          <Section title="배경화면" footer="유리 물결은 화면 모드에 맞춰 낮과 밤 그림이 바뀌어요.">
            <ControlRow>
              <WallpaperPicker />
            </ControlRow>
          </Section>
        </div>

        <div id="settings-accessibility">
          <Section title="손쉬운 사용" footer="처음에는 기기의 손쉬운 사용 설정을 따르고, 여기서 바꾸면 이 사이트에만 적용돼요.">
            <Row
              title="동작 줄이기"
              subtitle={settings.reduceMotion === null ? '기기 설정을 따르는 중' : undefined}
              control={<Toggle label="동작 줄이기" checked={settings.reduceMotion ?? systemMotion} onChange={(on) => settings.set('reduceMotion', on)} />}
            />
            <Row
              title="투명도 줄이기"
              subtitle={settings.reduceTransparency === null ? '기기 설정을 따르는 중' : undefined}
              control={<Toggle label="투명도 줄이기" checked={settings.reduceTransparency ?? systemTransparency} onChange={(on) => settings.set('reduceTransparency', on)} />}
            />
          </Section>
        </div>

        <div id="settings-sound">
          <Section title="사운드" footer="버튼을 누르거나 알림이 올 때 나는 효과음이에요.">
            <Row
              title="효과음"
              control={
                <Toggle
                  label="효과음"
                  checked={settings.sound}
                  onChange={(on) => {
                    settings.set('sound', on);
                    if (on) play('tick');
                  }}
                />
              }
            />
            <SliderRow
              label="효과음 크기"
              value={settings.volume}
              valueText={percent(settings.volume)}
              onChange={(value) => settings.set('volume', value)}
              onCommit={() => play('tick')}
              leading={<Glyph name="speaker.slash" pt={13} className={styles.sliderGlyph} />}
              trailing={<Glyph name="speaker.wave.2" pt={17} className={styles.sliderGlyph} />}
            />
          </Section>
        </div>

        <div id="settings-about-site">
          <Section title="이 사이트에 관하여">
            <Row title="버전" detail={SITE.version} />
            <Row title="만든 방법" onClick={() => open('notes', { note: 'how-built' })} />
            <Row title="소스 코드" detail="GitHub" href={SITE.source.href} />
            <Row title="텍스트 버전" href="/text" />
          </Section>
          <Section>
            <Row title={<span className={styles.destructive}>설정 초기화</span>} onClick={resetAll} chevron={false} />
          </Section>
        </div>
      </div>
    </NavScreen>
  );
}
