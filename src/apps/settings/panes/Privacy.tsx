import { useState } from 'react';
import { Button } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { useSettings } from '@/os/settings';
import { PaneIcon } from '../PaneList';
import { RESET_QUESTION } from '../site';
import styles from '../Settings.module.css';

export function Privacy() {
  const reset = useSettings((s) => s.reset);
  const [done, setDone] = useState(false);

  return (
    <>
      <div className={styles.statement}>
        <PaneIcon icon="hand.raised" tint="var(--blue)" size="large" />
        <p>이 사이트는 쿠키나 추적 도구를 쓰지 않아요. 설정은 이 브라우저에만 저장돼요.</p>
      </div>
      <FormSection>
        <FormRow label="설정 초기화" description="화면 모드, 배경화면, Dock, 손쉬운 사용과 사운드 설정을 처음 상태로 되돌립니다.">
          <span className={styles.status} role="status">
            {done && '처음 상태로 되돌렸어요.'}
          </span>
          <Button
            onClick={() => {
              if (!window.confirm(RESET_QUESTION)) return;
              reset();
              setDone(true);
            }}
          >
            설정 초기화
          </Button>
        </FormRow>
      </FormSection>
    </>
  );
}
