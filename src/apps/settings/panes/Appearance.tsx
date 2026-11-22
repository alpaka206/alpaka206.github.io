import type { CSSProperties } from 'react';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { radioArrowKeys } from '@/lib/arrowKeys';
import { mediaUrl } from '@/media/Picture';
import { ACCENTS, APPEARANCES, useSettings, WALLPAPERS, type Accent, type Appearance as Mode } from '@/os/settings';
import styles from '../Settings.module.css';

const MODES = Object.keys(APPEARANCES) as Mode[];
const ACCENT_IDS = Object.keys(ACCENTS) as Accent[];

/** The thumbnails show the default wallpaper by day and by night, with a window on top. */
const MODE_ART = {
  '--day': `url(${mediaUrl(WALLPAPERS.glass.light, 0)})`,
  '--night': `url(${mediaUrl(WALLPAPERS.glass.dark, 0)})`,
} as CSSProperties;

export function Appearance() {
  const appearance = useSettings((s) => s.appearance);
  const accent = useSettings((s) => s.accent);
  const set = useSettings((s) => s.set);
  const setMode = (mode: Mode) => set('appearance', mode);
  const setAccent = (id: Accent) => set('accent', id);

  return (
    <FormSection>
      <FormRow label="화면 모드">
        <div className={styles.modes} role="radiogroup" aria-label="화면 모드" style={MODE_ART} onKeyDown={radioArrowKeys(MODES, appearance, setMode)}>
          {MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={appearance === mode}
              tabIndex={appearance === mode ? 0 : -1}
              data-value={mode}
              className={styles.mode}
              onClick={() => setMode(mode)}
            >
              <span className={styles.modeArt} data-mode={mode} />
              {APPEARANCES[mode]}
            </button>
          ))}
        </div>
      </FormRow>
      <FormRow label="강조 색상">
        <div className={styles.accentPicker}>
          <div className={styles.accents} role="radiogroup" aria-label="강조 색상" onKeyDown={radioArrowKeys(ACCENT_IDS, accent, setAccent)}>
            {ACCENT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={accent === id}
                aria-label={ACCENTS[id].label}
                title={ACCENTS[id].label}
                tabIndex={accent === id ? 0 : -1}
                data-value={id}
                className={styles.accent}
                style={{ '--light': ACCENTS[id].light, '--dark': ACCENTS[id].dark } as CSSProperties}
                onClick={() => setAccent(id)}
              />
            ))}
          </div>
          <span className={styles.caption}>{ACCENTS[accent].label}</span>
        </div>
      </FormRow>
    </FormSection>
  );
}
