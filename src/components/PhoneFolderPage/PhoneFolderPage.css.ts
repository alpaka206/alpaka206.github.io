import { style } from "@vanilla-extract/css";

export const folderPage = style({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#828282",
  zIndex: 1,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const phoneFolderText = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "112px 0",
  fontSize: "36px",
  color: "#fff",
  fontWeight: "bold",
});

export const phoneFolderContainer = style({
  width: "calc(90% - 20px)",
  display: "grid",
  backgroundColor: "#585858",
  gridTemplateColumns: "repeat(4, 1fr)",
  padding: "10px ",
  borderRadius: "25px",
  height: "50%",
  justifyItems: "center",
});
