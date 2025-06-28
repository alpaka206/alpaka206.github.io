import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 10px 30px;
  height: calc(100vh - 20px);
  background-color: #f9f9f9;
`;

export const BackButton = styled.img`
  display: none;
  @media (max-width: 768px) {
    display: block;
    width: 20px;
    height: 20px;
    padding: 10px;
    background-color: #ffffff;
    border-radius: 100px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;
