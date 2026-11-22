import { useSession } from '@/os/session';
import { BlackScreen } from './BlackScreen';
import { Boot } from './Boot';
import { LoginWindow } from './LoginWindow';

const powerOn = () => useSession.getState().go('boot');
const wake = () => useSession.getState().go('locked');

/** Whatever covers the desktop while nobody is signed in: off, start-up, login, lock, sleep. */
export function SessionLayer() {
  const phase = useSession((s) => s.phase);
  switch (phase) {
    case 'off':
      return <BlackScreen label="전원 켜기" onWake={powerOn} />;
    case 'sleep':
      return <BlackScreen label="깨우기" onWake={wake} sleep />;
    case 'boot':
      return <Boot />;
    case 'login':
      return <LoginWindow key="login" mode="login" />;
    case 'locked':
      return <LoginWindow key="lock" mode="lock" />;
    case 'desktop':
      return null;
  }
}
