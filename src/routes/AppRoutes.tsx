import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy, type ReactNode } from 'react';
import {
  GalaxyPhoneShell,
  type PhoneInitialApp,
} from '@/features/mobile/components/GalaxyPhoneShell';

const MainPage = lazy(() => import('@/pages/MainPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const PrizePage = lazy(() => import('@/pages/PrizePage'));
const GitHubProfilePanel = lazy(() =>
  import('@/features/github/components/GitHubProfilePanel').then((module) => ({
    default: module.GitHubProfilePanel,
  }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/components/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  }))
);
const COMATCHING = lazy(() => import('@/features/projects/comatching/Page'));
const ShareIt = lazy(() => import('@/features/projects/share-it/Page'));
const ALNC = lazy(() => import('@/features/projects/alnc/Page'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function MobileAwareRoute({
  initialApp,
  children,
}: {
  initialApp: PhoneInitialApp;
  children: ReactNode;
}) {
  return (
    <>
      <div className='hidden min-h-screen md:block'>{children}</div>
      <div className='block h-screen md:hidden'>
        <GalaxyPhoneShell initialApp={initialApp} />
      </div>
    </>
  );
}

const AppRoutes = () => (
  <Suspense fallback={<div className='p-4 text-white/80'>Loading...</div>}>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route
        path='/profile'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'about' }}>
            <ProfilePage />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/prize'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'awards' }}>
            <PrizePage />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/github'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'github' }}>
            <GitHubProfilePanel />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'settings' }}>
            <SettingsPage />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/comatching'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'comatching' }}>
            <COMATCHING />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/share-it'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'share-it' }}>
            <ShareIt />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/shareit'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'share-it' }}>
            <ShareIt />
          </MobileAwareRoute>
        }
      />
      <Route
        path='/alnc'
        element={
          <MobileAwareRoute initialApp={{ kind: 'page', pageId: 'alnc' }}>
            <ALNC />
          </MobileAwareRoute>
        }
      />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
