import { style } from "@vanilla-extract/css";

export const window = style({
  position: "absolute",
  width: "80%",
  height: "90%",
  backgroundColor: "#fefefe",
  border: "1px solid #888",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
  overflow: "hidden",
});

export const windowHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px",

  backgroundColor: "#ddd",
  // cursor: "move",
});

export const tabs = style({
  display: "flex",
  flexDirection: "row",
});

export const tabButton = style({
  padding: "10px",
  border: "none",
  backgroundColor: "#eee",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#ddd",
  },
});

export const activeTab = style({
  borderBottom: "2px solid #000",
});

export const closeButton = style({
  fontSize: "20px",
  cursor: "pointer",
});

export const windowBody = style({
  padding: "20px",
  height: "calc(100% - 60px)", // Adjust height to account for header
  overflowY: "auto",
});
