import { useEffect, useState } from 'react';
import { PROFILE } from '@/content/profile';
import { copyEmail } from '@/os/actions';
import { NavScreen, Row, Section } from '@/phone/kit';
import type { PhoneAppProps } from '../registry';
import { prefillSubject } from './draft';
import { Compose } from './phone-compose';

/**
 * Mail on the phone opens straight into a new message to 김규원. Sending
 * hands the draft to the device's mail app (mailto:); the address can also
 * be copied.
 */
export default function View({ props }: PhoneAppProps<'mail'>) {
  const [composing, setComposing] = useState(true);
  useEffect(() => prefillSubject(props.subject), [props.subject]);
  return (
    <>
      <NavScreen title="메일">
        <Section footer="보내기를 누르면 이 기기의 메일 앱에서 보낼 수 있어요.">
          <Row title={PROFILE.email} subtitle="받는 사람" />
          <Row title="새로운 메시지" action chevron={false} onClick={() => setComposing(true)} />
          <Row title="이메일 주소 복사" action chevron={false} onClick={() => void copyEmail('메일')} />
          <Row title="기본 메일 앱으로 열기" href={`mailto:${PROFILE.email}`} />
        </Section>
      </NavScreen>
      {composing && <Compose onClose={() => setComposing(false)} />}
    </>
  );
}
