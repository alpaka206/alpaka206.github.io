// src/components/FolderContainer.css.ts
import { style } from "@vanilla-extract/css";

export const containerStyle = style({
  padding: "10px 15px",
  width: "55px",

  textAlign: "center",
  userSelect: "none",
});

export const imageContainerStyle = style({
  width: "100%",
  minHeight: "55px", // 최소 높이를 설정하여 이미지 크기를 유지하면서 공간 확보
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const imageStyle = style({
  width: "100%",
  height: "auto",
});

export const titleStyle = style({
  marginTop: "10px",
  fontSize: "13px",
  fontWeight: "600",
  color: "#ffffff",
  WebkitTextStroke: "0.5px black",
});
