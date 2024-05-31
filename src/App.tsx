// import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";

import "./App.css";
// import "./axiosConfig.jsx";

export default function App() {
  return (
    <RecoilRoot>
      <div className="App">
        {/* <OpenExternalBrowser /> */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Mainpage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </RecoilRoot>
  );
}
