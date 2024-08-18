import { style } from "@vanilla-extract/css";

export const container = style({
  padding: "34px 64px",
  width: "calc(100vw - 128px)",
  height: "calc(100vh - 68px)",
  backgroundImage: "url(../../public/assets/BG_pc.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",

  "@media": {
    "screen and (max-width: 768px)": {
      backgroundImage: "url(../../public/assets/BG_phone.png)",
    },
  },
});

export const folderContainer = style({
  display: "flex",
});

export const projectFolderContainer = style({
  display: "flex",
  justifyContent: "space-around",
  width: "60%",
  marginTop: "20px",
});
