import { Component, lazy, Suspense, type ReactNode } from 'react';
import { useMediaQuery } from './lib/device';
import { parseRoute } from './os/routes';
import { useApplyTheme } from './os/theme';

// Each shell is its own chunk: a phone never downloads the desktop and vice versa.
const DesktopShell = lazy(() => import('./desktop/DesktopShell'));
const PhoneShell = lazy(() => import('./phone/PhoneShell'));
const ReaderPage = lazy(() => import('./reader/ReaderPage'));

const initialRoute = parseRoute(window.location.pathname);

/**
 * A shell chunk that fails to load (offline, or a deploy replaced it) falls
 * back to the prerendered text version already in the page, not a blank screen.
 */
class ShellBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    document.documentElement.classList.remove('js');
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function App() {
  useApplyTheme();
  const phone = useMediaQuery('(max-width: 767px)');

  return (
    <ShellBoundary>
      <Suspense fallback={null}>
        {initialRoute?.kind === 'reader' ? (
          <ReaderPage />
        ) : phone ? (
          <PhoneShell route={initialRoute} />
        ) : (
          <DesktopShell route={initialRoute} />
        )}
      </Suspense>
    </ShellBoundary>
  );
}
