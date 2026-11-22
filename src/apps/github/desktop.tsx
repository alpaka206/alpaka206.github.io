import { useId } from 'react';
import { PROFILE } from '@/content/profile';
import { Button } from '@/desktop/kit/controls';
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarLink } from '@/desktop/kit/Toolbar';
import { useWindowTitle } from '@/desktop/kit/window';
import { useMinute } from '@/lib/device';
import { formatTime } from '@/lib/format';
import { AppIcon } from '@/ui/AppIcon';
import { Symbol } from '@/ui/Symbol';
import { formatCount, GitHubError, languageColor, updatedLabel, type Snapshot } from './api';
import { useGitHub } from './useGitHub';
import styles from './GitHub.module.css';

function errorMessage(error: unknown) {
  if (error instanceof GitHubError && error.message === 'rate-limit') {
    const when = error.resetAt ? `${formatTime(error.resetAt)}부터` : '잠시 후';
    return `GitHub API의 시간당 요청 한도를 넘었어요. ${when} 다시 불러올 수 있어요.`;
  }
  if (error instanceof GitHubError) return 'GitHub가 응답하지 않았어요. 잠시 후 다시 시도해 주세요.';
  return '네트워크 연결을 확인한 뒤 다시 시도해 주세요.';
}

function Profile({ snapshot }: { snapshot: Snapshot }) {
  const { profile } = snapshot;
  return (
    <aside className={styles.profile}>
      <img className={styles.avatar} src={profile.avatarUrl} alt={`${profile.login} 프로필 사진`} width={200} height={200} />
      <h2 className={styles.name}>{profile.name ?? profile.login}</h2>
      <p className={styles.login}>{profile.login}</p>
      {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
      <p className={styles.follow}>
        <Symbol name="person.2" size={15} />
        <span>
          팔로워 <strong>{formatCount(profile.followers)}</strong>, 팔로잉 <strong>{formatCount(profile.following)}</strong>
        </span>
      </p>
      <a className={styles.visit} href={profile.url} target="_blank" rel="noreferrer">
        GitHub에서 보기
      </a>
    </aside>
  );
}

function Repos({ snapshot, now }: { snapshot: Snapshot; now: number }) {
  const headingId = useId();
  return (
    <section className={styles.reposSection} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.heading}>
        최근 업데이트한 저장소
        <span className={styles.counter}>공개 저장소 {formatCount(snapshot.profile.publicRepos)}개</span>
      </h2>
      <ul className={styles.repos}>
        {snapshot.repos.map((repo) => (
          <li key={repo.id} className={styles.repo}>
            <a className={styles.repoName} href={repo.url} target="_blank" rel="noreferrer">
              {repo.name}
            </a>
            {repo.fork && <span className={styles.badge}>Fork</span>}
            <p className={styles.description}>{repo.description ?? '설명이 없는 저장소예요.'}</p>
            <p className={styles.meta}>
              {repo.language && (
                <span className={styles.language}>
                  <i style={{ background: languageColor(repo.language) }} />
                  {repo.language}
                </span>
              )}
              {repo.stars > 0 && (
                <span className={styles.language}>
                  <Symbol name="star" size={13} />
                  <span aria-hidden="true">{formatCount(repo.stars)}</span>
                  <span className="visually-hidden">별 {formatCount(repo.stars)}개</span>
                </span>
              )}
              <span>{updatedLabel(repo.updatedAt, now)}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Skeleton() {
  return (
    <div className={styles.layout} role="status">
      <span className="visually-hidden">불러오는 중…</span>
      <div className={styles.profile}>
        <span className={`${styles.bone} ${styles.boneAvatar}`} />
        <span className={`${styles.bone} ${styles.boneTitle}`} />
        <span className={`${styles.bone} ${styles.boneLine}`} />
      </div>
      <div className={styles.reposSection}>
        <span className={`${styles.bone} ${styles.boneTitle}`} />
        <ul className={styles.repos}>
          {Array.from({ length: 6 }, (_, i) => (
            <li key={i} className={styles.repo}>
              <span className={`${styles.bone} ${styles.boneTitle}`} />
              <span className={`${styles.bone} ${styles.boneLine}`} />
              <span className={`${styles.bone} ${styles.boneShort}`} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** GitHub as a web app: the live public profile and recently updated repositories. */
export default function GitHubWindow() {
  const [state, reload] = useGitHub();
  const now = useMinute().getTime();

  useWindowTitle('GitHub');

  return (
    <div className={styles.app}>
      <Toolbar inset title="GitHub" subtitle={PROFILE.github.label}>
        <ToolbarGroup label="페이지">
          <ToolbarButton icon="arrow.clockwise" label="다시 불러오기" onClick={reload} />
          <ToolbarLink icon="arrow.up.right.square" label="새 탭에서 열기" href={PROFILE.github.href} />
        </ToolbarGroup>
      </Toolbar>
      <div className={styles.scroll}>
        {state.status === 'loading' && <Skeleton />}
        {state.status === 'error' && (
          <div className={styles.error} role="alert">
            <AppIcon icon="icons/github" size={56} />
            <h2>GitHub 정보를 불러오지 못했어요</h2>
            <p>{errorMessage(state.error)}</p>
            <div className={styles.actions}>
              <Button onClick={reload}>다시 시도</Button>
              <a className={styles.linkOut} href={PROFILE.github.href} target="_blank" rel="noreferrer">
                GitHub에서 열기
              </a>
            </div>
          </div>
        )}
        {state.status === 'ready' && (
          <div className={styles.layout}>
            <Profile snapshot={state.snapshot} />
            <Repos snapshot={state.snapshot} now={now} />
          </div>
        )}
      </div>
    </div>
  );
}
