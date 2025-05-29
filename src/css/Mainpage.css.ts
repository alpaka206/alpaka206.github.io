import { style } from "@vanilla-extract/css";

export const container = style({
  width: "100vw",
  height: "100vh",
  background: "linear-gradient(135deg, #1a237e, #3949ab)",
  "@media": {
    "screen and (min-width: 768px)": {
      backgroundImage: "url('/assets/BGimage.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
});

export const folderContainer = style({
  "@media": {
    "(max-width: 768px)": {
      padding: "20px 10px 0", // 갤럭시 홈화면 느낌
      width: "100%",
      gridTemplateColumns: "repeat(4, 1fr)", // 반응형: 4열
      rowGap: "20px",
      columnGap: "12px",
      justifyItems: "center", // 모바일은 가운데 정렬
    },
  },
});
