import React, { useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { HashRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
import Profile from "./pages/Profile.tsx";
import Prize from "./pages/Prize.tsx";
import GithubPage from "./pages/GithubPage.tsx";
import COMATCHING from "./pages/COMATCHING.tsx";
import ShareIt from "./pages/ShareIt.tsx";
import ALNC from "./pages/ALNC.tsx";
import OpenExternalBrowser from "./OpenExternalBrowser.tsx";
import { GlobalStyle } from "./App.css";
import { isMobileState } from "./Atoms";

const MobileDetector: React.FC = () => {
  const setIsMobile = useSetRecoilState(isMobileState); // Recoil 상태로 변경

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile(); // 컴포넌트가 처음 로드될 때 확인
    window.addEventListener("resize", checkIfMobile); // 화면 크기가 변경될 때마다 확인

    return () => {
      window.removeEventListener("resize", checkIfMobile); // 이벤트 리스너 해제
    };
  }, [setIsMobile]);

  return null; // UI에 렌더링되지 않음
};

export default function App() {
  return (
    <RecoilRoot>
      <MobileDetector />
      <GlobalStyle />
      <OpenExternalBrowser />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Prize" element={<Prize />} />
          <Route path="/github" element={<GithubPage />} />
          <Route path="/COMATCHING" element={<COMATCHING />} />
          <Route path="/ShareIt" element={<ShareIt />} />
          <Route path="/ALNC" element={<ALNC />} />
        </Routes>
      </HashRouter>
    </RecoilRoot>
  );
}
