import { Routes, Route } from 'react-router-dom';
import { MainPage } from '@/pages/main';
import { Profile } from '../pages/profile';
import { PrizePage } from '../pages/prize';
import GithubPage from '../pages/GithubPage';
import COMATCHING from '../pages/COMATCHING';
import ShareIt from '../pages/ShareIt';
import ALNC from '../pages/ALNC';

const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<MainPage />} />
    <Route path='/profile' element={<Profile />} />
    <Route path='/prize' element={<PrizePage />} />
    <Route path='/github' element={<GithubPage />} />
    <Route path='/comatching' element={<COMATCHING />} />
    <Route path='/shareit' element={<ShareIt />} />
    <Route path='/alnc' element={<ALNC />} />
  </Routes>
);

export default AppRoutes;
