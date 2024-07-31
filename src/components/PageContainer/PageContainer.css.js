// PageContainer.css.ts
import { style } from "@vanilla-extract/css";
export const modal = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    zIndex: 1000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
});
export const modalContent = style({
    backgroundColor: "#fefefe",
    margin: "auto",
    padding: "20px",
    border: "1px solid #888",
    width: "80%",
    maxWidth: "600px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
});
export const modalHeader = style({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
});
export const closeButton = style({
    color: "#aaa",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
    ":hover": {
        color: "black",
    },
});
export const modalBody = style({
    marginTop: "10px",
    height: "calc(40%)",
    overflow: "auto",
});
