import { style, keyframes } from "@vanilla-extract/css";

// Keyframe animation for the spotlight effect
const spotlight = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateY(-100%) scale(1)",
  },
  "50%": {
    opacity: 1,
    transform: "translateY(0) scale(1.2)",
  },
  "100%": {
    opacity: 0,
    transform: "translateY(-100%) scale(1)",
  },
});

export const container = style({
  color: "#fff",
  backgroundColor: "#1e1e1e",
  padding: "20px 40px",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  fontFamily: "'Helvetica Neue', Arial, sans-serif",
  "@media": {
    "(max-width: 768px)": {
      padding: "20px 20px",
    },
  },
});

export const header = style({
  fontSize: "48px",
  fontWeight: "bold",
  color: "#fff",
  marginBottom: "10px",
  textAlign: "center",
  textTransform: "uppercase",
  letterSpacing: "2px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "36px",
    },
  },
});

export const subHeader = style({
  fontSize: "24px",
  color: "#fff",
  marginBottom: "20px",
  textAlign: "center",
});

export const gallery = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "nowrap",
  gap: "20px",
  marginBottom: "40px",
  position: "relative",
  perspective: "1000px", // 3D 효과를 위한 원근감 추가
});

export const galleryImage = style({
  width: "100px",
  height: "150px",
  objectFit: "cover",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  transform: "scale(1)",
  transition: "transform 0.3s, margin 0.3s",
  transformOrigin: "center center",
});

export const leftImage = style({
  transform: "rotateY(30deg) translateX(-30px)", // 왼쪽 벽면에 붙은 효과
});

export const rightImage = style({
  transform: "rotateY(-30deg) translateX(30px)", // 오른쪽 벽면에 붙은 효과
});

export const person = style({
  width: "50px",
  height: "150px",
  backgroundColor: "#000000",
  borderRadius: "50%",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
});

export const navigationLinks = style({
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
});

export const navLink = style({
  margin: "0 15px",
  padding: "10px 20px",
  border: "2px solid white",
  borderRadius: "5px",
  color: "white",
  textDecoration: "none",
  transition: "background-color 0.3s, color 0.3s",
  ":hover": {
    backgroundColor: "white",
    color: "#1e1e1e",
  },
});

export const topNav = style({
  position: "absolute",
  top: "20px",
  right: "20px",
  display: "flex",
  gap: "10px",
});

export const topNavLink = style({
  color: "white",
  textDecoration: "none",
  fontSize: "14px",
  ":hover": {
    textDecoration: "underline",
  },
});
