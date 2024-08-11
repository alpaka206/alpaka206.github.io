import { style } from "@vanilla-extract/css";

export const folderPage = style({
  position: "absolute",
  width: "500px",
  height: "400px",
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
});

export const folderTitle = style({
  fontWeight: "bold",
  fontSize: "18px",
});

export const tabs = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  padding: "10px",
  backgroundColor: "#f0f0f0",
  borderBottom: "1px solid #ddd",
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

export const folderContainer = style({
  display: "flex",
});
