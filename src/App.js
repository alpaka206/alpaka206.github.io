import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/Mainpage.tsx";
import OpenExternalBrowser from "./OpenExternalBrowser.tsx";
import { bodyStyle } from "./App.css";
export default function App() {
    return (_jsx(RecoilRoot, { children: _jsxs("div", { className: bodyStyle, children: [_jsx(OpenExternalBrowser, {}), _jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(Mainpage, {}) }) }) })] }) }));
}
