import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

const MainPage = lazy(() => import('@/pages/MainPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const PrizePage = lazy(() => import('@/pages/PrizePage'));
const COMATCHING = lazy(() => import('@/features/projects/comatching/Page'));
const ShareIt = lazy(() => import('@/features/projects/shareit/Page'));
const ALNC = lazy(() => import('@/features/projects/alnc/Page'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AppRoutes = () => (
  <Suspense fallback={<div className='p-4 text-white/80'>Loading...</div>}>
    <Routes>
      <Route path='/' element={<MainPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/prize' element={<PrizePage />} />
      <Route path='/comatching' element={<COMATCHING />} />
      <Route path='/shareit' element={<ShareIt />} />
      <Route path='/alnc' element={<ALNC />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
