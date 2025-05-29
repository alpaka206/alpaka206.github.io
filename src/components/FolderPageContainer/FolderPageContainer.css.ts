import styled from "styled-components";

export const FolderPage = styled.div`
  position: absolute;
  width: 500px;
  height: 400px;
  background-color: #fefefe;
  border: 1px solid #888;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
`;

export const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #ddd;
`;

export const CloseButton = styled.img`
  font-size: 20px;
  cursor: pointer;
`;

export const FolderContainer = styled.div`
  display: flex;
`;
