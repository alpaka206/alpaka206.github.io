import { Routes, Route } from "react-router-dom";
import Mainpage from "../pages/Mainpage";
import Profile from "../pages/Profile";
import Prize from "../pages/Prize";
import GithubPage from "../pages/GithubPage";
import COMATCHING from "../pages/COMATCHING";
import ShareIt from "../pages/ShareIt";
import ALNC from "../pages/ALNC";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Mainpage />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/prize" element={<Prize />} />
    <Route path="/github" element={<GithubPage />} />
    <Route path="/comatching" element={<COMATCHING />} />
    <Route path="/shareit" element={<ShareIt />} />
    <Route path="/alnc" element={<ALNC />} />
  </Routes>
);

export default AppRoutes;
