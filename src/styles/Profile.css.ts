import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  min-height: 100vh;
  font-family: "Arial", sans-serif;
  background-color: #f9f9f9;
  color: #1a1a1a;

  @media (max-width: 768px) {
    display: block;
    padding-top: 5%;
  }
  // @media (max-width: 768px) {
  //   flex-direction: column;
  //   padding-top: 56px;
  // }
`;

export const BackButton = styled.img`
  display: none;
  @media (max-width: 768px) {
    display: block;
    margin-left: 5%;
    background-color: #ffffff;
    width: 20px;
    height: 20px;
    padding: 10px;
    border-radius: 100px;
  }
  // @media (max-width: 768px) {
  //   display: block;
  //   position: absolute;
  //   top: 12px;
  //   left: 12px;
  //   background-color: #fff;
  //   width: 24px;
  //   height: 24px;
  //   padding: 8px;
  //   border-radius: 50%;
  //   box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  //   cursor: pointer;
  // }
`;

export const ProfileNav = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 120px;
  padding: 60px 0 60px 32px;
  border-right: 1px solid #e5e5e5;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavItem = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #444;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #007aff;
  }
`;

export const ContentArea = styled.main`
  margin-left: 160px;
  width: 100%;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 24px;
  }
`;

export const IntroSection = styled.section`
  display: flex;
  gap: 24px;
  align-items: center;
  margin: 24px 0;
`;

export const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

export const IntroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Name = styled.h1`
  font-size: 22px;
  font-weight: 700;
`;

export const SubText = styled.span`
  font-size: 15px;
  color: #777;
`;

export const Paragraph = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #444;
`;

export const Section = styled.section`
  margin: 24px 0;
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

export const TechTagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
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

// ==================================================

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

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const ProfileInfoDate = styled.div`
  font-size: 16px;
  color: #777;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

export const ProfileInfoComment = styled.div`
  font-size: 14px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const SectionContainer = styled.div`
  padding: 20px 30px;
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

export const ProjectCard = styled.div`
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  background-color: #fafafa;
`;

export const ProjectHeader = styled.div`
  margin-bottom: 12px;
`;

export const ProjectTitle = styled.h3`
  font-size: 18px;
  color: #0070f3;
  font-weight: bold;
  text-decoration: none;
`;

export const ProjectSubTitle = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #555;
`;

export const ProjectDescription = styled.p`
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.5;
`;

export const TechBadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TechBadge = styled.span`
  background-color: #eee;
  color: #333;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
`;
