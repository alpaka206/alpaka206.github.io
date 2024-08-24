import { style } from "@vanilla-extract/css";
// import { exp } from "three/webgpu";

export const window = style({
  position: "absolute",
  width: "80%",
  height: "90%",
  backgroundColor: "#fefefe",
  border: "1px solid #888",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  overflow: "hidden",
});

export const windowHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#DFDFDF",
});

export const tabs = style({
  display: "flex",
  flexDirection: "row",
  height: "40px",
});

export const tabButton = style({
  padding: "6px 8px 14px 0",
  border: "none",
  backgroundColor: "#DFDFDF",
  cursor: "pointer",
  // height: "14px",
  width: "155px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "8px 8px 0px 0px",
  margin: "6px 0 0 0",
  fontSize: "12px",
  fontWeight: "400",
  userSelect: "none",
});

export const tabButtonImage = style({
  width: "16px",
  height: "16px",
  marginLeft: "8px",
  marginRight: "8px",
});
export const tabTitle = style({
  width: "100%",
  height: "100%",
  textAlign: "left",
});

export const unactiveTab = style({
  ":hover": {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: "8px",
    padding: "6px 8px 6px 0",
    margin: "6px 0 8px 0",
    // height: "35px",
  },
});

export const activeTab = style({
  backgroundColor: "#ffffff",
});

export const closeTabButton = style({
  width: "7.5px",
  height: "7.5px",
  padding: "0",
  display: "flex",
  marginLeft: "auto",
  userSelect: "none",
});

export const closeButton = style({
  fontSize: "30px",
  width: "12px",
  height: "12px",
  marginRight: "10px",
  userSelect: "none",
});

export const windowBody = style({
  // padding: "20px",
  // height: "calc(100% - 60px)",
  height: "120%",
  overflowY: "auto",
});

export const TabSide = style({
  width: "6px",
  height: "100%",

  backgroundColor: "#ffffff",
});

export const leftTabSideElement = style({
  width: "6px",
  backgroundColor: "#DFDFDF",
  height: "100%",
  borderRadius: " 0 0 8px 0",
});

export const rightTabSideElement = style({
  width: "6px",
  backgroundColor: "#DFDFDF",
  height: "100%",
  borderRadius: " 0 0 0 8px",
});
