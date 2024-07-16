import { style } from "@vanilla-extract/css";

export const keyboard = style({
  display: "grid",
  gap: "10px",
  backgroundColor: "#f0f0f0",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  justifyContent: "center",
  alignItems: "center",
  transformStyle: "preserve-3d",
  perspective: "1000px",
  "@media": {
    "screen and (max-width: 768px)": {
      margin: "10px",
      padding: "10px",
    },
    "screen and (max-width: 480px)": {
      margin: "5px",
      padding: "5px",
    },
  },
});

export const keyboardRow = style({
  display: "flex",
});

export const keyboardKey = style({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  fontSize: "18px",
  fontWeight: "bold",
  color: "#333",
  transition: "all 0.2s ease",
  transform: "translateZ(20px)",
  margin: "0 4px",
  ":active": {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transform: "translateZ(10px) translateY(2px)",
  },
  "@media": {
    "screen and (max-width: 768px)": {
      width: "45px",
      height: "45px",
      fontSize: "16px",
      transform: "translateZ(15px)",
      ":active": {
        transform: "translateZ(7.5px) translateY(2px)",
      },
    },
    "screen and (max-width: 480px)": {
      width: "30px",
      height: "30px",
      fontSize: "14px",
      transform: "translateZ(10px)",
      ":active": {
        transform: "translateZ(5px) translateY(2px)",
      },
    },
  },
});
export const spaceKey = style({
  width: "540px",
});

export const longKey = style({
  width: "130px",
});

export const shiftKey = style({
  width: "164px",
});
