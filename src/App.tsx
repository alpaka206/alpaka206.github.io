import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { HashRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
import PhonePage from "./pages/PhonePage.tsx";
import Profile from "./pages/Profile.tsx";
import Prize from "./pages/Prize.tsx";
import GithubPage from "./pages/GithubPage.tsx";
import COMATCHING from "./pages/COMATCHING.tsx";
import ShareIt from "./pages/ShareIt.tsx";
import ALNC from "./pages/ALNC.tsx";
import OpenExternalBrowser from "./OpenExternalBrowser.tsx";
import { bodyStyle } from "./App.css";

export default function App() {
  // const [isMobile, setIsMobile] = useState(false);

  // useEffect(() => {
  //   const userAgent = window.navigator.userAgent.toLowerCase();
  //   // 간단한 모바일 감지
  //   if (/iphone|ipod|ipad|android|mobile/i.test(userAgent)) {
  //     setIsMobile(true);
  //   }
  // }, []);
  return (
    <RecoilRoot>
      <div className={bodyStyle}>
        <OpenExternalBrowser />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Mainpage />} />
            {/* <Route path="/" element={isMobile ? <PhonePage /> : <Mainpage />} /> */}
            <Route path="/Profile" element={<Profile />} />
            <Route path="/Prize" element={<Prize />} />
            <Route path="/github" element={<GithubPage />} />
            <Route path="/COMATCHING" element={<COMATCHING />} />
            <Route path="/ShareIt" element={<ShareIt />} />
            <Route path="/ALNC" element={<ALNC />} />
          </Routes>
        </HashRouter>
      </div>
    </RecoilRoot>
  );
}
