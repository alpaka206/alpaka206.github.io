// styles.css.ts
import { style, globalStyle } from "@vanilla-extract/css";
globalStyle("*, *::before, *::after", {
    margin: 0,
    padding: 0,
});
export const bodyStyle = style({
    // overflow: "hidden",
    width: "100vw",
    height: "100vh",
    backgroundImage: "url(../public/assets/BG_pc.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    "@media": {
        "screen and (max-width: 768px)": {
            backgroundImage: "url(../public/assets/BG_phone.png)",
        },
    },
});
