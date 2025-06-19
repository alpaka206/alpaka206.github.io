import styled from "styled-components";

export const FolderPage = styled.div`
  position: absolute;
  width: 550px;
  height: 400px;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
`;

export const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f2f2;
  padding: 0px 0px 4px 14px;
  border-bottom: 1px solid #d0d0d0;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #1f1f1f;
  font-weight: 500;
  gap: 6px;
`;

export const Body = styled.div`
  display: flex;
  padding: 6px 9px;
`;
