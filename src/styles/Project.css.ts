import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  width: calc(100% - 40px);
  margin: 0 auto;
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f9f9f9;
`;

export const BackButton = styled.img`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-bottom: 20px;
    background-color: #ffffff;
    width: 20px;
    height: 20px;
    padding: 10px;
    border-radius: 100px;
  }
`;

export const Top = styled.div`
  font-size: 16px;
  margin-bottom: 10px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const TitleImage = styled.img`
  width: 80%;
`;

export const ExpContainer = styled.div`
  display: flex;
  margin: 15px 0;
`;

export const ExpTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 15%;
  color: #555;

  @media (max-width: 768px) {
    min-width: 25%;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Item = styled.div<{ bgColor?: string }>`
  background-color: ${({ bgColor }) => bgColor || "#f9f9f9"};
  border-radius: 8px;
  padding: 0 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  height: 1px;
  background-color: #ddd;
  margin-bottom: 10px;
`;

export const Subtitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
  color: #000;
`;

export const FunctionTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const ProjectImage = styled.img`
  width: 40%;
  margin: 10px 5%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

export const ItemWithDot = styled.div`
  position: relative;
  padding-left: 20px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #333;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #333;
  }
`;

export const ProjectImageFullWidth = styled.img`
  width: 40%;
  margin: 10px 5%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 90%;
  }
`;
