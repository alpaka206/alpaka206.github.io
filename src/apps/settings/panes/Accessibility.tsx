import { useId } from 'react';
import { PopUp } from '@/desktop/kit/controls';
import { FormRow, FormSection } from '@/desktop/kit/Form';
import { useMediaQuery } from '@/lib/device';
import { useSettings } from '@/os/settings';

type Choice = 'system' | 'on' | 'off';

const toChoice = (value: boolean | null): Choice => (value === null ? 'system' : value ? 'on' : 'off');
const fromChoice = (choice: string): boolean | null => (choice === 'system' ? null : choice === 'on');

interface FollowSystemProps {
  label: string;
  description: string;
  /** The media query that reports the operating system's own setting. */
  query: string;
  value: boolean | null;
  onChange: (value: boolean | null) => void;
}

/** 시스템 설정 따름 / 켬 / 끔, with what the system currently says. */
function FollowSystem({ label, description, query, value, onChange }: FollowSystemProps) {
  const id = useId();
  const system = useMediaQuery(query);
  return (
    <FormRow label={label} description={description} htmlFor={id}>
      <PopUp id={id} value={toChoice(value)} onChange={(event) => onChange(fromChoice(event.currentTarget.value))}>
        <option value="system">시스템 설정 따름 ({system ? '켬' : '끔'})</option>
        <option value="on">켬</option>
        <option value="off">끔</option>
      </PopUp>
    </FormRow>
  );
}

export function Accessibility() {
  const reduceMotion = useSettings((s) => s.reduceMotion);
  const reduceTransparency = useSettings((s) => s.reduceTransparency);
  const set = useSettings((s) => s.set);

  return (
    <FormSection title="디스플레이">
      <FollowSystem
        label="동작 줄이기"
        description="애니메이션을 끄고 화면을 바로 바꿉니다."
        query="(prefers-reduced-motion: reduce)"
        value={reduceMotion}
        onChange={(value) => set('reduceMotion', value)}
      />
      <FollowSystem
        label="투명도 줄이기"
        description="유리 효과 대신 불투명한 배경을 씁니다."
        query="(prefers-reduced-transparency: reduce)"
        value={reduceTransparency}
        onChange={(value) => set('reduceTransparency', value)}
      />
    </FormSection>
  );
}
