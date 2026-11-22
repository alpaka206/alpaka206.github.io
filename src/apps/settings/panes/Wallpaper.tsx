import type { CSSProperties } from 'react';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { radioArrowKeys } from '@/lib/arrowKeys';
import { mediaUrl } from '@/media/Picture';
import { useSettings, WALLPAPERS, type WallpaperId } from '@/os/settings';
import styles from '../Settings.module.css';

const IDS = Object.keys(WALLPAPERS) as WallpaperId[];

/** Thumbnails use the smallest file there is (the desktop has usually loaded it already). */
const url = (key: string) => `url(${mediaUrl(key, 0)})`;

export function Wallpaper() {
  const wallpaper = useSettings((s) => s.wallpaper);
  const set = useSettings((s) => s.set);
  const choose = (id: WallpaperId) => set('wallpaper', id);
  const current = WALLPAPERS[wallpaper];
  const dynamic = current.light !== current.dark;

  return (
    <>
      <FormSection>
        <FormRow
          label={current.label}
          description={dynamic ? '라이트와 다크 모드에 맞춰 바뀝니다.' : '라이트와 다크 모드에서 같은 이미지를 씁니다.'}
        >
          <figure className={styles.preview}>
            <span className={styles.thumb} style={{ '--art': url(current.light) } as CSSProperties} />
            <figcaption>라이트</figcaption>
          </figure>
          <figure className={styles.preview}>
            <span className={styles.thumb} style={{ '--art': url(current.dark) } as CSSProperties} />
            <figcaption>다크</figcaption>
          </figure>
        </FormRow>
      </FormSection>
      <FormSection title="배경화면">
        <div className={styles.gallery} role="radiogroup" aria-label="배경화면" onKeyDown={radioArrowKeys(IDS, wallpaper, choose)}>
          {IDS.map((id) => {
            const { label, light, dark } = WALLPAPERS[id];
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={wallpaper === id}
                tabIndex={wallpaper === id ? 0 : -1}
                data-value={id}
                className={styles.choice}
                onClick={() => choose(id)}
              >
                <span
                  className={styles.thumb}
                  data-dynamic={light !== dark || undefined}
                  style={{ '--art': url(light), '--art-night': url(dark) } as CSSProperties}
                />
                {label}
              </button>
            );
          })}
        </div>
      </FormSection>
    </>
  );
}
