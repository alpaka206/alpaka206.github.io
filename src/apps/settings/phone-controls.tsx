import type { CSSProperties, ReactNode } from 'react';
import { radioArrowKeys } from '@/lib/arrowKeys';
import { Picture } from '@/media/Picture';
import { ACCENTS, useSettings, WALLPAPERS, type Accent, type WallpaperId } from '@/os/settings';
import { useDark } from '@/os/theme';
import styles from './settings.phone.module.css';

/** A list row holding a full-width control (picker, slider) instead of a title. */
export function ControlRow({ children }: { children: ReactNode }) {
  return <li className={styles.controlRow}>{children}</li>;
}

interface SliderRowProps {
  label: string;
  /** 0..1 */
  value: number;
  onChange: (value: number) => void;
  /** The drag or key press that changed it has ended. */
  onCommit?: () => void;
  valueText: string;
  leading?: ReactNode;
  trailing?: ReactNode;
}

/**
 * An iOS slider row (K27 "Sliders"): 6 pt track in systemFill, the filled
 * part in the tint colour, a 37 × 24 white capsule knob. A native range
 * input underneath, so touch, keyboard and screen readers work as usual.
 */
export function SliderRow({ label, value, onChange, onCommit, valueText, leading, trailing }: SliderRowProps) {
  return (
    <ControlRow>
      <span className={styles.sliderRow}>
        {leading}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          aria-label={label}
          aria-valuetext={valueText}
          className={styles.slider}
          style={{ '--fill': `${value * 100}%` } as CSSProperties}
          onChange={(event) => onChange(Number(event.target.value))}
          onPointerUp={onCommit}
          onKeyUp={(event) => /^(Arrow|Home|End|Page)/.test(event.key) && onCommit?.()}
        />
        {trailing}
      </span>
    </ControlRow>
  );
}

const ACCENT_IDS = Object.keys(ACCENTS) as Accent[];

/** The tint colour, as a row of swatches (a radio group); the chosen one gets a ring. */
export function AccentPicker() {
  const accent = useSettings((s) => s.accent);
  const set = useSettings((s) => s.set);
  const dark = useDark();
  const choose = (id: Accent) => set('accent', id);
  return (
    <div role="radiogroup" aria-label="강조 색상" className={styles.swatches} onKeyDown={radioArrowKeys(ACCENT_IDS, accent, choose)}>
      {ACCENT_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={id === accent}
          aria-label={ACCENTS[id].label}
          tabIndex={id === accent ? 0 : -1}
          data-value={id}
          className={styles.swatch}
          style={{ '--swatch': ACCENTS[id][dark ? 'dark' : 'light'] } as CSSProperties}
          onClick={() => choose(id)}
        />
      ))}
    </div>
  );
}

const WALLPAPER_IDS = Object.keys(WALLPAPERS) as WallpaperId[];

/** The wallpapers as portrait thumbnails (a radio group), each in the current appearance. */
export function WallpaperPicker() {
  const wallpaper = useSettings((s) => s.wallpaper);
  const set = useSettings((s) => s.set);
  const dark = useDark();
  const choose = (id: WallpaperId) => set('wallpaper', id);
  return (
    <div role="radiogroup" aria-label="배경화면" className={styles.wallpapers} onKeyDown={radioArrowKeys(WALLPAPER_IDS, wallpaper, choose)}>
      {WALLPAPER_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={id === wallpaper}
          tabIndex={id === wallpaper ? 0 : -1}
          data-value={id}
          className={styles.wallpaper}
          onClick={() => choose(id)}
        >
          <span className={styles.thumb}>
            <Picture src={dark ? WALLPAPERS[id].portraitDark : WALLPAPERS[id].portraitLight} alt="" sizes="80px" className={styles.thumbImage} />
          </span>
          <span className={styles.thumbLabel}>{WALLPAPERS[id].label}</span>
        </button>
      ))}
    </div>
  );
}
