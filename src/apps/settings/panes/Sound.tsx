import { useId } from 'react';
import { Slider, Switch } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { play } from '@/lib/sound';
import { useSettings } from '@/os/settings';
import { Symbol } from '@/ui/Symbol';
import styles from '../Settings.module.css';

/** Keys that move a range input; Tab and the like should not make a sound. */
const STEP_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown']);

export function Sound() {
  const sound = useSettings((s) => s.sound);
  const volume = useSettings((s) => s.volume);
  const set = useSettings((s) => s.set);
  const volumeId = useId();

  return (
    <FormSection title="사운드 효과">
      <FormRow label="사용자 인터페이스 사운드 효과 재생">
        <Switch label="사용자 인터페이스 사운드 효과 재생" checked={sound} onChange={(on) => set('sound', on)} />
      </FormRow>
      <FormRow label="음량" htmlFor={volumeId}>
        <div className={styles.volume}>
          <Symbol name="speaker.slash" size={14} />
          <Slider
            id={volumeId}
            min={0}
            max={1}
            step={0.05}
            value={volume}
            disabled={!sound}
            aria-valuetext={`${Math.round(volume * 100)}%`}
            onChange={(event) => set('volume', Number(event.currentTarget.value))}
            // Like macOS, a sample plays when the slider is let go.
            onPointerUp={() => play('pop')}
            onKeyUp={(event) => STEP_KEYS.has(event.key) && play('pop')}
          />
          <Symbol name="speaker.wave.2" size={14} />
        </div>
      </FormRow>
    </FormSection>
  );
}
