// src/components/FolderContainer.css.ts
import { style } from "@vanilla-extract/css";

export const containerStyle = style({
  padding: "10px 0",
  width: "55px",
  textAlign: "center",
  userSelect: "none",
  "@media": {
    "screen and (max-width: 980px)": {
      width: "80%",
    },
  },
});

export const imageContainerStyle = style({
  width: "100%",
  aspectRatio: "1/1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const imageStyle = style({
  width: "100%",
  height: "auto",

  "@media": {
    "screen and (max-width: 980px)": {
      borderRadius: "40%",
    },
  },
});

export const titleStyle = style({
  marginTop: "10px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
  textShadow: "1px 1px 2px black, 0 0 2px black",

  "@media": {
    "screen and (max-width: 980px)": {
      fontSize: "calc(8px + 2vw)",
    },
  },
});
