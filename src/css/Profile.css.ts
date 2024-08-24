import { style } from "@vanilla-extract/css";

export const Profile = style({
  display: "flex",
  width: "100%",
  margin: "0 auto",
  fontFamily: `'Arial', sans-serif`,
  color: "#333",
  backgroundColor: "#f9f9f9",
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
});

export const Profile_Nav_Item = style({
  cursor: "pointer",
  fontWeight: "bold",
  ":hover": {
    textDecoration: "underline",
  },
  marginBottom: "10px",
});

export const Profile_Content = style({
  marginLeft: "150px",
  width: "calc(100% - 150px)",
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
  objectFit: "cover",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});
export const Profile_Info_Explain = style({
  display: "flex",
  flexDirection: "column",
  // alignItems: "center",
  // justifyContent: "center",
});

export const Profile_Info_Name = style({
  fontSize: "24px",
  fontWeight: "bold",
  marginBottom: "8px",
});

export const Profile_Info_Date = style({
  fontSize: "16px",
  color: "#777",
  marginBottom: "8px",
});
export const Profile_Info_Comment = style({
  fontSize: "14px",
  lineHeight: "1.6",
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
