// import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
import Profile from "./pages/Profile.tsx";
import Prize from "./pages/Prize.tsx";
import GithubPage from "./pages/GithubPage.tsx";
import COMATCHING from "./pages/COMATCHING.tsx";
import ShareIt from "./pages/ShareIt.tsx";
import ALNC from "./pages/ALNC.tsx";
import OpenExternalBrowser from "./OpenExternalBrowser.tsx";
import { bodyStyle } from "./App.css";

export default function App() {
  return (
    <RecoilRoot>
      <div className={bodyStyle}>
        <OpenExternalBrowser />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Prize" element={<Prize />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/COMATCHING" element={<COMATCHING />} />
            <Route path="/ShareIt" element={<ShareIt />} />
            <Route path="/ALNC" element={<ALNC />} />
          </Routes>
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
}
