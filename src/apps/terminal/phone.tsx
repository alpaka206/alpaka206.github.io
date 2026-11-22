import { PROFILE } from '@/content/profile';
import { GlassButton, Glyph, NavScreen } from '@/phone/kit';
import { useNotifications } from '@/os/notifications';
import styles from './terminal.phone.module.css';

async function copySite() {
  const { post } = useNotifications.getState();
  try {
    await navigator.clipboard.writeText(PROFILE.site);
    post({ app: '터미널', icon: 'icons/terminal', title: '주소를 복사했어요', body: PROFILE.site });
  } catch {
    post({ app: '터미널', icon: 'icons/terminal', title: '복사하지 못했어요', body: PROFILE.site });
  }
}

/** A phone has no terminal: say where the real one is. */
export default function View() {
  return (
    <NavScreen title="터미널" large={false} fill background="plain">
      <div className={styles.note}>
        <span className={styles.mark}>
          <Glyph name="apple.terminal" pt={40} />
        </span>
        <h2 className={styles.title}>터미널은 데스크톱에서 열려요</h2>
        <p className={styles.text}>컴퓨터에서 alpaka206.github.io를 열면 macOS 같은 데스크톱이 나오고, 거기서 실제로 명령어를 입력할 수 있는 터미널을 쓸 수 있어요.</p>
        <GlassButton label="주소 복사" size={48} prominent onClick={() => void copySite()}>
          <Glyph name="doc.on.doc" pt={15} weight="semibold" />
          주소 복사
        </GlassButton>
      </div>
    </NavScreen>
  );
}
