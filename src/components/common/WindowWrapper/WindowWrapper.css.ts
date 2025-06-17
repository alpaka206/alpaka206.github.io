import styled from "styled-components";

export const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #dfdfdf;
`;

export const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
`;

export const TabSide = styled.div`
  width: 6px;
  height: 100%;
  background-color: #ffffff;
`;

export const LeftTabSideElement = styled.div`
  width: 6px;
  background-color: #dfdfdf;
  height: 100%;
  border-radius: 0 0 8px 0;
`;

export const TabButton = styled.button<{ isActive?: boolean }>`
  padding: ${({ isActive }) => (isActive ? "6px 8px 14px 0" : "6px 8px 6px 0")};
  border: none;
  background-color: ${({ isActive }) => (isActive ? "#ffffff" : "#dfdfdf")};
  cursor: pointer;
  width: 155px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px 8px 0 0;
  margin: ${({ isActive }) => (isActive ? "6px 0 0 0" : "6px 0 8px 0")};
  font-size: 12px;
  font-weight: 400;
  user-select: none;
  &:hover {
    background-color: ${({ isActive }) =>
      isActive ? "#ffffff" : "rgba(255, 255, 255, 0.5)"};
  }
`;

export const TabButtonImage = styled.img`
  width: 16px;
  height: 16px;
  margin-left: 8px;
  margin-right: 8px;
`;

export const TabTitle = styled.div`
  width: 100%;
  height: 100%;
  text-align: left;
`;

export const CloseTabButton = styled.img`
  width: 7.5px;
  height: 7.5px;
  padding: 0;
  display: flex;
  margin-left: auto;
  user-select: none;
`;

export const RightTabSideElement = styled.div`
  width: 6px;
  background-color: #dfdfdf;
  height: 100%;
  border-radius: 0 0 0 8px;
`;

export const CloseButton = styled.img`
  font-size: 30px;
  width: 12px;
  height: 12px;
  margin-right: 10px;
  user-select: none;
`;
