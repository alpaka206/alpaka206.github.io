import { style } from "@vanilla-extract/css";

export const containerStyle = style({
  padding: "5px",
  width: "86px",
  height: "70px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "4px",
  "@media": {
    "screen and (max-width: 980px)": {
      width: "80%",
    },
  },
});

export const imageContainerStyle = style({
  width: "40px",

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
  fontSize: "12px",
  fontFamily: "Segoe UI Variable",
  fontWeight: "400",
  color: "#ffffff",
  // textShadow: "1px 1px 2px black, 0 0 2px black",

  "@media": {
    "screen and (max-width: 980px)": {
      fontSize: "calc(8px + 2vw)",
    },
  },
});
