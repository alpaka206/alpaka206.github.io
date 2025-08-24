import { Routes, Route } from 'react-router-dom';
import MainPage from '@/pages/MainPage';
import Profile from '@/pages/Profile';
import PrizePage from '@/pages/PrizePage';
import COMATCHING from '@/pages/COMATCHING';
import ShareIt from '@/pages/ShareIt';
import ALNC from '@/pages/ALNC';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<MainPage />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/prize' element={<PrizePage />} />
    <Route path='/comatching' element={<COMATCHING />} />
    <Route path='/shareit' element={<ShareIt />} />
    <Route path='/alnc' element={<ALNC />} />
  </Routes>
);

export default AppRoutes;
