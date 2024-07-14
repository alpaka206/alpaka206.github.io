import React from "react";
import { satellites, satellite } from "../css/RotaionMain.css.ts";

import AxiosLogo from "/assets/AxiosLogo.png";
import CssLogo from "/assets/CssLogo.png";
import JsLogo from "/assets/JsLogo.png";
import NextLogo from "/assets/NextLogo.png";
import ReactLogo from "/assets/ReactLogo.png";
import RecoilLogo from "/assets/RecoilLogo.png";
import TsLogo from "/assets/TsLogo.png";
import VanilaExtractLogo from "/assets/VanillaExtractLogo.png";
import ViteLogo from "/assets/ViteLogo.png";

interface CustomCSSProperties extends React.CSSProperties {
  "--i"?: number;
}
const RotaionMain: React.FC = () => {
  const logos = [
    AxiosLogo,
    CssLogo,
    JsLogo,
    NextLogo,
    ReactLogo,
    RecoilLogo,
    TsLogo,
    VanilaExtractLogo,
    ViteLogo,
  ];
  const styles: CustomCSSProperties[] = [
    { "--i": 0, top: "8vh" },
    { "--i": 20, top: "3vh" },
    { "--i": 40, top: "12vh" },
    { "--i": 60, top: "7vh" },
    { "--i": 80, top: "1vh" },
    { "--i": 100, top: "9vh" },
    { "--i": 120, top: "4vh" },
    { "--i": 140, top: "3vh" },
    { "--i": 160, top: "2vh" },
    { "--i": 180, top: "9vh" },
    { "--i": 200, top: "11vh" },
    { "--i": 220, top: "2vh" },
    { "--i": 240, top: "7vh" },
    { "--i": 260, top: "8vh" },
    { "--i": 280, top: "1vh" },
    { "--i": 300, top: "2vh" },
    { "--i": 320, top: "12vh" },
    { "--i": 340, top: "2vh" },
  ];
  return (
    <div className={satellites}>
      {styles.map((style, index) => (
        <img
          key={index}
          className={satellite}
          style={style}
          src={logos[index % logos.length]}
        />
      ))}
    </div>
  );
};

export default RotaionMain;
