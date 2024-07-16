import { style, keyframes } from "@vanilla-extract/css";

const fadeOut = keyframes({
  "0%": {
    opacity: 1,
    transform: "translateX(0)",
  },
  "100%": {
    opacity: 0,
    transform: "translateX(-100%)",
  },
});

const fadeIn = keyframes({
  "0%": {
    opacity: 0,
    transform: "translateX(100%)",
  },
  "100%": {
    opacity: 1,
    transform: "translateX(0)",
  },
});

export const container = style({
  color: "#333",
  backgroundColor: "#0a011f",
  padding: "20px 40px",
  height: "100vh",
  // display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 1s ease-in-out",
  animation: `${fadeIn} 1s forwards`,
  "@media": {
    "(max-width: 768px)": {
      padding: "20px 20px",
    },
  },
});
export const fadeOutAnimation = style({
  animation: `${fadeOut} 1s forwards`,
});
export const header = style({
  fontSize: "80px",
  fontWeight: "bold",
  color: "#ffffff",
  marginTop: "120px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "40px",
      marginTop: "50px",
    },
  },
});

export const subHeader = style({
  fontSize: "40px",
  margin: "20px 0",
  color: "#ffffff",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "20px",
    },
  },
});

export const introText = style({
  fontSize: "20px",
  margin: "20px 0",
  color: "#ffffff",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "15px",
    },
  },
});

export const enterButton = style({
  fontSize: "20px",
  color: "#000000",
  backgroundColor: "#ffffff",
  display: "inline-block",
  padding: "10px 20px",
  borderRadius: "28px",
  "@media": {
    "(max-width: 768px)": {
      fontSize: "15px",
      padding: "8px 16px",
    },
  },
});
