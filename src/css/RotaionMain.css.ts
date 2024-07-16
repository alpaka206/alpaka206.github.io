import { style, keyframes } from "@vanilla-extract/css";

const rotateAxis = keyframes({
  from: {
    transform: "rotateZ(350deg) perspective(800px) rotateY(0deg)",
  },
  to: {
    transform: "rotateZ(350deg) perspective(800px) rotateY(360deg)",
  },
});

export const satellites = style({
  animation: `${rotateAxis} 50s linear infinite`,
  transformStyle: "preserve-3d",
  display: "flex",
  justifyContent: "center",
  position: "relative",
});

export const satellite = style({
  position: "absolute",
  width: "100px",
  transform: "rotateY(calc(var(--i) * 1deg)) translateZ(40vw)",
  "@media": {
    "(max-width: 768px)": {
      // Adjust for smaller screens
      width: "15vw",
      transform: "rotateY(calc(var(--i) * 1deg)) translateZ(300px)",
    },
  },
});
