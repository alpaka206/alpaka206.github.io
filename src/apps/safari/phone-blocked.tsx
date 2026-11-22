import { Picture } from '@/media/Picture';
import { GlassButton, Glyph } from '@/phone/kit';
import { usePhoneApp } from '@/phone/nav';
import { SiteIcon } from './phone-sites';
import { hostOf, type Site } from './sites';
import styles from './safari.phone.module.css';

/**
 * A site that refuses to be shown inside another page (X-Frame-Options):
 * its screenshot, why it is not live here, and the way out to a new tab.
 */
export function BlockedPage({ site }: { site: Site }) {
  const { open } = usePhoneApp();
  const github = hostOf(site.href) === 'github.com';
  return (
    <div className={styles.blocked}>
      {site.screenshot ? (
        <figure className={styles.shot}>
          <Picture src={site.screenshot} alt={`${site.title} 첫 화면`} sizes="(max-width: 767px) 100vw, 400px" className={styles.shotImage} />
        </figure>
      ) : (
        <SiteIcon site={site} size={88} />
      )}
      <h2 className={styles.blockedTitle}>{site.title}</h2>
      <p className={styles.blockedText}>이 사이트는 다른 페이지 안에서 열 수 없게 막혀 있어요. 새 탭에서 열어 보세요.</p>
      <div className={styles.blockedActions}>
        <GlassButton href={site.href} target="_blank" rel="noreferrer" label="새 탭에서 열기" size={48} prominent>
          새 탭에서 열기
          <Glyph name="arrow.up.right.square" pt={15} weight="semibold" />
        </GlassButton>
        {github && (
          <GlassButton label="GitHub 앱에서 보기" size={48} onClick={() => open('github')}>
            GitHub 앱에서 보기
          </GlassButton>
        )}
      </div>
    </div>
  );
}
