import { PROFILE } from '@/content/profile';
import { useMinute } from '@/lib/device';
import { GlassButton, NavScreen, Row, Section } from '@/phone/kit';
import { formatCount, updatedLabel } from './api';
import { ProfileHeader, ProfileSkeleton } from './phone-profile';
import { useGitHub } from './useGitHub';
import styles from './github.phone.module.css';

/** The owner's GitHub profile and most recently updated repositories, live from the public API. */
export default function View() {
  const [state, reload] = useGitHub();
  const now = useMinute().getTime();

  return (
    <NavScreen title="GitHub" trailing={<GlassButton icon="arrow.up.right.square" label="GitHub에서 열기" href={PROFILE.github.href} target="_blank" rel="noreferrer" />}>
      {state.status === 'error' ? (
        <div className={styles.error} role="alert">
          <p className={styles.errorTitle}>GitHub에 연결하지 못했어요</p>
          <p className={styles.errorText}>잠시 뒤에 다시 시도하거나 GitHub에서 바로 확인해 주세요.</p>
          <div className={styles.errorActions}>
            <GlassButton label="다시 시도" size={48} prominent onClick={reload}>
              다시 시도
            </GlassButton>
            <GlassButton label="GitHub에서 열기" size={48} href={PROFILE.github.href} target="_blank" rel="noreferrer">
              GitHub에서 열기
            </GlassButton>
          </div>
        </div>
      ) : (
        <div aria-busy={state.status === 'loading'}>
          {state.status === 'ready' ? <ProfileHeader profile={state.snapshot.profile} /> : <ProfileSkeleton />}
          <Section title="최근 업데이트한 저장소">
            {state.status === 'ready'
              ? state.snapshot.repos.map((repo) => (
                  <Row
                    key={repo.id}
                    title={repo.name}
                    subtitle={
                      <>
                        {repo.description && <span className={styles.line}>{repo.description}</span>}
                        <span className={styles.line}>{updatedLabel(repo.updatedAt, now)}</span>
                      </>
                    }
                    detail={
                      repo.stars ? (
                        <>
                          <span aria-hidden="true">★ {formatCount(repo.stars)}</span>
                          <span className="visually-hidden">별 {formatCount(repo.stars)}개</span>
                        </>
                      ) : (
                        (repo.language ?? undefined)
                      )
                    }
                    href={repo.url}
                  />
                ))
              : Array.from({ length: 5 }, (_, i) => (
                  <Row
                    key={i}
                    title={<span className={`${styles.rowBar} ${styles.skeleton}`} />}
                    subtitle={<span className={`${styles.rowBar} ${styles.skeleton}`} data-size="short" />}
                  />
                ))}
          </Section>
          <Section>
            <Row title={PROFILE.github.label} action href={PROFILE.github.href} />
          </Section>
        </div>
      )}
    </NavScreen>
  );
}
