import { useId } from 'react';
import { Slider, Switch } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { useSettings } from '@/os/settings';
import styles from '../Settings.module.css';

/** Dock tile sizes this site offers, in points. */
const DOCK_SIZE = { min: 32, max: 80 };

export function DesktopDock() {
  const dockSize = useSettings((s) => s.dockSize);
  const magnification = useSettings((s) => s.dockMagnification);
  const autohide = useSettings((s) => s.dockAutohide);
  const fullscreenOnLogin = useSettings((s) => s.fullscreenOnLogin);
  const set = useSettings((s) => s.set);
  const sizeId = useId();

  return (
    <>
      <FormSection title="Dock">
        <FormRow label="크기" htmlFor={sizeId}>
          <div className={styles.slider}>
            <Slider
              id={sizeId}
              min={DOCK_SIZE.min}
              max={DOCK_SIZE.max}
              step={1}
              value={dockSize}
              aria-valuetext={`${dockSize}pt`}
              onChange={(event) => set('dockSize', Number(event.currentTarget.value))}
            />
            <span className={styles.ends} aria-hidden="true">
              <span>작게</span>
              <span>크게</span>
            </span>
          </div>
        </FormRow>
        <FormRow label="확대">
          <Switch label="확대" checked={magnification} onChange={(on) => set('dockMagnification', on)} />
        </FormRow>
        <FormRow label="자동으로 Dock 가리기 및 보기">
          <Switch label="자동으로 Dock 가리기 및 보기" checked={autohide} onChange={(on) => set('dockAutohide', on)} />
        </FormRow>
      </FormSection>
      <FormSection title="전체 화면">
        <FormRow
          label="로그인할 때 전체 화면으로 시작"
          description="브라우저를 전체 화면으로 바꿔, 브라우저 막대와 컴퓨터의 메뉴 막대를 가립니다."
        >
          <Switch
            label="로그인할 때 전체 화면으로 시작"
            checked={fullscreenOnLogin}
            onChange={(on) => set('fullscreenOnLogin', on)}
          />
        </FormRow>
      </FormSection>
    </>
  );
}
