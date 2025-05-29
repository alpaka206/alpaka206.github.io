import styled from "styled-components";

export const TaskbarContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100vw;
  height: 40px;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 4px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1001;
`;

export const TaskbarItem = styled.div<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 100%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${({ isActive }) => (isActive ? "#444" : "transparent")};

  &:hover {
    background-color: #555;
  }
`;

export const Icon = styled.img`
  width: 30px;
  height: 30px;
`;