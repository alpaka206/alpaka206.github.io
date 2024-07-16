// import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
import NavPage from "./pages/NavPage.tsx";
import Keyboard from "./pages/Keyboard.tsx";
import OpenExternalBrowser from "./OpenExternalBrowser.tsx";

// import "./App.css";

export default function App() {
  return (
    <RecoilRoot>
      <OpenExternalBrowser />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="/NavPage" element={<NavPage />} />
          <Route path="/Keyboard" element={<Keyboard />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}
