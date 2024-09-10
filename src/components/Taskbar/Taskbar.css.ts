import { style } from "@vanilla-extract/css";

export const taskbar = style({
  position: "fixed",
  bottom: 0,
  marginLeft: "-36px",
  width: "100vw",
  height: "50px",
  backgroundColor: "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  padding: "0 4px",
  boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
  zIndex: 1001, // 작업 표시줄이 항상 위에 보이도록 z-index 설정
});

export const taskbarItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // 로고만 중앙에 오도록 설정
  width: "50px", // 로고 크기에 맞춰 아이템 크기 설정
  height: "100%",
  color: "#fff",
  cursor: "pointer",
  transition: "background-color 0.3s ease",

  ":hover": {
    backgroundColor: "#555",
  },
});

export const active = style({
  backgroundColor: "#444",
});

export const icon = style({
  width: "30px", // 아이콘 크기 조정
  height: "30px",
});
