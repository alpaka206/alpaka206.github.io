import { style } from "@vanilla-extract/css";

export const PrizePage = style({
  padding: "20px 30px",
});

export const PrizeContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
});

export const PrizeElement = style({
  width: "300px",
  margin: "10px 0",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export const PrizeImage = style({
  width: "120px",
  objectFit: "cover",
  border: "1px solid #000",
  cursor: "pointer",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  ":hover": {
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // 그림자 효과
    // transform: "scale(1.05)", // 살짝 확대 효과로 시각적 강조
    border: "none",
  },
});

export const PrizeExplain = style({
  marginLeft: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "232px",
  wordBreak: "keep-all",
});

export const ModalOverlay = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

export const ModalContent = style({
  width: "100%",
  height: "auto",
  maxWidth: "450px",
  marginTop: "-80px",
});

export const ModalImage = style({
  width: "100%",
  objectFit: "contain",
});
