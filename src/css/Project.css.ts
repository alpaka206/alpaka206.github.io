import { style, globalStyle } from "@vanilla-extract/css";

globalStyle(".projectContainer", {
  padding: "20px",
  width: "calc(100% - 40px)",
  margin: "0 auto",
  fontFamily: "Arial, sans-serif",
  lineHeight: "1.6",
  color: "#333",
  backgroundColor: "#f9f9f9",
});

globalStyle(".projectTop", {
  fontSize: "16px",
  marginBottom: "10px",
});

globalStyle(".projectTitle", {
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
});

globalStyle(".projectDivider", {
  width: "100%",
  border: "0",
  height: "1px",
  backgroundColor: "#ddd",
  marginBottom: "10px",
});

globalStyle(".projectImage", {
  maxWidth: "100%",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

globalStyle(".projectExpCatainer", {
  display: "flex",
  margin: "15px 0",
});

globalStyle(".projectExpTitle", {
  fontSize: "18px",
  fontWeight: "600",
  width: "15%",
  color: "#555",
});

globalStyle(".content", {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  // marginBottom: "15px",
});

globalStyle(".item", {
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  padding: "0px 8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  fontSize: "14px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
});

globalStyle(".subTitle", {
  fontSize: "24px",
  fontWeight: "800",
  marginBottom: "8px",
  color: "#000",
});

globalStyle(".itemWithDot", {
  position: "relative",
  paddingLeft: "20px",
  marginBottom: "10px",
  fontSize: "16px",
  fontWeight: "700",
  color: "#333",
});

globalStyle(".itemWithDot::before", {
  content: '""',
  position: "absolute",
  left: "0",
  top: "50%",
  transform: "translateY(-50%)",
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  backgroundColor: "#333", // 점의 색상
});

globalStyle(".FunctionTitle", {
  fontSize: "18px",
  fontWeight: "700",
});

globalStyle(".projectTitleImage", {
  width: "80%",
});

globalStyle(".projectImage", {
  width: "40%",
  margin: "10px 5%",
  // boxShadow: "none",
  // border: "1px solid",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

globalStyle(".project_Back_button", {
  display: "none",
  "@media": {
    "screen and (max-width: 980px)": {
      display: "block",
      marginBottom: "20px",
      backgroundColor: "#ffffff",
      width: "20px",
      height: "20px",
      padding: "10px",
      borderRadius: "100px",
    },
  },
});

export const title = style({
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "10px",
  borderBottom: "2px solid #ddd",
  paddingBottom: "5px",
});

// export const content = style({
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "10px",
//   marginBottom: "15px",
// });

// export const item = style({
//   backgroundColor: "#f9f9f9",
//   borderRadius: "8px",
//   padding: "10px 15px",
//   boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//   fontSize: "14px",
//   fontWeight: "500",
// });

export const imageContainer = style({
  textAlign: "center",
  marginBottom: "20px",
});

export const image = style({
  maxWidth: "100%",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});
