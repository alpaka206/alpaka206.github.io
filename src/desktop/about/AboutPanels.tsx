import { Fragment, useEffect, useState } from 'react';
import { EDUCATION, PROFILE } from '@/content/profile';
import { Picture } from '@/media/Picture';
import { APPS, type AppId } from '@/os/apps';
import { registerCommand } from '@/os/commands';
import { useSession } from '@/os/session';
import { useWindows } from '@/os/windows';
import { AppIcon } from '@/ui/AppIcon';
import { Button } from '../kit/controls';
import { AboutWindow } from './AboutWindow';
import styles from './About.module.css';

/** What About This Mac lists for the machine, said about the developer. */
const SPECS: [term: string, value: string][] = [
  ['현재', `${PROFILE.current.company} ${PROFILE.current.team}`],
  ['주력', 'React, TypeScript, Next.js'],
  ['이메일', PROFILE.email],
  ['GitHub', PROFILE.github.label.replace('github.com/', '')],
  ['학력', `${EDUCATION.school} ${EDUCATION.majors.map((major) => major.replace(/ 주전공$/, '')).join(', ')}`],
];

const COPYRIGHT = `© 2026 ${PROFILE.name}`;

function DeveloperAbout({ onClose }: { onClose: () => void }) {
  return (
    <AboutWindow label="이 개발자에 관하여" width={300} onClose={onClose}>
      <div className={styles.content}>
        <Picture src={PROFILE.portrait} alt={`${PROFILE.name} 사진`} sizes="128px" className={styles.portrait} />
        <h2 className={styles.name}>{PROFILE.name}</h2>
        <p className={styles.caption}>{PROFILE.role}, 2026</p>
        <dl className={styles.specs}>
          {SPECS.map(([term, value]) => (
            <Fragment key={term}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
        <Button
          size="large"
          className={styles.more}
          onClick={() => {
            onClose();
            useWindows.getState().open('about');
          }}
        >
          자세한 정보…
        </Button>
        <p className={styles.copyright}>{COPYRIGHT}</p>
      </div>
    </AboutWindow>
  );
}

/** The standard About panel AppKit gives every app: icon, name, version. */
function AppAbout({ app, onClose }: { app: AppId; onClose: () => void }) {
  const { name, icon } = APPS[app];
  return (
    <AboutWindow label={`${name}에 관하여`} width={280} stagger={40} onClose={onClose}>
      <div className={`${styles.content} ${styles.appContent}`}>
        <AppIcon icon={icon} size={64} />
        <h2 className={styles.appName}>{name}</h2>
        <p className={styles.version}>버전 2026.11</p>
        <p className={styles.copyright}>{COPYRIGHT}</p>
      </div>
    </AboutWindow>
  );
}

/** "이 개발자에 관하여" from the alpaca menu, and "‹앱›에 관하여" from each app menu. */
export function AboutPanels() {
  const [developer, setDeveloper] = useState(false);
  const [app, setApp] = useState<AppId | null>(null);

  useEffect(() => {
    const disposers = [
      registerCommand('system.about', () => setDeveloper(true)),
      registerCommand('app.about', () => setApp(useWindows.getState().focusedApp())),
      // Logging out, restarting or shutting down closes them along with every window; locking keeps them.
      useSession.subscribe(({ phase }) => {
        if (phase !== 'login' && phase !== 'boot' && phase !== 'off') return;
        setDeveloper(false);
        setApp(null);
      }),
    ];
    return () => disposers.forEach((dispose) => dispose());
  }, []);

  return (
    <>
      {developer && <DeveloperAbout onClose={() => setDeveloper(false)} />}
      {app && <AppAbout key={app} app={app} onClose={() => setApp(null)} />}
    </>
  );
}
