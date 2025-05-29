import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url("/assets/BGimage.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    background: linear-gradient(135deg, #1a237e, #3949ab);
  }
`;

export const FolderGrid = styled.div`
  @media (max-width: 768px) {
    padding: 20px 10px 0;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 20px;
    column-gap: 12px;
    justify-items: center;
  }
`;
