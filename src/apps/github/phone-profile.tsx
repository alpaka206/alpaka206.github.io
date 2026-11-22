import { formatCount, type Profile } from './api';
import styles from './github.phone.module.css';

/** Avatar, name, @login, bio and the three counts, the way GitHub's profile opens. */
export function ProfileHeader({ profile }: { profile: Profile }) {
  const stats = [
    { label: '팔로워', value: profile.followers },
    { label: '팔로잉', value: profile.following },
    { label: '저장소', value: profile.publicRepos },
  ];
  return (
    <header className={styles.profile}>
      {/* 72 pt avatar: ask GitHub for the 3× size. */}
      <img className={styles.avatar} src={`${profile.avatarUrl}&s=216`} alt="" width={72} height={72} />
      <h2 className={styles.name}>{profile.name ?? profile.login}</h2>
      <p className={styles.login}>@{profile.login}</p>
      {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
      <dl className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <dt>{stat.label}</dt>
            <dd>{formatCount(stat.value)}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

/** Placeholder shapes while the profile loads. */
export function ProfileSkeleton() {
  return (
    <div className={styles.profile} aria-hidden="true">
      <span className={`${styles.avatar} ${styles.skeleton}`} />
      <span className={`${styles.bar} ${styles.skeleton}`} data-size="name" />
      <span className={`${styles.bar} ${styles.skeleton}`} data-size="login" />
      <span className={`${styles.bar} ${styles.skeleton}`} data-size="bio" />
    </div>
  );
}
