// src/components/FolderContainer.css.ts
import { style } from "@vanilla-extract/css";

export const containerStyle = style({
  padding: "10px 0",
  width: "55px",
  textAlign: "center",
  userSelect: "none",
  "@media": {
    "screen and (max-width: 980px)": {
      width: "60%",
    },
  },
});

export const imageContainerStyle = style({
  width: "100%",
  aspectRatio: "1/1",
  // minHeight: "55px", // 최소 높이를 설정하여 이미지 크기를 유지하면서 공간 확보
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const imageStyle = style({
  width: "100%",
  height: "auto",

  "@media": {
    "screen and (max-width: 980px)": {
      borderRadius: "20px",
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
      fontSize: "0.7em",
    },
  },
});
