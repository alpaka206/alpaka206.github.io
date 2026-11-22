import { PROFILE } from '@/content/profile';
import { GlassButton, NavScreen } from '@/phone/kit';
import { WebFrame } from '../safari/phone-frame';

/** The blog, live in an in-app browser (Safari's web view), with a way out to a real tab. */
export default function View() {
  return (
    <NavScreen
      title="블로그"
      large={false}
      fill
      background="plain"
      trailing={<GlassButton icon="arrow.up.right.square" label="새 탭에서 열기" href={PROFILE.blog.href} target="_blank" rel="noreferrer" />}
    >
      <WebFrame src={PROFILE.blog.href} title="김규원 블로그" />
    </NavScreen>
  );
}
