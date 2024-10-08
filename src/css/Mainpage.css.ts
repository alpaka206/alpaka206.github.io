import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "36px",
  width: "calc(100vw - 72px)",
  height: "calc(100vh - 72px)",
  backgroundImage: "url(../../public/assets/BG_pc.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",

  "@media": {
    "screen and (max-width: 980px)": {
      backgroundImage: "url(../../public/assets/BG_phone.png)",
      padding: "34px 24px",
      width: "calc(100vw - 48px)",
      height: "calc(100vh - 68px)",
    },
  },
});

export const folderContainer = style({
  display: "grid",
  width: "250px",
  justifyItems: "center",
  gridTemplateColumns: "repeat(3, 1fr)", // 기본적으로 3개의 폴더씩 나열
  // gap: "20px", // 기존 간격 유지
  "@media": {
    "screen and (max-width: 980px)": {
      // 핸드폰에서는 4개의 폴더씩 나열
      width: " 100%",
      gridTemplateColumns: "repeat(4, 1fr)",
      rowGap: "34px",
      // gap: "34px", // 간격 유지
    },
  },
});
