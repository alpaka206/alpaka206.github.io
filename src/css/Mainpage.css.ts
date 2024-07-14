import { style } from "@vanilla-extract/css";

export const container = style({
  textAlign: "center",
  color: "#333",
  backgroundColor: "#0a011f",
  padding: "20px",
  height: "100vh",
  borderRadius: "10px",
});

export const header = style({
  fontSize: "3em",
  fontWeight: "bold",
  color: "#ffffff",
});

export const subHeader = style({
  fontSize: "2em",
  color: "#34495e",
});

export const introText = style({
  fontSize: "1.2em",
  margin: "20px 0",
});
