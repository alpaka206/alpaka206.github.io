// import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
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
          </Routes>
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
}
