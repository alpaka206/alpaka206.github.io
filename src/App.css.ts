// styles.css.ts
import { style, globalStyle } from "@vanilla-extract/css";

globalStyle("*, *::before, *::after", {
  margin: 0,
  padding: 0,
});

globalStyle("body::-webkit-scrollbar", {
  display: "none",
});

export const bodyStyle = style({
  width: "100vw",
  height: "100vh",
});
