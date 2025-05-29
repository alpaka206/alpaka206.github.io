import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  font-family: 'Arial', sans-serif;
  color: #333;
  background-color: #f9f9f9;

  @media screen and (max-width: 980px) {
    display: block;
    padding-top: 5%;
  }
`;

export const BackButton = styled.img`
  display: none;
  @media screen and (max-width: 980px) {
    display: block;
    margin-left: 5%;
    background-color: #ffffff;
    width: 20px;
    height: 20px;
    padding: 10px;
    border-radius: 100px;
  }
`;

export const ProfileNav = styled.div`
  position: fixed;
  height: 50vh;
  width: 110px;
  color: #333;
  padding: 40px 0 50vh 40px;
  border-right: 2px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media screen and (max-width: 980px) {
    display: none;
  }
`;

export const ProfileNavItem = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProfileContent = styled.div`
  margin-left: 150px;
  width: calc(100% - 150px);

  @media screen and (max-width: 980px) {
    margin-left: 0;
    width: 100%;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  padding: 20px 30px;
`;

export const ProfileImage = styled.img`
  width: 160px;
  border-radius: 50px;
  margin-right: 20px;
  height: 213px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 980px) {
    width: 100px;
    height: 133px;
  }
`;

export const ProfileInfoExplain = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ProfileInfoName = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;

  @media screen and (max-width: 980px) {
    font-size: 18px;
  }
`;

export const ProfileInfoDate = styled.div`
  font-size: 16px;
  color: #777;
  margin-bottom: 8px;

  @media screen and (max-width: 980px) {
    font-size: 14px;
  }
`;

export const ProfileInfoComment = styled.div`
  font-size: 14px;
  line-height: 1.6;

  @media screen and (max-width: 980px) {
    font-size: 12px;
  }
`;

export const SectionContainer = styled.div`
  padding: 20px 30px;
`;

export const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

export const SectionSubTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export const SectionDetail = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

export const SectionLink = styled.a`
  color: #0073e6;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const TagContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  height: 1px;
  background-color: #ddd;
`;

export const List = styled.ul`
  padding-left: 20px;
  margin-bottom: 20px;
`;

export const ListItem = styled.li`
  font-size: 14px;
  margin-bottom: 5px;
`;

export const ContactIcon = styled.img`
  width: 18px;
  margin-right: 8px;
  vertical-align: middle;
`;

export const SkillLevel = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 8px;
  color: #555;
`;