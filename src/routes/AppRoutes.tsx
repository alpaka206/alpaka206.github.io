import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

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

const AppRoutes = () => (
  <Suspense fallback={<div className='p-4 text-white/80'>Loading...</div>}>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/prize' element={<PrizePage />} />
      <Route path='/github' element={<GitHubProfilePanel />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/comatching' element={<COMATCHING />} />
      <Route path='/share-it' element={<ShareIt />} />
      <Route path='/shareit' element={<ShareIt />} />
      <Route path='/alnc' element={<ALNC />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
