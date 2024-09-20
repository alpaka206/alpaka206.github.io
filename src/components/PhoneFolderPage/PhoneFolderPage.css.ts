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
  margin: "25% 0",
  fontSize: "36px",
  color: "#fff",
  fontWeight: "bold",
  "@media": {
    "screen and (min-width: 970px)": {
      fontSize: "7em",
    },
  },
});

export const phoneFolderContainer = style({
  width: "84%",
  // width: "calc(90% - 20px)",
  display: "grid",
  backgroundColor: "#585858",
  gridTemplateColumns: "repeat(4, 1fr)",
  padding: "3%",
  borderRadius: "8%",
  // height: "calc(50% - 20px)",
  height: "44%",
  justifyItems: "center",
});
