import { style, globalStyle } from "@vanilla-extract/css";

export const Profile = style({
  display: "flex",
  width: "100%",
  margin: "0 auto",
  fontFamily: `'Arial', sans-serif`,
  color: "#333",
  backgroundColor: "#f9f9f9",
  "@media": {
    "screen and (max-width: 980px)": {
      display: "block",
      paddingTop: "5%",
    },
  },
});

export const Back_button = style({
  display: "none",
  "@media": {
    "screen and (max-width: 980px)": {
      display: "block",
      marginLeft: "5%",
      backgroundColor: "#ffffff",
      width: "20px",
      height: "20px",
      padding: "10px",
      borderRadius: "100px",
    },
  },
});

export const Profile_Nav = style({
  position: "fixed", // 네비게이션을 고정
  height: "50vh", // 화면 전체 높이
  width: "110px", // 네비게이션 너비
  color: "#333",
  padding: "40px 0 50vh 40px",
  borderRight: "2px solid black",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  "@media": {
    "screen and (max-width: 980px)": {
      display: "none",
    },
  },
});

export const Profile_Nav_Item = style({
  cursor: "pointer",
  fontWeight: "bold",
  ":hover": {
    textDecoration: "underline",
  },
  fontSize: "16px",
  marginBottom: "10px",
});

export const Profile_Content = style({
  marginLeft: "150px",
  width: "calc(100% - 150px)",
  "@media": {
    "screen and (max-width: 980px)": {
      marginLeft: "0px",
      width: "100%",
    },
  },
});

export const Profile_Info = style({
  display: "flex",
  padding: "20px 30px",
  // margin: "40px 40px",
});

export const ProfileImage = style({
  width: "160px",
  borderRadius: "50px",
  marginRight: "20px",
  // objectFit: "cover",
  // objectFit: "contain",
  height: "213px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  "@media": {
    "screen and (max-width: 980px)": {
      width: "100px",
      height: "133px",
    },
  },
});
export const Profile_Info_Explain = style({
  display: "flex",
  flexDirection: "column",
});

export const Profile_Info_Name = style({
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "8px",
  "@media": {
    "screen and (max-width: 980px)": {
      fontSize: "18px",
    },
  },
});

export const Profile_Info_Date = style({
  fontSize: "16px",
  color: "#777",
  marginBottom: "8px",
  "@media": {
    "screen and (max-width: 980px)": {
      fontSize: "14px",
    },
  },
});
export const Profile_Info_Comment = style({
  fontSize: "14px",
  lineHeight: "1.6",
  "@media": {
    "screen and (max-width: 980px)": {
      fontSize: "12px",
    },
  },
});

export const Profile_Conatiner = style({
  padding: "20px 30px",
});

export const Profile_MainTitle = style({
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
});
export const Profile_SubTitle = style({
  fontSize: "18px",
  fontWeight: "bold",
  marginTop: "20px",
  marginBottom: "10px",
});
export const Profile_detail = style({
  fontSize: "14px",
  marginBottom: "8px",
});
export const Profile_detail_link = style({
  color: "#0073e6",
  textDecoration: "none",
  ":hover": {
    textDecoration: "underline",
  },
});
export const Profile_Languages = style({
  margin: "20px 0",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
});
export const Profile_Tools = style([Profile_Languages]);

export const Divider = style({
  width: "100%",
  border: "0",
  height: "1px",
  backgroundColor: "#ddd",
});

export const Profile_list = style({
  paddingLeft: "20px",
  marginBottom: "20px",
});

export const Profile_list_item = style({
  fontSize: "14px",
  marginBottom: "5px",
});

export const Profile_Contact_Icon = style({
  width: "18px",
  marginRight: "8px",
  verticalAlign: "middle",
});

export const Profile_SkillLevel = style({
  fontSize: "16px",
  fontWeight: "bold",
  marginTop: "15px",
  marginBottom: "8px",
  color: "#555",
});
