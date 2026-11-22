import { PROFILE } from '@/content/profile';
import { Button } from '@/desktop/kit/controls';
import { Picture } from '@/media/Picture';
import { useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Glass } from '@/ui/Glass';
import { Symbol } from '@/ui/Symbol';
import { hostOf, type Site } from './sites';
import styles from './Safari.module.css';

function OpenInNewTab({ url }: { url: string }) {
  return (
    <a className={styles.newTab} href={url} target="_blank" rel="noreferrer">
      새 탭에서 열기
      <Symbol name="arrow.up.right.square" size={12} weight="semibold" />
    </a>
  );
}

/**
 * A site that refuses to be framed: its screenshot (or, for GitHub, a card
 * that points to the GitHub app) under a glass notice with the real link.
 */
export function BlockedPage({ site, url }: { site: Site; url: string }) {
  return (
    <div className={styles.blocked}>
      {site.screenshot ? (
        <Picture src={site.screenshot} alt={`${hostOf(url)} 첫 화면을 찍어 둔 이미지`} sizes="1440px" className={styles.screenshot} />
      ) : (
        <div className={styles.card}>
          <AppIcon icon={site.icon} size={64} />
          <strong>{PROFILE.github.label}</strong>
          <p>GitHub 창에서 프로필과 최근 저장소를 볼 수 있어요.</p>
          <Button onClick={() => useWindows.getState().open('github')}>GitHub 창 열기</Button>
        </div>
      )}
      <Glass variant="panel" radius={20} className={styles.notice} role="status">
        <AppIcon icon={site.icon} size={36} />
        <span className={styles.noticeText}>
          <strong>{site.subject} 다른 사이트 안에서 열리지 않도록 설정되어 있어요.</strong>
          {site.screenshot && <span>아래는 첫 화면을 찍어 둔 이미지예요.</span>}
        </span>
        <OpenInNewTab url={url} />
      </Glass>
    </div>
  );
}

/** For sites this window knows nothing about: a quiet way out if the frame stays blank. */
export function FrameHint({ url }: { url: string }) {
  return (
    <Glass variant="panel" radius={18} className={styles.hint}>
      <span>페이지가 보이지 않으면</span>
      <OpenInNewTab url={url} />
    </Glass>
  );
}
